/*
Script: StickyWin.Modal.js

This script extends StickyWin and StickyWin.Fx classes to add Modalizer functionality.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
var modalWinBase = function(extend){
	return {
		Extends: extend,
		Implements: Modalizer,
		initialize: function(options){
			options = options||{};
			this.setModalOptions($merge(options.modalOptions||{}, {
				onModalHide: function(){
						this.hide(false);
					}.bind(this)
				}));
			this.parent(options);
		},
		show: function(showModal){
			if ($pick(showModal, true)) {
				this.modalShow();
				if (this.modalOptions.elementsToHide) this.win.getElements(this.modalOptions.elementsToHide).setStyle('opacity', 1);
			}
			this.parent();
		},
		hide: function(hideModal){
			if ($pick(hideModal, true)) this.modalHide();
			else this.parent();
		}
	}
};

StickyWin.Modal = new Class(modalWinBase(StickyWin));
if (StickyWin.Fx) StickyWin.Fx.Modal = new Class(modalWinBase(StickyWin.Fx));
})();
//legacy
var StickyWinModal = StickyWin.Modal;
if (StickyWin.Fx) var StickyWinFxModal = StickyWin.Fx.Modal;