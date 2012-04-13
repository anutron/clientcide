/*
---

name: StickyWin.Ajax

description: Adds ajax functionality to all the StickyWin classes.

license: MIT-Style License

requires: [Core/Request, StickyWin, StickyWin.UI, StickyWin.PointyTip]

provides: [StickyWin.Ajax, StickyWin.Modal.Ajax, StickyWin.PointyTip.Ajax]

...
*/
(function(){
	var SWA = function(extend){
		return {
			Extends: extend,
			options: {
				//onUpdate: function(){},
				url: '',
				showNow: false,
				cacheRequest: false,
				requestOptions: {
					method: 'get',
					evalScripts: true
				},
				wrapWithUi: false,
				caption: '',
				uiOptions:{},
				cacheRequest: false,
				handleResponse: function(response){
					if(this.options.cacheRequest) {
						this.element.store(this.Request.options.url, response);
					}
					var responseScript = "";
					this.Request.response.text.stripScripts(function(script){	responseScript += script; });
					if (this.options.wrapWithUi) response = StickyWin.ui(this.options.caption, response, this.options.uiOptions);
					this.setContent(response);
					this.show();
					if (this.evalScripts) Browser.exec(responseScript);
					this.fireEvent('update');
				}
			},
			initialize: function(options){
				var showNow;
				if (options && options.showNow) {
					showNow = true;
					options.showNow = false;
				}
				this.parent(options);
				this.evalScripts = this.options.requestOptions.evalScripts;
				this.options.requestOptions.evalScripts = false;
				this.createRequest();
				if (showNow) this.update();
			},
			createRequest: function(){
				this.Request = new Request(this.options.requestOptions).addEvent('onSuccess',
					this.options.handleResponse.bind(this));
			},
			update: function(url, options){
				if(this.options.cacheRequest){
					if(!options) {
						var cachedResponse = this.element.retrieve(url)
						this.Request.options.url = url||this.options.url;
						if(cachedResponse) {
							this.Request.fireEvent('onSuccess', cachedResponse);
							return this;
						}
					}
				}
				this.Request.setOptions(options).send({url: url||this.options.url});
				return this;
			}
		};
	};
	try { StickyWin.Ajax = new Class(SWA(StickyWin)); } catch(e){}
	try { StickyWin.Modal.Ajax = new Class(SWA(StickyWin.Modal)); } catch(e){}
	try { StickyWin.PointyTip.Ajax = new Class(SWA(StickyWin.PointyTip)); } catch(e){}
})();