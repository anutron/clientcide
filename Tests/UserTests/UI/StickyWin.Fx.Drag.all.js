{
	tests: [
		{
			title: "StickyWin.Fx.Drag",
			description: "Displays a draggable 'popup' in the page, fading in the transition.",
			verify: "Did the 'popup' fade in when it appeared and fade out when you closed it? Can you drag it around?",
			before: function(){
				body = "<div style=\"border: 1px solid black;background-color: #ccc; padding: 2px; width: 95%; height: 95%\"><div class=\"handle\" style=\"background-color: #333; color: #fff;cursor:pointer;width: 100%;height: 14px;\">drag handle</div>Hi. I'm a StickyWin. You can <a href=\"javascript:void(0);\" class=\"closeSticky\">close me</a> if you want.</div><br style=\"clear:both\"><a href=\"javascript:void(0)\" class=\"resizer\" style=\"float:right;cursor:nw-resize\">resize</a>";
				new StickyWin.Fx({
					content: body, 
					fadeDuration: 500,
					draggable: true,
					dragHandleSelector: 'div.handle',
					resizable: true,
					resizeHandleSelector: 'a.resizer',
					width: 300,
					height: 160
				});
			}
		}
	]
}