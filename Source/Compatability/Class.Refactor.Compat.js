$extend(Class.prototype, { 
	refactor: function(props){ 
		this.prototype = Class.refactor(this, props).prototype;
		return this;
	}
});