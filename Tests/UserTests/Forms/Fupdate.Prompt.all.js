
{
	tests: [
		{
			title: "Fupdate.Prompt Test",
			description: "Prompts the user to update the content in the body.",
			verify: "When you click the link, were you prompted to update the content? Did it update when you submitted the popup?",
			before: function(){
				var f = new Fupdate.Prompt($('test1'), $('update1'), {
					stickyWinUiOptions: {
						width: 150
					}
				});
				$('fprompt1').addEvent('click', f.prompt.bind(f));
			}
		},
		{
			title: "Fupdate.Append.prompt Test",
			description: "Prompts the user to append to the content in the body.",
			verify: "When you click the link, were you prompted to update the content? Did it append new text when you submitted the popup?",
			before: function(){
				var f = new Fupdate.Append.Prompt($('test2'), $('update2'), {
					stickyWinUiOptions: {
						width: 150
					}
				});
				$('fprompt2').addEvent('click', f.prompt.bind(f));
			}
		},
		{
			title: "Fupdate.Prompt.AjaxPrompt Test",
			description: "Prompts the user (fetching the form via ajax) to update the content in the body.",
			verify: "When you click the link, were you prompted to update the content? Did it update when you submitted the popup?",
			before: function(){
				var f = new Fupdate.AjaxPrompt("UserTests/Forms/fupdate.form.html", $('update3'), {
					stickyWinUiOptions: {
						width: 150
					}
				});
				$('fprompt3').addEvent('click', f.prompt.bind(f));
			}
		},
		{
			title: "Fupdate.Append.AjaxPrompt Test",
			description: "Prompts the user (fetching the form via ajax) to append to the content in the body.",
			verify: "When you click the link, were you prompted to update the content? Did it append the new line when you submitted the popup?",
			before: function(){
				var f = new Fupdate.Append.AjaxPrompt("UserTests/Forms/fupdate.form.html", $('update4'), {
					stickyWinUiOptions: {
						width: 150
					}
				});
				$('fprompt4').addEvent('click', f.prompt.bind(f));
			}
		}
		
	]
}
