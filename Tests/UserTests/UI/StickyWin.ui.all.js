{
	tests: [
		{
			title: "StickyWin.ui",
			description: "Creates a StickyWin popup with a styled layout with buttons.",
			verify: "Did the styled popup show up? Can you close it with the big 'close' button?",
			before: function(){
				new StickyWin({content: StickyWin.ui('This is the StickyWin UI', 'You can close me with the button below',
					{
						buttons: [
							{text: "Close me"}
						]
					})
				});
			}
		},
		{
			title: "StickyWin.ui - no caption",
			description: "Creates a StickyWin popup with a styled layout with buttons.",
			verify: "Did the styled popup show up? Can you close it with the big 'close' button?",
			before: function(){
				new StickyWin({content: StickyWin.ui('I have no caption. You can close me with the button below',
					{
						buttons: [
							{text: "Close me"}
						]
					})
				});
			}
		}
	]
}