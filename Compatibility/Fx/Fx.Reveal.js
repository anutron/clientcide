Fx.SmoothShow = new Class({
	Extends: Fx.Reveal,
	show: function(){
		return this.reveal();
	},
	hide: function(){
		return this.disolve();
	}
});
Element.implement({
	smoothShow: function(options){
		return this.set('reveal', options).reveal();
	},
	smoothHide: function(options){
		return this.set('reveal', options).disolve();
	}
});