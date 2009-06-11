{
	tests: [
		{
			title: "Test StyleWriter",
			description: "Tests if the css is written to the page.",
			verify: "Did the box turn grey?",
			before: function(){
				if ($('styleTest')) $('styleTest').dispose(); 
			},
			post: function(){
				return $('styleTest');
			},
			body: "new StyleWriter().createStyle('#foo{background: #ccc}', 'styleTest');"
		}
	]
}