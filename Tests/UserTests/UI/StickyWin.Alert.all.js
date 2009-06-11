{
	tests: [
		{
			title: "StickyWin.alert",
			description: "Tells the user about some problem.",
			verify: "Did the message appear?",
			before: function(){
				StickyWin.alert("Oh Noes!!!", "You've got 5 internets open!");
			}
		},
		{
			title: "StickyWin.error",
			description: "Shows an alert w/ an error icon.",
			verify: "Did the message appear? Can you see the icon?",
			before: function(){
				StickyWin.error("Oh Noes!!!", "You've got 10!!! internets open!");
			}
		}
	]
}