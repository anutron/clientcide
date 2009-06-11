OverText = Class.refactor(OverText, {
	initialize: function(inputs, options){
		this.instances = [];
		if (['array', 'string'].contains($type(inputs))) {
			this.setOptions(options);
			$$(inputs).each(this.addElement, this);
		} else {
			return this.previous.apply(this, arguments);
		}
	},
	addElement: function(el) {
		this.instances.push(new OverText(el, this.options))
	},
	startPolling: function(){
		if (!this.instances || !this.instances.length) return this.previous.apply(this, arguments);
		this.instances.each(function(instance) {
			instance.startPolling();
		});
	},
	stopPolling: function(){
		if (!this.instances.length) return this.previous.apply(this, arguments);
		this.instances.each(function(instance) {
			instance.stopPolling();
		});
	},
	hideTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.hide();
	},
	showTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.show();
	},
	testOverTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.test();		
	},
	repositionAll: function() {
		this.instances.each(function(instance) {
			instance.reposition();
		});
	},
	repositionOverTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.reposition();
	}

});