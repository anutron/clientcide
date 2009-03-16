IframeShim = Class.refactor(IframeShim, {
	initialize: function(element, options){
		if (options.element) {
			this.parent(options.element, element);
		} else {
			this.parent(element, options);
		}
	},
	remove: function(){
		return this.dispose();
	}
});