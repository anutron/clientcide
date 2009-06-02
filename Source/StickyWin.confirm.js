/*
Script: StickyWin.confirm.js
	Defines StickyWin.conferm, a simple confirmation box with an ok and a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Confirm = new Class({
	Extends: StickyWin.Alert,
	options: {
		uiOptions: {
			width: 250,
			buttons: [
				{text: 'Cancel'},
				{text: 'Ok', onClick: function(){
					this.fireEvent('confirm');
				}}
			]
		}
	}
});

StickyWin.confirm = function(caption, message, callback, options) {
	return new StickyWin.Confirm(caption, message, options).addEvent('confirm', callback);
};