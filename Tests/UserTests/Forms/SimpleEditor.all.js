{
	tests: [
		{
			title: "SimpleEditor",
			description: "Allows the user to enter basic html in a text area.",
			before: function(){
				var s = new SimpleEditor($('simpleEditor'), $('editToolbar').getElements('img'));
				dbug.log(s);
			},
			verify: "Can you use the buttons to add html to the text area? Can you select text and wrap tags around it using the buttons (try bold)? Can you use the shortcuts (hover over a button to see it's shortcut)?"
		}
	]
}
