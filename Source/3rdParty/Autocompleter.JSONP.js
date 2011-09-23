/*
---
name: Autocompleter.JSONP

description: Implements Request.JSONP support for the Autocompleter class.

license: MIT-Style License

requires: [More/Request.JSONP, Autocompleter.Remote]

provides: [Autocompleter.JSONP]
...
*/

Autocompleter.JSONP = new Class({

	Extends: Autocompleter.Ajax.Json,

	options: {
		postVar: 'query',
		jsonpOptions: {},
//		onRequest: function(){},
//		onComplete: function(){},
//		filterResponse: function(){},
		minLength: 1
	},

	initialize: function(el, url, options) {
		this.url = url;
		this.setOptions(options);
		this.parent(el, options);
	},

	query: function(){
		var data = Object.clone(this.options.jsonpOptions.data||{});
		data[this.options.postVar] = this.queryValue;
		this.jsonp = new Request.JSONP(Object.merge({url: this.url, data: data},	this.options.jsonpOptions));
		this.jsonp.addEvent('onComplete', this.queryResponse.bind(this));
		this.fireEvent('onRequest', [this.element, this.jsonp, data, this.queryValue]);
		this.jsonp.send();
	},

	queryResponse: function(response) {
		this.parent();
		var data = (this.options.filter)?this.options.filter.apply(this, [response]):response;
		this.update(data);
	}

});
Autocompleter.JsonP = Autocompleter.JSONP;