IframeShim = Class.refactor(IframeShim, {
	initialize: function(element, options){
		if (options.element) {
			this.previous(options.element, element);
		} else {
			this.previous(element, options);
		}
	},
	remove: function(){
		return this.dispose();
	}
});