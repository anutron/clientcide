(function(){
	var SWA = function(extend) {
		return Class.refactor(extend, {
			options: {
				XHRoptions: {
					method: 'get'
				},
				wrapWithStickyWinDefaultHTML: false, 
				stickyWinHTMLOptions:{}
			},
			initialize: function(options) {
				this.setOptions(options);
				this.options.RequestOptions = this.options.XHRoptions;
				this.wrapWithUi = this.options.wrapWithStickyWinDefaultHTML;
				this.uiOptions = this.options.stickyWinHTMLOptions;
				this.previous(options);
			}
		});
	};
	try {	SWA(StickyWin.Ajax); } catch(e){}
	try {	SWA(StickyWin.Fx.Ajax); } catch(e){}
	try {	SWA(StickyWin.Modal.Ajax); } catch(e){}
	try {	SWA(StickyWin.Fx.Modal.Ajax); } catch(e){}
})();