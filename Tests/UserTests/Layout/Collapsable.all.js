{
	tests: [
		{
			title: "Collapsable",
			description: "Sets up a clickable element to toggle the visibility of another.",
			verify: "When you click the link, does the box toggle in and out?",
			before: function(){
				new Collapsable($('clicker'), $('section'));
			}
		}
	]
}