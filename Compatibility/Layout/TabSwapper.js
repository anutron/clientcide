TabSwapper = Class.refactor(TabSwapper, {
	initialize: function(options){
		options = this.compatability(options);
		this.previous(options);
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