{
	tests: [
		{
			title: "FixPNG (img) - IE6 only!",
			description: "Fixes PNG transparency in IE6 for img tags.",
			verify: "Did the top image's dropshadow get cleaner?",
			body: "Browser.fixPNG($('fixPNG'));"
		},
		{
			title: "FixPNG (background) - IE6 only!",
			description: "Fixes PNG transparency in backgrounds in IE6 for non-img tags.",
			verify: "Did the bottom four images' dropshadows get cleaner?",
			body: "Browser.fixPNG($('foo'));"
		}
	]
}