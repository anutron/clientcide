{
	tests: [
		{
			title: "HtmlTable",
			description: "Loads a table of data into the view.",
			verify: "Do you see the table?",
			before: function(){
				var t = new HtmlTable({
					properties: {
						border: 1, cellspacing: 2, cellpadding: 3
					}
				});
				t.inject(document.body);
				t.push(['apple', 'red']);
				t.push(['lemon', 'yellow']);
				t.push([{
						content: 'grapes',
						properties: {rowspan: 2, valign: 'top'}
				},
				'purple']);
				t.push(['green']);
			}
		}
	]
}