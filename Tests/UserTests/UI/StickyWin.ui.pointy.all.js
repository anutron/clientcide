{
	tests: [
		{
			title: "StickyWin.ui.pointy (11)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({
					content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
						direction: 11
					})
				});
			}
		},

		{
			title: "StickyWin.ui.pointy (12 - light theme)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 12,
					theme: 'light'
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (1)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 1
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (2 - light theme)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 2,
					theme: 'light'
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (3)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({
					content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
						direction: 3
					})
				});
			}
		},
		{
			title: "StickyWin.ui.pointy (4)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 4
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (5)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 5
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (6)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 6
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (7)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 7
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (8)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 8
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (9)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 9
				})});
			}
		},
		{
			title: "StickyWin.ui.pointy (10)",
			description: "Creates a StickyWin popup with a styled layout with a pointer.",
			verify: "Did the styled popup show up? Can you close it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new StickyWin({content: StickyWin.ui.pointy('This is the caption', 'This is the body. You can close me with the little "X" in the upper right corner', {
					direction: 10
				})});
			}
		}
	]
}