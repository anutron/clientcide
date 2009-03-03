{
	tests: [
		{
			title: "Confirmer.prompt on change",
			description: "Notifies that the input has changed.",
			before: function(){
				var conf = new Confirmer({
				  positionOptions: {
				    relativeTo: "confirmer",
				    position: "bottomLeft",
				    offset: {x: 0, y: 10}
				  }
				});
				$('confirmer').addEvent('change', function(){
					conf.prompt({msg: "you changed the value to: " + $('confirmer').get('value')});
				});
			},
			verify: "Did the message appear when you changed the input?"
		}
	]
}