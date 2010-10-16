/*
---
script: StyleWriter.js

description: Provides a simple method for injecting a css style element into the DOM if it's not already present.

license: MIT-Style License

requires:
- Core/Class
- Core/DomReady
- Core/Element
- /dbug

provides:
- StyleWriter

...
*/

var StyleWriter = new Class({
	createStyle: function(css, id) {
		window.addEvent('domready', function(){
			try {
				if (document.id(id) && id) return;
				var style = new Element('style', {id: id||''}).inject($$('head')[0]);
				if (Browser.ie) style.styleSheet.cssText = css;
				else style.set('text', css);
			}catch(e){dbug.log('error: %s',e);}
		}.bind(this));
	}
});