{
	tests: [
		{
			title: "StickyWin.Ajax",
			description: "Retrieves the content of the popup via ajax.",
			verify: "Did the 'popup' appear (after the ajax request)? Can you close it?",
			before: function(){
				new StickyWin.Ajax({
					fadeDuration: 500,
					url: 'UserTests/UI/StickyWin.Ajax.ajax-text.html?noCache='+new Date().getTime(),
					requestOptions: {
						evalScripts: true,
						onRequest: function(){
							dbug.log('request');
							if (!window.location.href.test('http')) {
								(function(){
									this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};
									this.success(this.response.text, this.response.xml);
								}).delay(100, this);
							}
						}
					}
				}).update();
			}
		}
	]
}