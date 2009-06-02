/*
Script: StickyWin.alert.js
	Defines StickyWin.alert, a simple little alert box with a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Alert = new Class(
	Implements: Options,
	options: {
		baseHref: "http://www.cnet.com/html/rb/assets/global/simple.error.popup"
		stickyWinToUse: StickyWin.Modal,
		destroyOnClose: true,
		modalOptions: {
			modalStyle: {
				zIndex: 11000
			}
		},
		zIndex: 110001,
		uiOptions: {
			width: 250,
			buttons: [
				{text: 'Ok'}
			]
		}
	},
	initialize: function(caption, message, options) {
		this.message = msg;
		this.caption = caption;
		this.setOptions({
			content: this.build();
		}, options);
	},
	makeMessage: function() {
		return new Element('p', {
			'class': 'errorMsg SWclearfix',
			styles: {
				margin: 0,
				minHeight: 10
			},
			html: this.message
		});
	},
	build: function(){
		return StickyWin.ui(this.caption, this.makeMessage(), this.options.uiOptions);
	}
});

StickyWin.Error = new Class({
	Extends: StickyWin.Alert, 
	makeMessage: function(){
		return this.parent().adopt(
			new Element('img', {
				src: this.options.baseHref + '/icon_problems_sm.gif',
				'class': 'bang clearfix',
				styles: {
					'float': 'left',
					width: 30,
					height: 30,
					margin: '3px 5px 5px 0px'
				}
			}).inject(content, 'top');
		);
	}
});

StickyWin.alert = function(caption, message, options) {
	if ($type(options) == "string") options = {baseHref: options};
	return new StickyWin.Alert(caption, message)
};

StickyWin.error = function(caption, message, options) {
	return new StickyWin.Error(caption, message, options);
};