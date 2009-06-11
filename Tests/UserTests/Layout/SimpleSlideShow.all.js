{
	tests: [
		{
			title: "SimpleSlideShow",
			description: "Cycles through four slides.",
			verify: "Does the slideshow allow you to cycle through all the slides? Does it wrap around back to slide 1 when you click 'next' on slide 4?",
			before: function(){
				new SimpleSlideShow({ 
					slides: $$('#slideShow p'), 
					currentIndexContainer: 'slideNow', 
					maxContainer: 'slideMax',  
					nextLink: 'ssNxt',  
					prevLink: 'ssPrv'
				});
			}
		},
		{
			title: "SimpleSlideShow.Carousel",
			description: "Cycles through four images using a horizontal carousel.",
			verify: "Does the slideshow slide horizontally through the images?",
			before: function(){
				new SimpleSlideShow.Carousel($('slideShow2'), {
					slides: $$('#slideShow2 p'), 
					currentIndexContainer: 'slideNow2', 
					maxContainer: 'slideMax2',  
					nextLink: 'ssNxt2',  
					prevLink: 'ssPrv2',
					fxOptions: {
						property: 'top'
					}
				});
			}
		},
		{
			title: "SimpleImageSlideShow",
			description: "Cycles through four images.",
			verify: "Does the slideshow perform as the one above does, only this time with images?",
			before: function(){
				new SimpleImageSlideShow($('screenShotImgs'), {
				  startIndex: 0,
				  imgUrls: ['UserTests/UI/jones1.jpg',
				'UserTests/UI/doom.jpg',
				'UserTests/UI/crusade.jpg'],
				  currentIndexContainer: 'imgNow',
				  maxContainer: 'imgMax',
				  nextLink: 'nextImg',
				  prevLink: 'prevImg'
				});
			}
		},
		{
			title: "SimpleImageSlideShow.Carousel",
			description: "Cycles through four images in a horizontal carousel.",
			verify: "Does the slideshow perform as the one above does, only this time with a horizontal animation?",
			before: function(){
				new SimpleImageSlideShow.Carousel($('screenShotImgs2'), {
				  startIndex: 0,
				  imgUrls: ['UserTests/UI/jones1.jpg',
				'UserTests/UI/doom.jpg',
				'UserTests/UI/crusade.jpg'],
				  currentIndexContainer: 'imgNow2',
				  maxContainer: 'imgMax2',
				  nextLink: 'nextImg2',
				  prevLink: 'prevImg2'
				});
			}
		}
	],
	otherScripts: ['Selectors']
}