var TMPicklets = [];
if (typeof CNETProductPicker_ReviewPath != "undefined") TMPicklets.push(CNETProductPicker_ReviewPath);
if (typeof CNETProductPicker_PricePath != "undefined") TMPicklets.push(CNETProductPicker_PricePath);
if (typeof NewsStoryPicker_Path != "undefined") TMPicklets.push(NewsStoryPicker_Path);
TagMaker.anchor = new Class({
	Extends: TagMaker,
	options: {
		name: "Anchor Builder",
		output: '<a href="%Full Url%">%Inner Text%</a>',
		picklets: {
			'Full Url': (TMPicklets.length)?TMPicklets:false
		},
		help: {
			'Full Url':'Enter the external URL (http://...)',
			'Inner Text':'Enter the text for the link body'
		},
		example: {
			'Full Url':'http://www.microsoft.com',
			'Inner Text':'Microsoft'
		},
		'class': {
			'Full Url':'validate-url'
		}
	}
});

TagMaker.cnetVideo = new Class({
	Extends: TagMaker,
	options: {
		name: "CNET Video Embed Tag",
		output: '<cnet:video ssaVideoId="%Video Id%" float="%Alignment%"/>',
		help: {
			'Video Id':'The id of the video to embed'
		},
		'class':{
			'Video Id':'validate-digits required'
		},
		selectLists: {
			Alignment: [
				{
					key: 'left',
					value: 'left'
				},
				{
					key: 'right',
					value: 'right'
				},
				{
					key: 'none',
					value: '',
					selected: true
				}
			]		
		}
	}
});