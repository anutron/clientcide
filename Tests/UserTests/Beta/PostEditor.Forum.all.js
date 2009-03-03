{
	tests: [
		{
			title: "PostEditor.Forum",
			description: "Creates a post editor in the text area",
			verify: "Can you type code and html in the textarea and tab around and stuff?",
			before: function(){
				new PostEditor.Forum($$('textarea')[0]);
			}
		}
	]
}