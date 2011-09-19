/*
---
name: Behavior.Collapsible
description: Instantiates a Collapsible class.
provides: [Behavior.Collapsible]
requires: [Behavior/Behavior, /Collapsible]
script: Behavior.Collapsible.js

...
*/

Behavior.addGlobalFilters({

	Collapsible: {
		defaults: {
			target: '+'
		},
		setup: function(element, api) {
			var target = element.getElement(api.get('target'));
			var col = new Collapsible(element, target);
			col.addEvent('reveal', function(){
				api.fireEvent('layout:display', target);
			});
			api.onCleanup(col.detach.bind(col));
			return col;
		},
		returns: Collapsible
	}

});