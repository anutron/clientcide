/*
---
script: InputFocus.js

description: Adds a focused css class to inputs when they have focus.

license: MIT-Style License

requires:
- Core/Class.Extras
- Core/Element
- More/Class.Occlude
- More/Class.ToElement

provides:
- InputFocus

...
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