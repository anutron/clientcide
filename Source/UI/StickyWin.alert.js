/*
Script: StickyWin.alert.js
	Defines StickyWin.alert, a simple little alert box with a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.alert = function(msghdr, msg, baseHref) {
	baseHref = baseHref||"http://www.cnet.com/html/rb/assets/global/simple.error.popup";
	msg = '<p class="errorMsg SWclearfix" style="margin: 0px;min-height:10px">' +
						'<img src="'+baseHref+'/icon_problems_sm.gif"'+
						' class="bang clearfix" style="float: left; width: 30px; height: 30px; margin: 3px 5px 5px 0px;">'
						 + msg + '</p>';
	var body = StickyWin.ui(msghdr, msg, {width: 250});
	return new StickyWin.Modal({
		modalOptions: {
			modalStyle: {
				zIndex: 11000
			}
		},
		zIndex: 110001,
		content: body,
		position: 'center' //center, corner
	});
};