{
	tests: [
		{
			title: "StickyWin.Modal",
			description: "Displays a 'popup' in the page and greys out the content below it.",
			verify: "Did the 'popup' show up in the center of the page? Was the rest of the page 'greyed' out? Can you click the grey layer to close it?",
			before: function(){
				body = "<div style=\"border: 1px solid black;background-color: #ccc; padding: 2px; width: 200px;\">Hi. I'm a stickyWin. You can <a href=\"javascript:void(0);\" class=\"closeSticky\">close me</a> if you want. You can also click the 'grey' layer to close me.</div>";
				new StickyWin.Modal({
					content: body
				});
			}
		},
		{
			title: "StickyWin.Modal - no hide on modal click",
			description: "Displays a 'popup' in the page and greys out the content below it.",
			verify: "Did the 'popup' show up in the center of the page? Was the rest of the page 'greyed' out? Can you click the grey layer to close it?",
			before: function(){
				body = "<div style=\"border: 1px solid black;background-color: #ccc; padding: 2px; width: 200px;\">Hi. I'm a stickyWin. You can <a href=\"javascript:void(0);\" class=\"closeSticky\">close me</a> if you want. You can also click the 'grey' layer to close me.</div>";
				new StickyWin.Modal({
					content: body,
					hideOnClick: false
				});
			}
		}
	],
	otherScripts: ['Modalizer.Compat']
}