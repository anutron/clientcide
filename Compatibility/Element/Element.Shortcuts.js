Element.implement({
	findParent: function(collection){
		return $$(collection).filter(function(el){
			return el.hasChild(this);
		}, this)[0];
	}
});