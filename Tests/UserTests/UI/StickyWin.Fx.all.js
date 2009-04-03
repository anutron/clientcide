{
	tests: [
		{
			title: "StickyWinFx",
			description: "Displays a 'popup' in the page, fading in the transition.",
			verify: "Did the 'popup' fade in when it appeared and fade out when you closed it?",
			before: function(){
				body = "<div style=\"border: 1px solid black;background-color: #ccc; padding: 2px; width: 200px;\">Hi. I'm a stickyWin. You can <a href=\"javascript:void(0);\" class=\"closeSticky\">close me</a> if you want.</div>";
				new StickyWin({content: body, fadeDuration: 500});
			}
		}
	]
}