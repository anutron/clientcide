/*
---
name: Behavior.StickyWin
description: Behaviors for StickyWin instances.
provides: [Behavior.StickyWin]
requires: [Behavior/Behavior, /StickyWin, /StickyWin.Modal, /StickyWin.Fx, /StickyWin.Drag]
script: Behavior.Tabs.js

...
*/

Behavior.addGlobalFilters({

	'StickyWin.Modal': {
		defaults: {
			destroyOnClose: true,
			closeOnClickOut: true,
			closeOnEsc: true,
			draggable: false,
			resizable: false
		},
		setup: function(element, api) {
			var sw = new StickyWin.Modal(
				Object.merge({
						content: element
					},
					Object.cleanValues(
						api.getAs({
							closeClassName: String,
							pinClassName: String,
							className: String,
							edge: String,
							position: String,
							offset: Object,
							relativeTo: String,
							width: Number,
							height: Number,
							timeout: Number,
							destroyOnClose: Boolean,
							closeOnClickOut: Boolean,
							closeOnEsc: Boolean,
							//modal options
							maskOptions: Object,
							//draggable options
							draggable: Boolean,
							dragHandleSelector: String,
							resizable: Boolean,
							resizeHandleSelector: String
						})
					)
				)
			);
			api.onCleanup(function(){
				sw.destroy();
			});
			return sw;
		}
	}

});
