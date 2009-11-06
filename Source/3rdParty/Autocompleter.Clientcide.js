/*
Script: AutoCompleter.Clientcide.js
	Adds Clientcide css assets to autocompleter automatically.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
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
