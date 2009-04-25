IframeShim = Class.refactor(IframeShim, {
	initialize: function(element, options){
		if (options && options.zindex) options.zIndex = options.zindex;
		this.previous(element, options);
	}
});