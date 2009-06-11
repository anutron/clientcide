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
		rows: []
	},
	initialize: function(options) {
		this.setOptions(options);
		this.table = new Element('table').setProperties(this.options.properties);
		this.table.store('HtmlTable', this);
		this.tbody = new Element('tbody').inject(this.table);
		this.options.rows.each(this.push.bind(this));
		["adopt", "inject", "wraps", "grab", "replaces", "empty", "dispose"].each(function(method){
				this[method] = this.table[method].bind(this.table);
		}, this);
	},
	toElement: function(){
		return this.table;
	},
	push: function(row) {
		var tr = new Element('tr').inject(this.tbody);
		var tds = row.map(function (tdata) {
			tdata = tdata || '';
			var td = new Element('td').inject(tr);
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