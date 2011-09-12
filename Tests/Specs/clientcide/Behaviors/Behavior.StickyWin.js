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
		filterName: 'Modal',
		desc: 'Creates an instance of StickyWin.Modal',
		content: str,
		returns: StickyWin.Modal
	});
	Behavior.addFilterTest({
		filterName: 'Modal (10x)',
		desc: 'Creates an instance of StickyWin.Modal',
		content: str,
		returns: StickyWin.Modal,
		multiplier: 10,
		specs: false
	});

})();