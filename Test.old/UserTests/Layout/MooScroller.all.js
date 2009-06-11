{
	tests: [
		{
			title: "MooScroller",
			description: "Recreates the default scrollbar with styled elements.",
			verify: "Can you scroll up and down by dragging the scrubber bar? Using the mousewheel? Clicking the little up/down boxes?",
			before: function(){
				new MooScroller(document.getElement('div.scroller div.content'), document.getElement('div.scroller .scrollKnob'), {
					scrollLinks: {
						forward: document.getElement('div.scroller div.scrollForward'),
						back: document.getElement('div.scroller div.scrollBack')
					}
				});
			}
		}
	],
	otherScripts: ["Selectors"]
}