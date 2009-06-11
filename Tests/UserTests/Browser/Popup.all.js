{
	tests: [
		{
			title: "Open a popup.",
			description: "Opens a popup to google.",
			verify: "Did the popup open when you clicked 'Open a popup'?",
			before: function(){
				if (window.popupTest) window.popupTest.close();
			}
		},
		{
			title: "Popup focus",
			description: "Focuses a popup (run this <b>after</b> the open test above).",
			verify: "Did the focus change to the popup?",
			before: function(){
				if (!window.popupTest) window.popupTest = new Browser.Popup('http://www.google.com');;
			},
			body: "window.popupTest.focus();"
		},
		{
			title: "Popup close",
			description: "Closes a popup (run this <b>after</b> the open test above).",
			verify: "Did the popup close?",
			before: function(){
				if (!window.popupTest) window.popupTest = new Browser.Popup('http://www.google.com');;
			},
			body: "window.popupTest.close();"
		}
	]
}