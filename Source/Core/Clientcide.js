/*
Script: Clientcide.js
	The Clientcide namespace.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Clientcide = {
	version: '%build%',
	setAssetLocation: function(baseHref) {
		var clean = function(str){
			return str.replace(/\/\//g, '/');
		}
		if (window.StickyWin && StickyWin.UI) {
			StickyWin.UI.implement({
				options: {
					baseHref: clean(baseHref + '/stickyWinHTML/')
				}
			});
			if (StickyWin.alert) {
				var CGFsimpleErrorPopup = StickyWin.alert.bind(window);
				StickyWin.alert = function(msghdr, msg, base) {
				    return CGFsimpleErrorPopup(msghdr, msg, base||clean(baseHref + "/simple.error.popup"));
				};
			}
			if (StickyWin.UI.Pointy) {
				StickyWin.UI.Pointy.implement({
					options: {
						baseHref: clean(baseHref + '/PointyTip/')
					}
				});
			}
		}
		if (window.TagMaker) {
			TagMaker.implement({
			    options: {
			        baseHref: clean(baseHref + '/tips/')
			    }
			});
		}
		if (window.ProductPicker) {
			ProductPicker.implement({
			    options:{
			        baseHref: clean(baseHref + '/Picker')
			    }
			});
		}

		if (window.Autocompleter) {
			Autocompleter.Base.implement({
					options: {
						baseHref: clean(baseHref + '/autocompleter/')
					}
			});
		}

		if (window.Lightbox) {
			Lightbox.implement({
			    options: {
			        assetBaseUrl: clean(baseHref + '/slimbox/')
			    }
			});
		}

		if (window.Waiter) {
			Waiter.implement({
				options: {
					baseHref: clean(baseHref + '/waiter/')
				}
			});
		}
	},
	preLoadCss: function(){
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