{
	tests: [
		{
			title: "PopupDetails",
			description: "Displays details about the movie titles when you hover over them.",
			verify: "Did the movie details appear when you put your mouse over the posters?",
			before: function(){
			
				var indianaJones = [
				 {  name: 'Raiders of the Lost Ark',
				    thumbnail: 'UserTests/UI/jones1.jpg',
				    director: 'Steven Spielberg',
				    writer: 'George Lucas & Philip Kaufman',
				    starring: 'Harrison Ford & Karen Allen',
				    duration: '115 min'
				  },
				 {  name: 'Temple of Doom',
				    thumbnail: 'UserTests/UI/doom.jpg',
				    director: 'Steven Spielberg',
				    writer: 'George Lucas & Willard Huyck',
				    starring: 'Harrison Ford & Kate Capshaw',
				    duration: '118 min'
				  },
				 {  name: 'The Last Crusade',
				    thumbnail: 'UserTests/UI/crusade.jpg',
				    director: 'Steven Spielberg',
				    writer: 'George Lucas & Philip Kaufman',
				    starring: 'Harrison Ford & Sean Connery',
				    duration: '127 min'
				  }
				];
				new PopupDetailCollection($$('#popupDetailCollectionThumbs img'), {
					details: indianaJones,
				  template: $('popupDetailHTML').get('html'),
				  popupDetailOptions: {
				   stickyWinOptions: {
				     position: 'upperRight',
				     offset: {
				       x: 0,
				       y: -50
				     }
				   }
				  }
				});
			}
		}
	],
	otherScripts: ["Selectors"]
}