$extend(Browser, {
	getHost: function(url) {
		return new URI(url).get('host');
	},
	getQueryStringValue: function(key, url){
		return new URI(url).getData(key);
	},
	getQueryStringValues: function(url){
		return new URI(url).getData();
	},
	getPort: function(url){
		return new URI(url).get('port');
	},
	redraw: function(element){
	    var n = document.createTextNode(' ');
	    this.adopt(n);
	    (function(){n.dispose()}).delay(1);
	    return this;
	}	
});
window.addEvent('domready', function(){
	var count = 0;
	//this is in case domready fires before string.extras loads
	function setQs(){
		function retry(){
			count++;
			if (count < 20) setQs.delay(50);
		}; 
		try {
			if (!Browser.getQueryStringValues()) retry();
			else Browser.qs = Browser.getQueryStringValues();
		} catch(e){
			retry();
		}
	}
	setQs();
});