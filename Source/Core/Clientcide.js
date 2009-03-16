/*
Script: Clientcide.js
	The Clientcide namespace.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Clientcide = {
	version: '%build%',
	setAssetLocation: function(baseHref) {
		if (window.StickyWin && StickyWin.ui) {
			StickyWin.UI = Class.refactor(StickyWin.UI, {
				options: {
					baseHref: baseHref + '/stickyWinHTML/'
				}
			});
			if (StickyWin.alert) {
				var CGFsimpleErrorPopup = StickyWin.alert.bind(window);
				StickyWin.alert = function(msghdr, msg, base) {
				    return CGFsimpleErrorPopup(msghdr, msg, base||baseHref + "/simple.error.popup");
				};
			}
		}
		if (window.TagMaker) {
			TagMaker = Class.refactor(TagMaker, {
			    options: {
			        baseHref: baseHref + '/tips/'
			    }
			});
		}
		if (window.ProductPicker) {
			ProductPicker = Class.refactor(ProductPicker, {
			    options:{
			        baseHref: baseHref + '/Picker'
			    }
			});
		}

		if (window.Autocompleter) {
			var AcClientcide = {
					options: {
						baseHref: baseHref + '/autocompleter/'
					}
			};
			Autocompleter.Base = Class.refactor(Autocompleter.Base, AcClientcide);
			if (Autocompleter.Ajax) {
				["Base", "Xhtml", "Json"].each(function(c){
					if (Autocompleter.Ajax[c]) Autocompleter.Ajax[c] = Class.refactor(Autocompleter.Ajax[c], AcClientcide);
				});
			}
			if (Autocompleter.Local) Autocompleter.Local = Class.refactor(Autocompleter.Local, AcClientcide);
			if (Autocompleter.JSONP) {
				Autocompleter.JSONP = Class.refactor(Autocompleter.JSONP, AcClientcide);
				Autocompleter.JsonP = Autocompleter.JsonP;
			}
		}

		if (window.Lightbox) {
			Lightbox = Class.refactor(Lightbox, {
			    options: {
			        assetBaseUrl: baseHref + '/slimbox/'
			    }
			});
		}

		if (window.Waiter) {
			Waiter = Class.refactor(Waiter, {
				options: {
					baseHref: baseHref + '/waiter/'
				}
			});
		}
	},
	preLoadCss: function(){
		if (window.DatePicker) new DatePicker();
		if (window.ProductPicker) new ProductPicker();
		if (window.TagMaker) new TagMaker();
		if (window.StickyWin && StickyWin.ui) StickyWin.ui();
		if (window.StickyWin && StickyWin.pointy) StickyWin.pointy();
		Clientcide.preloaded = true;
		return true;
	},
	preloaded: false
};
(function(){
	if (!window.addEvent) return;
	var preload = function(){
		if (window.dbug) dbug.log('preloading clientcide css');
		if (!Clientcide.preloaded) Clientcide.preLoadCss();
	};
	window.addEvent('domready', preload);
	window.addEvent('load', preload);
})();
setCNETAssetBaseHref = Clientcide.setAssetLocation;