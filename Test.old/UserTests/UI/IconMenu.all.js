{
	tests: [
		{
			title: "IconMenu :: scrolling",
			description: "Verifies that you can paginate the icons.",
			verify: "Can you page right and left as you like?"
		},
		{
			title: "IconMenu :: delete selected",
			description: "Verifies that you can remove individually selected items.",
			verify: "Can you remove items you select by clicking the checkboxes and then clicking 'Remove Selected'?"
		},
		{
			title: "IconMenu :: empty",
			description: "Verifies that you can remove all the icons at once.",
			verify: "Can you empty the toolbar by clicking 'empty'?"
		},
		{
			title: "IconMenu :: add",
			description: "Verifies that you can add individual icons.",
			verify: "Did a new icons appear (there should be 7)? Can you page right/left? Can you remove them?",
			before: function(){
				dbug.log('myIconMenu: ', $type(myIconMenu));
				['http://i.i.com.com/cnwk.1d/sc/32085029-2-60-0.gif',
				 'http://i.i.com.com/cnwk.1d/sc/32098288-2-60-0.gif',
				 'http://i.i.com.com/cnwk.1d/sc/32327766-2-60-0.gif',
				 'http://i.i.com.com/cnwk.1d/sc/32088045-2-60-0.gif',
				 'http://i.i.com.com/cnwk.1d/sc/31429517-2-60-0.gif',
				 'http://i.i.com.com/cnwk.1d/sc/31414802-2-60-0.gif',
				 'http://i.i.com.com/cnwk.1d/sc/31355096-2-60-0.gif'].each(function(url){
						var li = new Element('li').inject(document.getElement('ul.set'));
						myIconMenu.addItem(new Element('img', {src: url}).inject(li), new Element('span', {'class':'caption'}).grab(new Element('input', {type: 'checkbox'})).inject(li));
				});
			}
		}
	],
	otherScripts: ["Fx.Transitions"]
}
