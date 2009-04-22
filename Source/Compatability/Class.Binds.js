Class.Mutators.binds = function(binds){
    return binds;
};

(function(){
	var orig = Class.Mutators.initialize;

	Class.Mutators.initialize = function(initialize){
		if (orig) orig.apply(Class.Mutators, initialize);
		return function(){
			$splat(this.binds).each(function(name){
				var original = this[name];
				if (original) this[name] = original.bind(this);
			}, this);
			return initialize.apply(this, arguments);
		};

	};
})();