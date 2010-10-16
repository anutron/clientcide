/*
---
name: AutoCompleter.Clientcide.js

description: Adds Clientcide css assets to autocompleter automatically.

license: MIT-Style License

requires:
- /Autocompleter.Base

provides: Autocompleter.Clientcide
...
*/
(function(){
	Autocompleter.Base = Class.refactor(Autocompleter.Base, {
		initialize: function(a1,a2,a3) {
			this.previous(a1,a2,a3);
			this.writeStyle();
		},
		writeStyle: function(){
			window.addEvent('domready', function(){
				if (document.id('AutocompleterCss')) return;
				new Element('link', {
					rel: 'stylesheet', 
					media: 'screen', 
					type: 'text/css', 
					href: (this.options.baseHref || Clientcide.assetLocation + '/autocompleter')+'/Autocompleter.css', 
					id: 'AutocompleterCss'
				}).inject(document.head);
			}.bind(this));
		}
	});
})();
