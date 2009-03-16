/*
Script: AutoCompleter.Clientcide.js
	Adds Clientcide css assets to autocompleter automatically.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	var AcClientcide = function(){
		return {
			options: {
				baseHref: 'http://www.cnet.com/html/rb/assets/global/autocompleter/'
			},
			initialize: function(a1,a2,a3) {
				this.parent(a1,a2,a3);
				this.writeStyle();
			},
			writeStyle: function(){
				window.addEvent('domready', function(){
					if ($('AutocompleterCss')) return;
					new Element('link', {
						rel: 'stylesheet', 
						media: 'screen', 
						type: 'text/css', 
						href: this.options.baseHref+'Autocompleter.css', 
						id: 'AutocompleterCss'
					}).inject(document.head);
				}.bind(this));
			}
		};
	};
	Autocompleter.Base.refactor(AcClientcide());
	if (Autocompleter.Ajax) {
		["Base", "Xhtml", "Json"].each(function(c){
			if (Autocompleter.Ajax[c]) Autocompleter.Ajax[c] = Autocompleter.Ajax[c].refactor(AcClientcide());
		});
	}
	if (Autocompleter.Local) Autocompleter.Local.refactor(AcClientcide());
	if (Autocompleter.JSONP) Autocompleter.JSONP.refactor(AcClientcide());
})();
