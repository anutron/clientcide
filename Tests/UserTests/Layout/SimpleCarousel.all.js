{
	tests: [
		{
			title: "SimpleCarousel",
			description: "Cycles through four slides.",
			verify: "Does the carousel automatically cycle through the slides? Can you click on the caption for one to show it? Does the animation stop when you do?",
			body: "new SimpleCarousel($('simpleCarousel'), $$('#simpleCarousel div.slide'), $$('#simpleCarousel td.button'), {rotateAction: 'click', slideInterval: 1000});"
		}
	],
	otherScripts: ['Selectors']
}