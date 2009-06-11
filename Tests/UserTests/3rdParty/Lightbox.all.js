{
	tests: [
		{
			title: "Lightbox: Single Images",
			description: "Overlays the page with a simple image viewer.",
			verify: "When you click the images do they overlay the page?",
			before: function(){
				window.fireEvent('domready');
			}
		},
		{
			title: "Lightbox: Image Sets",
			description: "Overlays the page with a simple image viewer that can navigate an image set.",
			verify: "When you click the images do they overlay the page? Can you click on the right/left side of the iamges to move forward and back?",
			before: function(){
				window.fireEvent('domready');
			}
		}
	]
}