{
	tests: [
		{
			title: "Image Tag Test",
			description: "Prompts the user to fill in data for an image tag.",
			verify: "Were you prompted to fill in the image info? Did it produce the proper image tag based on your selections?",
			before: function(){
				new TagMaker.image().prompt($('tagMakerTest'));
			},
			body: ""
		}
	],
	otherScripts: ["Clipboard"]
}
