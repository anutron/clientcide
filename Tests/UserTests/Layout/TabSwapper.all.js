{
	tests: [
		{
			title: "TabSwapper",
			description: "Creates a set of tabs that change the displayed corresponding section.",
			verify: "Did the sections smoothly change when you clicked the tabs?",
			before: function(){
				new TabSwapper({
				  selectedClass: 'on',
				  deselectedClass: 'off',
				  tabs: $$('#tabBoxExample li'),
				  clickers: $$('#tabBoxExample li a'),
				  sections: $$('div.panelSet div.panel'),
				  smooth: true,
					smoothSize: true
				});
			}
		}
	],
	otherScripts: ["Selectors"]
}