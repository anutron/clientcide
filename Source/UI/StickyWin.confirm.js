/*
Script: StickyWin.confirm.js
	Defines StickyWin.conferm, a simple confirmation box with an ok and a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.confirm = function(caption, message, callback, options) {
	return new StickyWin.Modal(
		$merge({
			destroyOnClose: true
		}, options, {
			content: StickyWin.ui(caption, message, {
				buttons: [
					{text: 'Cancel'},
					{text: 'Ok', onClick: callback}
				]
			})
		})
	);
};