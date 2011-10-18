/*
---
name: Behavior.StickyWin Tests
description: n/a
requires: [Clientcide/Behavior.StickyWin, Behavior-Tests/Behavior.SpecsHelpers]
provides: [Behavior.StickyWin.Tests]
...
*/

(function(){

	var str = '<div data-behavior="StickyWin.Modal">this is a modal popup</div>';
	Behavior.addFilterTest({
		filterName: 'StickyWin.Modal',
		desc: 'Creates an instance of StickyWin.Modal',
		content: str,
		returns: StickyWin.Modal,
		expect: function(element, instance){
			instance.destroy();
		}
	});
	Behavior.addFilterTest({
		filterName: 'StickyWin.Modal',
		desc: 'Creates an instance of StickyWin.Modal (10x)',
		content: str,
		returns: StickyWin.Modal,
		multiplier: 10,
		specs: false
	});

})();