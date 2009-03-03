function dbugScripts(baseurl,libs){
	var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
	var debugCookie = value ? unescape(value[1]) : false;
	if (window.location.href.indexOf("basePath=this")>0){
		var path=baseurl.substring(baseurl.substring(7,baseurl.length).indexOf("/")+8,baseurl.length);
		var href=window.location.href;
		baseurl=href.substring(href.substring(7,href.length).indexOf("/")+8,href.length);
	}
	if (window.location.href.indexOf("jsdebug=true")>0 || window.location.href.indexOf("jsdebugCookie=true")>0 || debugCookie == 'true'){ 
		if (libs) {
			for(var i=0;i<libs.length;i++){
				document.write("<scri"+"pt src=\""+baseurl+libs[i]+"\" type=\"text/javascript\"></scr"+"ipt>");
			}
		} else {
			document.write("<scri"+"pt src=\""+baseurl+"\" type=\"text/javascript\"></scr"+"ipt>");
		}
		return true;
	}
	return false;
};