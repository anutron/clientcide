/*
Script: Collapsible.js
	Enables a dom element to, when clicked, hide or show (it toggles) another dom element. Kind of an Accordion for one item.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Collapsible = new Class({
	Extends: Fx.Reveal,
	initialize: function(clicker, section, options) {
		this.clicker = document.id(clicker);
		this.section = document.id(section);
		this.parent(this.section, options);
		this.boundtoggle = this.toggle.bind(this);
		this.attach();
	},
	attach: function(){
		this.clicker.addEvent('click', this.boundtoggle);
	},
	detach: function(){
		this.clicker.removeEvent('click', this.boundtoggle);
	}
});
//legacy, this class originated w/ a typo. nice!
var Collapsable = Collapsible;