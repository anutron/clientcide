Popup = new Class({
	Extends: Popup,
	openWin: function(url){
		this.popupWindow = this.parent(url);
		return this.window;
	}
});