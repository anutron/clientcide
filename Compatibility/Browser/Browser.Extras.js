/*
Script: Browser.Extras.js
	Extends the Window native object to include methods useful in managing the window location and urls.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Window.implement({
	getHost: Browser.getHost,
	getQueryStringValue: Browser.getQueryStringValue,
	getQueryStringValues: Browser.getQueryStringValues,
	getPort: Browser.getPort,
	qs: Browser.qs
});
window.qs = window.getQueryStringValues();