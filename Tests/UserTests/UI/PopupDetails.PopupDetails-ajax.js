{
	tests: [
		{
			title: "PopupDetail (ajax)",
			description: "Displays details (retrieved using ajax) about the movie title when you hover over it.",
			verify: "Did the movie details appear when you put your mouse over the poster?",
			before: function(){
				new PopupDetailCollection($$('#popupDetailCollectionThumbs img'), {
					ajaxLinks:[
						'UserTests/UI/raiders.json',
						'UserTests/UI/doom.json',
						'UserTests/UI/crusade.json'
					],
					useAjax: true,
					template: $('popupDetailHTML').get('html'),
					popupDetailOptions: {
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
							 x: 0,
							 y: -50
						 }
					 }
					}
				});
			}
		}
	],
	otherScripts: ["Selectors", "Request"]
}