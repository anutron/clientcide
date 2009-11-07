{
	tests: [
		{
			title: "StickyWin.pointy (down)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin.PointyTip('This is the caption', 
					'This is the body. You can close me with the little "X" in the upper right corner', {
					relativeTo: 'foo',
					width: 200,
					point: "down"
				});
			}
		},
		{
			title: "StickyWin.pointy (left)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin.PointyTip('This is the body. You can close me with the little "X" in the upper right corner', {
					relativeTo: 'foo',
					width: 200,
					point: "left",
					pointyOptions: {
						theme: 'light'
					}
				});
			}
		},
		{
			title: "StickyWin.pointy (up)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin.PointyTip('This is the body. You can close me with the little "X" in the upper right corner', {
					relativeTo: 'foo',
					width: 200,
					point: 11
				});
			}
		},
		{
			title: "StickyWin.pointy (2)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				new StickyWin.PointyTip('This is the caption', 
					'This is the body. You can close me with the little "X" in the upper right corner', {
					relativeTo: 'foo',
					width: 200,
					point: "right",
					pointyOptions: {
						theme: 'light'
					}
				});
			}
		}
	]
}