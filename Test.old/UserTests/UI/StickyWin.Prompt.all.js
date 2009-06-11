{
	tests: [
		{
			title: "StickyWin.prompt",
			description: "Asks the user to answer a question",
			verify: "Did the message appear? Did it alert what you entered when you hit enter or clicked ok?",
			before: function(){
				StickyWin.prompt('Prompt Test', 'Enter a message to alert:', function(val){
					alert(val);
				}, {
					defaultValue: 'alert me!'
				})
			}
		}
	]
}