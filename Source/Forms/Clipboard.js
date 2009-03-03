/*
Script: Clipboard.js
	Provides access to the OS clipboard so that data can be copied to it (using a flash plugin).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Clipboard = {
	swfLocation: 'http://www.cnet.com/html/rb/assets/global/clipboard/_clipboard.swf',
	copyFromElement: function(element) {
		element = $(element);
		if (!element) return null;
		if (Browser.Engine.trident) {
			try {
				window.addEvent('domready', function() {
					var range = element.createTextRange();
					if (range) range.execCommand('Copy');
				});
			}catch(e){
				dbug.log('cannot copy to clipboard: %s', o)
			}
		} else {
			var text = (element.getSelectedText)?element.getSelectedText():element.get('value');
			if (text) Clipboard.copy(text);
		}
		return element;
	},
	copy: function(text) {
		if (Browser.Engine.trident){
			window.addEvent('domready', function() {
				var cb = new Element('textarea', {styles: {display: 'none'}}).inject(document.body);
				cb.set('value', text).select();
				Clipboard.copyFromElement(cb);
				cb.dispose();
			});
		} else {
			var swf = ($('flashcopier'))?$('flashcopier'):new Element('div', {
				id: 'flashcopier'
			}).inject(document.body);
			swf.empty();
			swf.set('html', '<embed src="'+this.swfLocation+'" FlashVars="clipboard='+escape(text)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>');
		}
	}
};
