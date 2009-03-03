{
	tests: [
		{
			title: "Modalizer.modalShow",
			description: "Creates a semi-transparent layer that obscures the content below it.",
			verify: "Did the layer show up obscuring the content of the page? Can you click the layer to hide it?",
			body: "new Modalizer().modalShow();"
		}
	],
	otherScripts: ["Swiff"]
}