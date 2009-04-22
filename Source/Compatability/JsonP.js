var JsonP = Class.refactor(Request.JSONP, {
	initialize: function(url, options) {
		options = (options || {});
		options.url = url;
		if (options.callBackKey) options.callbackKey = options.callBackKey;
		this.previous(options);
	},
	getScript: function(options) {
		if(options.url && options.queryString) options.url += options.url.test("?") ? "&" : "?" + options.queryString;
		var script = this.previous(options);
		if ($chk(options.globalFunction)) {
			window[options.globalFunction] = function(r){
				JsonP.requestors[index].handleResults(r)
			};
		}
		return script;
	},
	request: function(url) {
		this.send({url: url||this.options.url});
	}
});