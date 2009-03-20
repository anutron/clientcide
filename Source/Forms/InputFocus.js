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
		this.element = $(input);
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
				if (Browser.Engine.trident) $(this).set('hideFocus', true);
				else $(this).setStyle('outline', '0');
			}).delay(500, this);
		}
		$(this).addClass(this.options.focusedClass);
	},
	blur: function(){
		$(this).removeClass(this.options.focusedClass);
	}
});