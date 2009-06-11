{
	tests: [
		{
			title: "PopupDetail",
			description: "Displays details about the movie title when you hover over it.",
			verify: "Did the movie details appear when you put your mouse over the poster?",
			before: function(){
				new PopupDetail($('popupDetailHTML').get('html'), $('raidersThumb'), {
				  data: {
				    thumbnail: 'UserTests/UI/jones1.jpg',
				    name: 'Raiders of the Lost Ark',
				    director: 'Steven Spielberg',
				    writer: 'George Lucas & Philip Kaufman',
				    starring: 'Harrison Ford & Karen Allen',
				    duration: '115 min'
				  },
				  stickyWinOptions: {
				    position: 'upperRight',
				    offset: {
				      x: 10,
				      y: -50
				    }
				  }
				});
			}
		},
		{
			title: "PopupDetail (ajax)",
			description: "Displays details (retrieved using ajax) about the movie title when you hover over it.",
			verify: "Did the movie details appear when you put your mouse over the poster?",
			before: function(){
				new PopupDetail($('popupDetailHTML').get('html'), $('raidersThumbAjax'), {
				  useAjax: true,
				  ajaxLink: 'UserTests/UI/raiders.json',
					ajaxOptions: {
						onRequest: function(){
							if (!window.location.href.test('http')) {
								(function(){
									this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};
									this.success(this.response.text, this.response.xml);
								}).delay(100, this);
							}
						}
					},
				  stickyWinOptions: {
				    position: 'upperRight',
				    offset: {
				      x: 10,
				      y: -50
				    }
				  }
				});
			}
		}
	],
	otherScripts: ["Request"]
}