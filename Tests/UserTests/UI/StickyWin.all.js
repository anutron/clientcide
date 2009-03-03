{
	tests: [
		{
			title: "StickyWin",
			description: "Displays a 'popup' in the page.",
			verify: "Did the 'popup' show up in the center of the page? Can you toggle it from beging pinned in place (so that it doesn't move when you scroll)? Can you close it?",
			before: function(){
				body = "<div style=\"border: 1px solid black;background-color: #ccc; padding: 2px; width: 200px;\">Hi. I'm a stickyWin. You can <a href=\"javascript:void(0);\" class=\"closeSticky\">close me</a> if you want. Or you can <a href=\"javascript: void(0);\" class=\"pinSticky\">pin me in place</a>.</div>";
				new StickyWin({content: body});
			}
		}
	]
}