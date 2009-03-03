TabSwapper = TabSwapper.refactor({
	initialize: function(options){
		options = this.compatability(options);
		this.parent(options);
	},
	compatability: function(options){
		if (options.tabSelector){
			options.tabs = $$(options.tabSelector);
			options.sections = $$(options.sectionSelector);
			options.clickers = $$(options.clickSelector);
		}
		return options;
	},
	swap: function(i) {
		return this.show(i);
	}
});