{
	tests: [
		{
			title: "Multiple Open Accordion",
			description: "Creates an accordion-like interface where each header opens and closes independently.",
			verify: "Can you toggle open and shut each section?",
			before: function(){
				document.getElement('dl').addClass('moa');
				document.getElement('dl').store('moa', new MultipleOpenAccordion(document.getElement('dl'), {togglers: $$('dl dt'), elements: $$('dl dd'), openAll: false}));
			}
		},
		{
			title: "Multiple Open Accordion: hide all",
			description: "Closes all the sections in the accordion.",
			verify: "Did all the sections close?",
			before: function(){
				if (!document.getElement('dl').hasClass('moa')) {
					document.getElement('dl').store('moa', new MultipleOpenAccordion(document.getElement('dl'), {togglers: $$('dl dt'), elements: $$('dl dd'), openAll: false}));
				}
				document.getElement('dl').retrieve('moa').hideAll();
			}
		},
		{
			title: "Multiple Open Accordion: show all",
			description: "Opens all the sections in the accordion.",
			verify: "Did all the sections open?",
			before: function(){
				if (!document.getElement('dl').hasClass('moa')) {
					document.getElement('dl').store('moa', new MultipleOpenAccordion(document.getElement('dl'), {togglers: $$('dl dt'), elements: $$('dl dd'), openAll: false}));
				}
				document.getElement('dl').retrieve('moa').showAll();
			}
		}
	],
	otherScripts: ["Selectors"]
}