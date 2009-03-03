/*
Script: StickyWin.Fx.js

Extends StickyWin to create popups that fade in and out and can be dragged and resized (requires StickyWin.Fx.Drag.js).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Fx = new Class({
	Extends: StickyWin,
	options: {
		fade: true,
		fadeDuration: 150,
//	fadeTransition: 'sine:in:out',
		draggable: false,
		dragOptions: {},
		dragHandleSelector: '.dragHandle',
		resizable: false,
		resizeOptions: {},
		resizeHandleSelector: ''
	},
	setContent: function(html){
		this.parent(html);
		if (this.options.draggable) this.makeDraggable();
		if (this.options.resizable) this.makeResizable();
		return this;
	},	
	hideWin: function(){
		if (this.options.fade) this.fade(0);
		else this.parent();
	},
	showWin: function(){
		if (this.options.fade) this.fade(1);
		else this.parent();
	},
	hide: function(){
		this.parent(this.options.fade);
	},
	show: function(){
		this.parent(this.options.fade);
	},
	fade: function(to){
		if (!this.fadeFx) {
			this.win.setStyles({
				opacity: 0,
				display: 'block'
			});
			var opts = {
				property: 'opacity',
				duration: this.options.fadeDuration
			};
			if (this.options.fadeTransition) opts.transition = this.options.fadeTransition;
			this.fadeFx = new Fx.Tween(this.win, opts);
		}
		if (to > 0) {
			this.win.setStyle('display','block');
			this.position();
		}
		this.fadeFx.clearChain();
		this.fadeFx.start(to).chain(function (){
			if (to == 0) {
				this.win.setStyle('display', 'none');
				this.fireEvent('onClose');
			} else {
				this.fireEvent('onDisplay');
			}
		}.bind(this));
		return this;
	},
	makeDraggable: function(){
		dbug.log('you must include Drag.js, cannot make draggable');
	},
	makeResizable: function(){
		dbug.log('you must include Drag.js, cannot make resizable');
	}
});
//legacy
var StickyWinFx = StickyWin.Fx;