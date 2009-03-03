/*
Script: StickyWin.Ajaxjs

Adds ajax functionality to all the StickyWin classes.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	var SWA = function(extend){
		return {
			Extends: extend,
			options: {
				url: '',
				showNow: false,
				requestOptions: {
					method: 'get'
				},
				wrapWithUi: false, 
				caption: '',
				uiOptions:{},
				handleResponse: function(response){
					var responseScript = "";
					this.Request.response.text.stripScripts(function(script){	responseScript += script; });
					if (this.options.wrapWithUi) response = StickyWin.ui(this.options.caption, response, this.options.uiOptions);
					this.setContent(response);
					this.show();
					if (this.evalScripts) $exec(responseScript);
				}
			},
			initialize: function(options){
				this.parent(options);
				this.evalScripts = this.options.requestOptions.evalScripts;
				this.options.requestOptions.evalScripts = false;
				this.createRequest();
			},
			createRequest: function(){
				this.Request = new Request(this.options.requestOptions).addEvent('onSuccess',
					this.options.handleResponse.bind(this));
			},
			update: function(url, options){
				this.Request.setOptions(options).send({url: url||this.options.url});
				return this;
			}
		};
	};
	try {	StickyWin.Ajax = new Class(SWA(StickyWin)); } catch(e){}
	try {	StickyWin.Fx.Ajax = new Class(SWA(StickyWin.Fx)); } catch(e){}
	try {	StickyWin.Modal.Ajax = new Class(SWA(StickyWin.Modal)); } catch(e){}
	try {	StickyWin.Fx.Modal.Ajax = new Class(SWA(StickyWin.Fx.Modal)); } catch(e){}
})();
//legacy
if (window.StickyWinModal) StickyWinModal.Ajax = StickyWin.Modal.Ajax;
if (StickyWin.Fx) {
	StickyWinFx.Ajax = StickyWin.Fx.Ajax;
	StickyWinFxModal.Ajax = StickyWin.Fx.Modal.Ajax;
}
