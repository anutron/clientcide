/*
---
name: Behavior.Collapsible Tests
description: n/a
requires: [Clientcide/Behavior.Collapsible, Behavior-Tests/Behavior.SpecsHelpers]
provides: [Behavior.Collapsible.Tests]
...
*/

(function(){

	var str = '<div data-behavior="Collapsible"></div><div class="theTarget" style="width: 100px; height; 100px;"></div>';
	Behavior.addFilterTest({
		filterName: 'Collapsible',
		desc: 'Creates an instance of Collapsible',
		content: str,
		returns: Collapsible,
		expect: function(element, instance){
			expect(instance.section.hasClass('theTarget')).toBe(true);
			instance.toggle(instance.section);
			waits(700);
			runs(function(){
				expect(instance.section.getStyle('display')).toBe('none');
			});
		}
	});
	Behavior.addFilterTest({
		filterName: 'Collapsible',
		desc: 'Creates an instance of Collapsible',
		content: str,
		returns: Collapsible,
		multiplier: 10,
		specs: false
	});


})();