{
	tests: [
		{
			title: "StickyWin.confirm",
			description: "Asks the user to confirm an action.",
			verify: "Can you click 'ok' to see the alert and 'cancel' to prevent it?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				StickyWin.confirm("Testing Confirmation", "Do you want to show the alert message?", function(){
					alert('Alert!!!');
				}, {
					modalOptions: {
						modalStyle: {
							'background-color': '#600'
						}
					}
				})
			}
		}
	]
}