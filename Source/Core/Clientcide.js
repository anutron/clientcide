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
		};
		var test = function(val) {
			return window[val] && $type(window[val]) == "function";
		};
		if (test('StickyWin') && StickyWin.UI) {
			StickyWin.UI.implement({
				options: {
					baseHref: clean(baseHref + '/stickyWinHTML/')
				}
			});
			if ($('defaultStickyWinStyle')) $('defaultStickyWinStyle').destroy();
			if (StickyWin.Alert) {
				StickyWin.Alert.implement({
					options: {
						baseHref: baseHref + "/simple.error.popup"
					}
				});
			}
			if (StickyWin.UI.Pointy) {
				StickyWin.UI.Pointy.implement({
					options: {
						baseHref: clean(baseHref + '/PointyTip/')
					}
				});
				if ($('defaultPointyTipStyle')) $('defaultPointyTipStyle').destroy();
			}
		}
		if (test('TagMaker')) {
			TagMaker.implement({
					options: {
							baseHref: clean(baseHref + '/tips/')
					}
			});
		}
		if (test('ProductPicker')) {
			ProductPicker.implement({
					options:{
							baseHref: clean(baseHref + '/Picker')
					}
			});
		}

		if (test('Autocompleter')) {
			Autocompleter.Base.implement({
					options: {
						baseHref: clean(baseHref + '/autocompleter/')
					}
			});
		}

		if (test('Lightbox')) {
			Lightbox.implement({
					options: {
							assetBaseUrl: clean(baseHref + '/slimbox/')
					}
			});
		}

		if (Clientcide.preloaded) Clientcide.preLoadCss();
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