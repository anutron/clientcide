{
	tests: [
		{
			title: "setCNETAssetBaseHref",
			description: "Resets the base href for assets.",
			verify: "All the assets displayed should be local to this test environment. Inspect them with firebug - are the images local to the test?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				StickyWin.alert('test', 'my background should be local');
				new DatePicker('date');
			}
		}
	],
	otherScripts: ["StickyWin.Alert", "DatePicker"]
}
