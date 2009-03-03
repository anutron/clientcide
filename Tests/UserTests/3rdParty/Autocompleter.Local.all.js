{
	tests: [
		{
			title: "Autocompleter.Local: single value",
			description: "Creates an auto completed input using data in memory.",
			verify: "Can you use the input to type in values that are autocompleted?",
			before: function(){
				// Our instance for the element with id "demo-local"
				new Autocompleter.Local('foo', tokens, {
					minLength: 1, // We need at least 1 character
					selectMode: 'pick', // Instant completion
					overflow: true
				});		
			}
		},
		{
			title: "Autocompleter.Local: multiple values: selection",
			description: "Creates an auto completed input using data in memory; allows for more than one value.",
			verify: "Can you use the input to type in values that are autocompleted? Can you add a comma and enter another value that is autocompleted?",
			before: function(){
				// Our instance for the element with id "demo-local"
				new Autocompleter.Local('foo2', tokens, {
					minLength: 1, // We need at least 1 character
					selectMode: 'selection', // Instant completion,
					multiple: true,
					overflow: true
				});
			}
		},
		{
			title: "Autocompleter.Local: multiple values: type-ahead",
			description: "Creates an auto completed input using data in memory; allows for more than one value.",
			verify: "Can you use the input to type in values that are autocompleted? Can you add a comma and enter another value that is autocompleted?",
			before: function(){
				// Our instance for the element with id "demo-local"
				new Autocompleter.Local('foo3', tokens, {
					minLength: 1, // We need at least 1 character
					selectMode: 'type-ahead', // Instant completion,
					multiple: true,
					overflow: true
				});
			}
		}
	],
	otherScripts: ['Autocompleter.CNET']
}