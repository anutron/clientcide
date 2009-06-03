/*
Script: StickyWin.Confirm.js
	Defines StickyWin.Conferm, a simple confirmation box with an ok and a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Confirm = new Class({
	Extends: StickyWin.Alert,
	options: {
		uiOptions: {
			width: 250
		}
	},
	build: function(callback){
		this.setOptions({
			uiOptions: {
				buttons: [
					{text: 'Cancel'},
					{
						text: 'Ok', 
						onClick: callback || function(){
							this.fireEvent('confirm');
						}.bind(this)
					}
				]
			}
		});
		return this.parent();
	}
});

StickyWin.confirm = function(caption, message, callback, options) {
	return new StickyWin.Confirm(caption, message, options).addEvent('confirm', callback);
};