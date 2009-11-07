{
	tests: [
		{
			title: "Form.Validator.Tips",
			description: "Validates that a form's inputs are correct.",
			verify: "Fill out the form as described and submit it. Were errors reported correctly?",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new Form.Validator.Tips('foo', {
					onFormValidate: function(passed, form, event){
						if (passed) alert('form validated');
						else alert('form did NOT validate');
					}
				});
			}
		}
	]
}