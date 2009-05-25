(function(){
	var orig = Element.prototype.setPosition;
	Element.implement({
		setPosition: function(options){
			//call setPosition if the options are x/y values
			if (options && ($defined(options.x) || $defined(options.y))) return orig.apply(this, arguments);
			else return this.position(options);
		}
	});
})();