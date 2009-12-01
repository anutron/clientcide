/*
---
script: Autocompleter.Local

description: Allows Autocompleter to use an object in memory for autocompletion (instead of retrieving via ajax).

version: 1.1.1

license: MIT-style license
author: Harald Kirschner <mail [at] digitarald.de>
copyright: Author

requires:
- /Autocompleter.base

provides:
- Autocompleter.Local
...
 */
Autocompleter.Local = new Class({

	Extends: Autocompleter.Base,

	options: {
		minLength: 0,
		delay: 200
	},

	initialize: function(element, tokens, options) {
		this.parent(element, options);
		this.tokens = tokens;
	},

	query: function() {
		this.update(this.filter());
	}

});
