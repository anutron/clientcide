{
	tests: [
		{
			title: "DatePicker",
			description: "Allows the user to enter a date value into an input.",
			before: function(){
				Clientcide.setAssetLocation('../Assets');
				new DatePicker('datePicker', {
					additionalShowLinks: ['pickerImg'],
					stickyWinOptions: { draggable: true },
					format: "db"
				});
				new Form.Validator('pickerForm', {
					onFormValidate: function(passed, form, event){
						event.stop();
						if (passed) alert('form validated');
						else alert('form did NOT validate');
					}
				});
			},
			verify: "Were you able to choose from various dates without error?"
		}
	],
	otherScripts: ["Date.Extras", "Form.Validator"]
}