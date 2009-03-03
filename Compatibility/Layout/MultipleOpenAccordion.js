var MultipleOpenAccordion = MultipleOpenAccordion.refactor({
	options: {
		allowMultipleOpen: true,
		firstElementsOpen: [0]
	},
	initialize: function(togglers, elements, options){
		if (!allowMultipleOpen) return new Accordion(togglers, elements, $merge({
			display: options.firstElementsOpen[0]
		}, options));
	}
});
