{
	tests: [
		{
			title: "Clipboard.copy",
			description: "Copies a string to the user's OS clipboard.",
			before: function(){
				Clipboard.copy("this is automatically copied to your clipboard");
			},
			post: function(){
				return prompt("please hit 'paste' in this field'") == "this is automatically copied to your clipboard";
			}
		},
		{
			title: "Clipboard.copyFromElement",
			description: "Copies the value of an element to the user's OS clipboard.",
			before: function(){
				Clipboard.copyFromElement("copyTest");
			},
			post: function(){
				return prompt("please hit 'paste' in this field'") == $('copyTest').get('value');
			}
		}
	]
}