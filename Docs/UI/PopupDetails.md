Class: PopupDetail {#PopupDetail}
===================================

Creates hover detail popups for a collection of elements and data.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/03-popupdetails

A [PopupDetail][] instance is a [StickyWin][] that uses [String.substitute][] to parse details into a template, all of which is related to a DOM element. When the user mouses over (or clicks, depending on the options you specify) the DOM element, a [StickyWin][] will appear near it (again, you specify the offset and whatnot). The [StickyWin][] will then disappear if the user mouses out of the element, unless they move their mouse over the [StickyWin][], in which case it will hang around until they mouse out of that (this is yet another option).

### Implements

* [Options][], [Events][]

### Syntax

	new PopupDetail(html, observer[, options]);

### Arguments

1. html - (*string*) html contents for the popup; can be a template (see [String.substitute][])
2. observer - (*mixed*) a string of the id for an Element or an Element reference that the [PopupDetail][] relates to; this is the object the user interacts with to show the popup
2. options - (*object*, optional) an object with key/value options

### Options

* observerAction - (*string*) "mouseenter", "mouseover" or "click"; the action the user must perform on the obsever to make the [StickyWin][] appear; defaults to "mouseenter"
* closeOnMouseOut - (*boolean*) close the [StickyWin][] when the user mouses out of the DOM element or the [StickyWin][]; defaults to *true*
* linkPopup - (*boolean* or *string*) make the whole [StickyWin][] popup clickable; *true*: will take the user to the .href value of the observer element, a (*string*) url will use that instead; *false*: makes the [StickyWin][] not clickable. Note that if you want the user to be able to interact with content in the [StickyWin][] (even to select it), this must be *false*; defaults to *false*
* data - (*object*) optional a key/value object of data to parse into the html of the popup; see [String.substitute][]
* useAjax - (*boolean*) get the data from an ajax [Request][]; defaults to *false*
* ajaxOptions - (*object*) optional key/value object for use with the [Request][] call; see that object for option details
* ajaxLink - (*string*) url to use to get json values for data; defaults to the *observer.href*
* ajaxCache - (*object*) an object where the keys are urls to ajax content. If the [PopupDetail][] object can find a match for its url (if it's using ajax) in the cache, it will use that content rather than hitting the server. Used in [PopupDetailCollection][] but you can use it elsewhere if you like.
* htmlResponse - (*boolean*) *true*: the response is expected to be the entire html of the content; *false*: the template schema is used and the ajax is expected to return json data; defaults to *false*
* delayOn - (*integer*) time to wait after the user interacts with the observer before showing the popup; defaults to *0* (zero)
* delayOff - (*integer*) time to wait after the user mouses out (if that is in effect) of the observer before hiding the popup; defaults to *0* (zero)
* stickyWinOptions - (*object*) the options object to pass to the instance of [StickyWin][]
* stickyWinToUse: - (*Class*) a reference to a StickyWin class to use for the popup; either [StickyWin][] or [StickyWin.Modal][]; note: this value is **not** in quotes. It is not a string, it is a variable pointing to the class.
* showNow - (*boolean*) show the [PopupDetail][] on instantiation; defaults to *false*

### Events

* onPopupShow - (*function*) callback executed when the popup is shown; passed this instance of [PopupDetail][] as an argument
* onPopupHide - (*function*) callback executed when the popup is hidden; passed this instance of [PopupDetail][] as an argument

### Properties

* visible - (*boolean*) true if this popup is visible

PopupDetail Method: show {#PopupDetail:show}
--------------------------------------------

Makes the PopupDetail visible.

### Syntax

	myPopupDetail.show();

### Arguments

1. data - (*object*; optional) data to parse into the contents of the popup

### Returns

* (*object*) This instance of [PopupDetail][]

### Note

The data is really meant to be passed in for ajax requests. This is internal to the class; you should just call .show() with no arguments.

PopupDetail Method: hide {#PopupDetail:hide}
--------------------------------------------

Makes the PopupDetail hidden.

### Syntax

	myPopupDetail.hide();

### Returns

* (*object*) This instance of [PopupDetail][]


Class: PopupDetailCollection {#PopupDetailCollection}
=====================================================

Creates a collection of [PopupDetail][] objects with the arrays of DOM elements and data objects you specify, using a common template.

### Syntax

	new PopupDetailCollection(observers[, options]);

### Arguments

1. observers - (*array*) the DOM elements that correspond to the objects in the details array that the user interacts with to show the popup
2. options - (*object*, optional) an object containing options.

### Options

* details - (*array*) an array of objects containing key/value data for each popup
* links - (*array*) an array of links or of anchor tags to link the whole popup to; defaults to	*observer.href*
* ajaxLinks - (*array*) if in popupDetailOptions you specify useAjax = true, you must also pass it a url; ajaxLinks is an array of links, one for each [PopupDetail][], to retrieve the data for the popup from the server
* useCache - (*boolean*) *true*: caches the ajax responses for all the [PopupDetail][] objects. If multiple instances use the same url they will share the same response and the server will only be hit once per request; *false*: does not cache; defaults to *true*
* template - (*mixed*) a string of the id for an Element or an Element reference, or a string of html. If an Element the innerHTML of that object will be used as the template string. This template will be parsed with the data of each item (see [String.substitute][]) and then displayed.
* popupDetailOptions - (*object*) key/value options object to be passed to each instance of [PopupDetail][] that is created for each observer. Note that this class (PopupDetailCollection) defines the option values for the data, observer, template, and link and then passes it on to [PopupDetail][], so there's no point in specifying them. This information is collected using the template specified in the options object and the corresponding values in the details, observers, and links arrays you pass in.

### Example

	<div id="popupDetailHTML" style="display: none">
		<dl>
			<dt>{name}</dt>
			<dd>{color}</dd>
		</dl>
	</div>
	<a href="http://all.about.apples.com">apples</a>
	<a href="http://all.about.lemons.com">lemons</a>
	var fruitDetails = [
		{name: 'apple',
		 color: 'red'
		},
		{name: 'lemon',
		 color: 'yellow'
		}
	];
	window.addEvent('domready', function(){ //wait for the DOM to be ready
		new PopupDetailCollection($$('a'), {
			details: fruitDetails,
			template: 'popupDetailHTML',
			//the rest here is entirely optional
			popupDetailOptions: {	//configure the PopupDetail object
				linkPopup: true,
				delayOn: 100,
				delayOff: 200,
				stickyWinOptions: {
					zIndex: 999,
					className: 'fruitStickyWin',
					position: 'upperRight',
					offset: {x: 100, y: 200}
				}
			}
		});
	});

Now when the user mouses over the link for 100ms, a popup will appear 100px to the right and 200px below the upper right corner of the link with the appropriate content.

[PopupDetail]: #PopupDetail
[PopupDetailCollection]: #PopupDetailCollection
[StickyWin]: /docs/UI/StickyWin
[StickyWin.Fx]: /docs/UI/StickyWin.Fx
[StickyWin.Modal]: /docs/UI/StickyWin.Modal
[StickyWin.Fx.Modal]: /docs/UI/StickyWin.Modal#StickyWin.Fx.Modal
[String.substitute]: http://www.mootools.net/docs/Native/String#String:substitute
[Request]: http://www.mootools.net/docs/core/Request/Request
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
