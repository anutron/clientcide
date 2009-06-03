/*
Script: StickyWin.Prompt.js
	Defines StickyWin.Prompt, a little prompt box with an input as well as ok close buttons.	
License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

StickyWin.Prompt = new Class({
	Extends: StickyWin.Confirm,
	options: {
		defaultValue: ''
	},
	initialize: function(){
		this.parent.apply(this, arguments);
		this.addEvent('display', function(){
			this.input.select();
		});
	},
	makeMessage: function(){
		this.input = new Element('input', {
			type: 'text',
			id: 'foo',
			styles: {
				width: '100%'
			},
			events: {
				keyup: function(e) {
					if (e.key == 'enter') {
						this.fireEvent('confirm', this.input.get('value'));
						this.hide();
					}
				}.bind(this)
			}
		});
		return new Element('div').adopt(this.parent()).adopt(this.input);
	},
	build: function(){
		return this.parent(function(){
			this.fireEvent('confirm', this.input.get('value'));
		}.bind(this));
	}
})

StickyWin.prompt = function(caption, message, callback, options) {
	return new StickyWin.Prompt(caption, message, options).addEvent('confirm', callback);
};