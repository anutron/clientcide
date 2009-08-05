/*
Script: InputFocus.js
	Adds a focused css class to inputs when they have focus.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var InputFocus = new Class({
	Implements: [Options, Class.Occlude, Class.ToElement],
	Binds: ['focus', 'blur'],
	options: {
		focusedClass: 'focused',
		hideOutline: false
	},
	initialize: function(input, options) {
		this.element = document.id(input);
		if (this.occlude('focuser')) return this.occluded;
		this.setOptions(options);
		this.element.addEvents({
			focus: this.focus,
			blur: this.blur
		});
	},
	focus: function(){
		if (this.options.hideOutline) {
			(function(){
				if (Browser.Engine.trident) document.id(this).set('hideFocus', true);
				else document.id(this).setStyle('outline', '0');
			}).delay(500, this);
		}
		document.id(this).addClass(this.options.focusedClass);
	},
	blur: function(){
		document.id(this).removeClass(this.options.focusedClass);
	}
});