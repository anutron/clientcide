/*
---

script: StickyWin.Drag.js

description: Implements drag and resize functionaity into StickyWin.Fx. See StickyWin.Fx for the options.

license: MIT-Style License

requires:
- More/Class.Refactor
- More/Drag.Move
- /StickyWin

provides:
- StickyWin.Drag

...
*/
StickyWin = Class.refactor(StickyWin, {
	options: {
		draggable: false,
		dragOptions: {
			onComplete: function(){}
		},
		dragHandleSelector: '.dragHandle',
		resizable: false,
		resizeOptions: {
			onComplete: function(){}
		},
		resizeHandleSelector: ''
	},
	setContent: function(){
		this.previous.apply(this, arguments);
		if (this.options.draggable) this.makeDraggable();
		if (this.options.resizable) this.makeResizable();
		return this;
	},
	makeDraggable: function(){
		var toggled = this.toggleVisible(true);
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			var onComplete = (this.options.dragOptions.onComplete);
			this.options.dragOptions.onComplete = function(){
				onComplete();
				this.shim.position();
			}.bind(this);
		}
		if (this.options.dragHandleSelector) {
			var handle = this.win.getElement(this.options.dragHandleSelector);
			if (handle) {
				handle.setStyle('cursor','move');
				this.options.dragOptions.handle = handle;
			}
		}
		this.win.makeDraggable(this.options.dragOptions);
		if (toggled) this.toggleVisible(false);
	}, 
	makeResizable: function(){
		var toggled = this.toggleVisible(true);
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			var onComplete = (this.options.resizeOptions.onComplete);
			this.options.resizeOptions.onComplete = function(){
				onComplete();
				this.shim.position();
			}.bind(this);
		}
		if (this.options.resizeHandleSelector) {
			var handle = this.win.getElement(this.options.resizeHandleSelector);
			if (handle) this.options.resizeOptions.handle = this.win.getElement(this.options.resizeHandleSelector);
		}
		this.win.makeResizable(this.options.resizeOptions);
		if (toggled) this.toggleVisible(false);
	},
	toggleVisible: function(show){
		if (!this.visible && show == null || show) {
			this.win.setStyles({
				display: 'block',
				opacity: 0
			});
			return true;
		} else if (show != null && !show){
			this.win.setStyles({
				display: 'none',
				opacity: 1
			});
			return false;
		}
		return false;
	}
});
StickyWin.Fx = StickyWin;