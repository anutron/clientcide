/*
Script: Element.MouseOvers.js

Collection of mouseover behaviours (images, class toggles, etc.).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Element.implement({
	autoMouseOvers: function(options){
		options = $extend({
			outString: '_out',
			overString: '_over',
			cssOver: 'hover',
			cssOut: 'hoverOut',
			subSelector: '',
			applyToBoth: false
		}, options);
		el = this;
		if (options.subSelector) {
			el = this.getElements(options.subSelector);
			if (el.every(function(kid){
				return kid.retrieve('autoMouseOverSetup');
			})) return this;
		}
		el.store('autoMouseOverSetup', true);
		return el.addEvents({
			mouseenter: function(){
				this.swapClass(options.cssOut, options.cssOver);
				if (this.src && this.src.contains(options.outString))
					this.src = this.src.replace(options.outString, options.overString);
				if (options.applyToBoth && options.subSelector) {
					this.getElements(options.subSelector).each(function(el){
						el.swapClass(options.cssOut, options.cssOver);
					});
				}
			}.bind(this),
			mouseleave: function(){
				this.swapClass(options.cssOver, options.cssOut);
				if (this.src && this.src.contains(options.overString))
					this.src = this.src.replace(options.overString, options.outString);
				if (options.applyToBoth && options.subSelector) {
					this.getElements(options.subSelector).each(function(el){
						el.swapClass(options.cssOver, options.cssOut);
					});
				}
			}.bind(this)
		}).swapClass(options.cssOver, options.cssOut);
		el = null;
	}
});
window.addEvent('domready', function(){
	$$('img.autoMouseOver').each(function(img){
		img.autoMouseOvers();
	});
});
