Namespace: Clientcide {#Clientcide}
======================================================

This namespace contains only a few items: the version you downloaded from [the download page][] and the methods outlined below.

Clientcide Method: setAssetLocation {#Clientcide:setAssetLocation}
-------------------------------------------------------

This method resets the location of all the Clientcide image assets to your specified path. The images by default come from CNET's servers but you'll want to change this to be your own. Not only will this allow you to author your own images but it will speed up the experience for your users. It's also possible that CNET will stop serving these images at some point.

### Download the assets

 * [http://github.com/anutron/clientcide/downloads](http://github.com/anutron/clientcide/downloads)

### Tutorial/Demo

* [Online Tutorial/Demo](http://www.clientcide.com/wiki/cnet-libraries/01-core/00-clientcide)

### Syntax

	Clientcide.setAssetLocation(url);

### Arguments

1. url - (*string*) the path to the location of the unzipped files on your server

Clientcide Method: preLoadCss {#Clientcide:preLoadCss}
----------------------------------------------------------------

This method injects the default css for several classes into the DOM when the dom is ready. This is useful so that any image assets referenced by those layouts are available before you need them, giving the browser time to download them. It also prevents any layout flicker that can occur when you inject CSS into the document and inject the html that needs it at the same time.

Script: dbugScripts.js {#dbugScripts-js}
========================================


This stand-alone script allows you to debug against a live environment by discarding the live version of a library (typically compressed with no line breaks or comments) in exchange for a non-live one (typically uncompressed). This provides two primary benefits:

1. you can test against an environment using a non-compressed version of the library
2. you can test against an environment without changing it (i.e. test against a live environment with non-production ready code)

This is the entirety of the method:

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
					document.write("<scri"+"pt src=\""+baseurl+libs[i]+"\" type=\"text/javascript\"></sc"+"ript>");
				}
			} else {
				document.write("<scri"+"pt src=\""+baseurl+"\" type=\"text/javascript\"></scr"+"ipt>");
			}
			return true;
		}
		return false;
	};

### Tutorial/Demo

* [Online Tutorial/Demo](http://www.clientcide.com/wiki/cnet-libraries/01-core/00-dbug#dbugscripts)

Script: dbugScripts.js {#dbugScripts}
------------------------------------

### Syntax

	if (!dbugScripts(baseHref[, scripts]) {
		//...compressed code
	}

### Arguments

1. baseHref - (*string*) the url to the common directory containing all the compressed scripts OR the url to a single js file
2. libs - (*array*, optional) a list of file locations relative to the baseHref to each of the files contained in the library

### Details

If you include this method at the top of your first library you then can wrap your compressed library with a conditional for debugging:

	if (!dbugScritps("http://test.foo.com", ["library.js", "library2.js"]) {
		//...compressed library.js goes here
		//...compressed library2.js goes here
	}

If your compressed document only includes one file, you don't have to use the second argumnet:

	if (!dbugScripts("http://test.foo.com/foo.js")) {
		//...compressed foo.js goes here
	}

Then, using the enabling methods described in dbug.js above (see [dbug:enable][] & [dbug:cookie][]) you can switch between the uncompressed library and the compressed (live) one.

[dbug:disableCookie]: #dbug:disableCookie
[dbug:enable]: #dbug:enable
[dbug:cookie]: #dbug:cookie
[http://getfirebug.com]: http://getfirebug.com
[http://www.getfirebug.com/console.html]: http://www.getfirebug.com/console.html


[the download page]: http://www.clientcide.com/js
[setAssetLocation]: #Clientcide:setAssetLocation