Script: StickyWin.Ajax {#StickyWin-Ajax}
========================================

Adds ajax functionality to **all** the StickyWin classes.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/08-stickywin.ajax

### The following classes are created

* StickyWin.Ajax - extended form of [StickyWin][]
* StickyWin.Fx.Ajax - extended form of [StickyWin.Fx][]
* StickyWin.Modal.Ajax - extended form of [StickyWin.Modal][]
* StickyWin.Fx.Modal.Ajax - extended form of [StickyWin.Fx.Modal][]

Each class here is identical to its extended form with the additional options listed below.

### Options

* url - (*string*) the default url for the instance to hit for its content.
* requestOptions - (*object*) options passed to the ajax Request; defaults to *{method:'get'}*.
* wrapWithUi - (*boolean*) *true*: wraps the response in [StickyWin.UI][]; *false*: does not; defaults to *false*.
* caption - (*string*) if wrapping with [StickyWin.UI][], this caption will be used; defaults to an *empty string*.
* uiOptions - (*object*) if wrapping with [StickyWin.UI][], these options will be passed along as the options to [StickyWin.UI][]; defaults to *{}* (empty object)
* handleResponse - (*function*) handles the response from the server. By default it will wrap the response html with [StickyWin.UI][] if that option is enabled (which it isn't by default), then calls [StickyWin:setContent][] and then [StickyWin:show][]. This method is meant to be replaced with custom handlers if you want a different behavior (which is why it's an option).

StickyWin.Ajax Method: update {#StickyWin-Ajax:update}
------------------------------------------------------

Sends a request for new content.

### Syntax

	myStickyWinAjax.update(url, options);

### Arguments

1. url - (*string*, optional) the url to request new content from; defaults to the url specified in the options.
2. options - (*object*, optional) new options information to apply to the Request object before sending (useful if you want to use the *data* option in Request)

### Returns

* (*object*) This instance of [StickyWin.Ajax][].

### Example

	var myStickyWin = new StickyWin.Ajax({
		url: '/my/html/fragment.html'
	});
	myStickyWin.update(); //retrieves the data from the url
	myStickyWin.update('/my/other/html/fragment.html', {
		data: { foo: 'bar' }
	}); //get a different url and include some data

### Notes

* you can specify a different url at any time
* data specified in the requestOptions will be sent with each request
* the data is not requested from the server on initialize but instead only when you execute *.update*
* this file only depends on [StickyWin][]; if you also include [StickyWin.Fx][], [StickyWin.Fx.Drag][], [StickyWin.Modal][] they will also be extended with *.Ajax versions.

[StickyWin.Ajax]: #StickyWin-Ajax
[StickyWin.UI]: /docs/UI/StickyWin.UI
[StickyWin]: /docs/UI/StickyWin
[StickyWin:setContent]: /docs/UI/StickyWin#StickyWin:setContent
[StickyWin:show]: /docs/UI/StickyWin#StickyWin:show
[StickyWin.Fx]: /docs/UI/StickyWin.Fx
[StickyWin.Modal]: /docs/UI/StickyWin.Modal
[StickyWin.Fx.Modal]: /docs/UI/StickyWin.Modal#StickyWin.Fx.Modal
[StickyWin.Fx.Drag]: /docs/UI/StickyWin.Fx.Drag
