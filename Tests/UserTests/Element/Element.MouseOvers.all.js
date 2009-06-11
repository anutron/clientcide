{
	tests: [
		{
			title: "Element.MouseOvers (img)",
			description: "Automatically toggles the source of an image on mouse over.",
			verify: "Did the image change when you moved your mouse over it?",
			body: "$('mouseOverImg').autoMouseOvers();"
		},
		{
			title: "Element.MouseOvers (not img)",
			description: "Automatically toggles a class when you mouse over an element.",
			verify: "Did the div around the image get a border when you moused over it?",
			body: "$('foo').autoMouseOvers({cssOver: 'border', cssOut: ''});"
		}
	]
}