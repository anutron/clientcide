/*
---

name: StickyWin.Modal

description: This script extends StickyWin and StickyWin.Fx classes to add Mask functionality.

license: MIT-Style License

requires: [More/Mask, StickyWin]

provides: StickyWin.Modal
...
*/
StickyWin.Modal = new Class({

	Extends: StickyWin,

	options: {
		modalize: true,
		maskOptions: {
			style: {
				backgroundColor:'#333',
				opacity:0.8
			}
		},
		hideOnClick: true,
		getWindowManager: function(){ return StickyWin.ModalWM; }
	},

	initialize: function(options) {
		this.options.maskTarget = this.options.maskTarget || document.body;
		this.setOptions(options);
		this.mask = new Mask(this.options.maskTarget, this.options.maskOptions);
		if (this.options.hideOnClick) this.mask.addEvent('click', this.hide);
		this.parent(options);
	},

	show: function(showModal){
		if ([showModal, this.options.modalize].pick()) this.mask.show();
		this.parent();
	},

	hide: function(hideModal){
		if ([hideModal, true].pick()) this.mask.hide();
		this.parent();
	},

	destroy: function(){
		this.mask.destroy();
		this.parent.apply(this, arguments);
	}

});

StickyWin.ModalWM = new StickyWin.Stacker({
	zIndexBase: 11000
});
if (StickyWin.Fx) StickyWin.Fx.Modal = StickyWin.Modal;