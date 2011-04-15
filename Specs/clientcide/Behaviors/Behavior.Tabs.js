(function(){

	var str = '<div data-filters="Tabs" data-tabs-selector="ul.tabSet>li" data-sections-selector=".panel"><ul class="tabSet"><li class="off"><a>first tab</a></li><li class="off"><a>second tab</a></li><li class="off"><a>third tab</a></li></ul><div class="panelSet"><div class="panel">I\'m the content for the first panel.<p><input type="text"></p>I\'m the content for the first panel.<br>I\'m the content for the first panel.<br></div><div class="panel">I\'m the content for the second panel.<br>I\'m the content for the second panel.<br>I\'m the content for the second panel.<br>I\'m the content for the second panel.<br>I\'m the content for the second panel.<br></div><div class="panel">I\'m the content for the third panel.<br>I\'m the content for the third panel.<br>I\'m the content for the third panel.<br></div></div></div>';
	Behavior.addFilterTest({
		filterName: 'Tabs',
		desc: 'Creates an instance of TabSwapper',
		content: str,
		returns: TabSwapper,
		expectations: [
			function(element, instance){
				expect(instance.tabs.length).toBe(3);
			}
		]
	});
	Behavior.addFilterTest({
		filterName: 'Tabs',
		desc: 'Creates an instance of TabSwapper',
		content: str,
		returns: TabSwapper,
		multiplier: 10,
		noSpecs: true
	});


})();