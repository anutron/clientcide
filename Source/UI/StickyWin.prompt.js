/*
Script: StickyWin.confirm.js
	Defines StickyWin.conferm, a simple confirmation box with an ok and a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

StickyWin.Prompt = new Class({
	Extends: StickyWin.Confirm,
	makeMessage: function(){
		retur this.parent().adopt(
			new Element('input', {
				value: options.defaultValue || '',
				style: {
					width: '100%',
					events: {
						onKeyDown: function(e) {
							if (e.key == 'enter') this.fireEvent('confirm', (input.get('value'));
						}
					}
				}
			})
		);
	}
})

StickyWin.prompt = function(caption, message, callback, options) {
	return new StickyWin.Prompt(caption, message, options).addEvent('confirm', callback);
};