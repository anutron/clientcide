/*
Script: StickyWin.Drag.js

	Implements drag and resize functionaity into StickyWin.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

if (window.Drag){

	StickyWin.implement({

		options: {
			draggable: false,
			dragOptions: {},
			dragHandleSelector: '.dragHandle',
			resizable: false,
			resizeOptions: {},
			resizeHandleSelector: ''
		},

		initialize: function(){
			this.previous.apply(this, arguments);
			if (this.options.draggable) this.makeDraggable();
			if (this.options.resizable) this.makeResizable();
		},

		positionShim: function(){
			if (this.shim) this.shim.position();
		},

		makeDraggable: function(){
			if (this.options.dragHandleSelector) {
				var handle = this.element.getElement(this.options.dragHandleSelector);
				if (handle) {
					handle.setStyle('cursor','move');
					this.options.dragOptions.handle = handle;
				}
			}
			this.win.makeDraggable(this.options.dragOptions).addEvent('complete', this.positionShim.bind(this));
		},

		makeResizable: function(){
			if (this.options.resizeHandleSelector) {
				var handle = this.win.getElement(this.options.resizeHandleSelector);
				if (handle) this.options.resizeOptions.handle = this.win.getElement(this.options.resizeHandleSelector);
			}
			this.win.makeResizable(this.options.resizeOptions).addEvent('complete', this.positionShim.bind(this));
		},

	});

}