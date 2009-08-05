/*
Script: HtmlTable.js

Builds table elements with methods to add rows quickly.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var HtmlTable = new Class({
	Implements: [Options],
	options: {
		properties: {
			cellpadding: 0,
			cellspacing: 0,
			border: 0
		},
		rows: [],
		headers: []
	},
	initialize: function(options) {
		this.setOptions(options);
		this.table = new Element('table', this.options.properties);
		this.table.store('HtmlTable', this);
		if (this.options.headers.length) {
			this.setHeaders(this.options.headers);
		}
		this.tbody = new Element('tbody').inject(this.table);
		this.options.rows.each(this.push.bind(this));
		["adopt", "inject", "wraps", "grab", "replaces", "dispose"].each(function(method){
				this[method] = this.table[method].bind(this.table);
		}, this);
	},
	empty: function(){
		this.tbody.empty();
	},
	toElement: function(){
		return this.table;
	},
	setHeaders: function(headers){
		if (!this.thead) this.thead = new Element('thead').inject(this.table, 'top');
		else this.thead.empty();
		this.push(headers, this.thead, 'th');
	},
	setFooters: function(footers) {
		if (!this.tfoot) this.tfoot = new Element('tfoot').inject(this.table, 'top');
		this.push(footers, this.tfoot);
	},
	push: function(row, target, tag) {
		var tr = new Element('tr').inject(target || this.tbody);
		var tds = row.map(function (tdata) {
			tdata = tdata || '';
			var td = new Element(tag || 'td').inject(tr);
			if (tdata.properties) td.setProperties(tdata.properties);
			function setContent(content){
				if (document.id(content)) td.adopt(document.id(content));
				else td.set('html', content);
			};
			if ($defined(tdata.content)) setContent(tdata.content);
			else setContent(tdata);
			return td;
		}, this);
		return {tr: tr, tds: tds};
	}
});