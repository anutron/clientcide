/*
---
name: Behavior.StickyWin
description: Behaviors for StickyWin instances.
provides: [Behavior.StickyWin]
requires: [Behavior/Behavior, /StickyWin, /StickyWin.Modal, /StickyWin.Fx, /StickyWin.Drag, More/Array.Extras]
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
		returns: StickyWin.Modal,
		setup: function(element, api) {
			var flex = element.getElement('.flex'),
			    height = api.getAs(Number, 'height') || (window.getSize().y * .9);

			if (flex){
				element.measure(function(){
					var tmp = new Element('span', { styles: { display: 'none' }}).replaces(flex),
					    remainder = element.getSize().y;
					var padding = ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width'].map(function(style){
						return flex.getStyle(style).toInt();
					}).sum();
					flex.setStyle('max-height', height - remainder - padding);
					flex.replaces(tmp);
				});
			}

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
