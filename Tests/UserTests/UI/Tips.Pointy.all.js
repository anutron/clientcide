{
	tests: [
		{
			title: "Tips.Pointy",
			description: "Creates tooltips for the anchors in the demo.",
			verify: "Did the styled tips show up?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new Tips.Pointy($$('a'));
			}
		}
	]
}