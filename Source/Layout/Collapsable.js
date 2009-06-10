/*
Script: Collapsable.js
	Enables a dom element to, when clicked, hide or show (it toggles) another dom element. Kind of an Accordion for one item.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Collapsable = new Class({
	Extends: Fx.Reveal,
	initialize: function(clicker, section, options) {
		this.clicker = document.id(clicker);
		this.section = document.id(section);
		this.parent(this.section, options);
		this.addEvents();
	},
	addEvents: function(){
		this.clicker.addEvent('click', this.toggle.bind(this));
	}
});