Class: StickyWin {#StickyWin}
=============================
Creates a div within the page with the specified contents at the location relative to the element you specify; basically an in-page popup maker.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/05-stickywin

### Implements

* [Options][], [Events][], [StyleWriter][]

### Syntax

	new StickyWin(options);

### Arguments

1. options - (*object*) an object with key/value options

### Options

* closeClassName - (*string*, optional) class name of the element(s) in your popup content that, when clicked, should close the window; defaults to *"closeSticky"*
* pinClassName - (*string*, optional) class name of the elements(s) in your popup content that, when clicked, should pin the sticky in place; defaults to *"pinSticky"*
* content - (*mixed*) the content of your popup; this should be **layout html and your message** or a **DOM element** (or its id)
* zIndex - (*integer*, optional) the zIndex of the popup; defaults to *10000* (ten thousand)
* id - (*string*) the id of the wrapper div that gets created that will contain your content
* className - (*string*, optional) class name for the wrapper div that gets created that will contain your content
* position - (*string*) "center", "upperRight", "bottomRight", "upperLeft", "bottomLeft"; the point in the popup that is positioned; defaults to 'center'. see [Element:position][]
* edge - (*string*, optional) same options as position (center, upperRight, etc.) but specifies the edge of the stickyWin to position to the point specified in position. see [Element:position][] for details; defaults to the [Element:seposition] default state.
* offset - (*object*) object containing {x: # and y: #} (integers) the top and left offset from the element in the  page that the popup is relative to; this offset is applied to the center of the popup or the corner, depending on  the value you specify in the 'position' option.
* relativeTo - (*mixed*) a DOM element to position the popup relative to; defaults to *document.body* (i.e. the window)
* width - (*integer*, optional) width for the wrapper div for your popup
* height - (*integer*, optional) height for the wrapper div for your popup
* timeout - (*integer*, optional) timeout interval to hide the popup after a specified time
* allowMultiple - (*boolean*, optional) allow multiple instance of StickyWin on the page; defaults to *true*
* allowMultipleByClass - (*boolean*, optional) allow multiple popups that share the same className as specified in the className option; defaults to *true*
* showNow - (*boolean*, optional) display the popup on instantiation; defaults to *true*
* useIframeShim - (*boolean*, optional) use an [IframeShim][] to mask content below the element; defaults to *true*
* iframeShimSelector - (*string*) the css selector to find the element within your popup under which the [IframeShim][] should be placed to obscure select lists and the like (see [IframeShim][])
* inject - (*object*) the target and location of where to inject the StickyWin; defaults to *{target: document.body, where: 'bottom'}*
* destroyOnClose - (*boolean*) when closed, the container is removed and garbage collected (this makes the StickyWin instance useless after it's been closed). Defaults to *false*.
* closeOnClickOut - (*boolean*) if *true*, clicks outside the window will close it; defaults to *false*.
* closeOnEsc - (*boolean*) if *true*, closes the window when the user hits escape; defaults to *false*.

### Events

* onDisplay - (*function*) callback to execute when the popup is shown.
* onClose - (*function*) callback to execute when the popup is closed.
* onDestroy - (*function*) callback to execute when the popup is destroyed.

### Example

	var myWin = new StickyWin({
		content: '<div id="myWin">hi there!<br /><a href="javascript:void(0);" class="closeSticky">close</a></div>'
	});
	//popups up a box in the middle of the window with "hi there" and a close link


StickyWin Method: show {#StickyWin:show}
----------------------------------------

Shows the popup.

### Syntax

	myStickyWin.show();

### Returns

* (*object*) This instance of [StickyWin][]

StickyWin Method: hide {#StickyWin:hide}
----------------------------------------

Hides the popup.

### Syntax

	myStickyWin.hide();

### Returns

* (*object*) This instance of [StickyWin][]


StickyWin Method: setContent {#StickyWin:setContent}
----------------------------------------------------

Sets the content of the popup.

### Syntax

	myStickyWin.setContent(content);

### Arguments

1. content - (*mixed*) either the html to insert as the body of the StickyWin or a DOM Element (or its id) to inject inside as the content.

### Returns

* (*object*) This instance of [StickyWin][]

StickyWin Method: position {#StickyWin:position}
------------------------------------------------

Repositions the popup (incase it has moved or the document has been altered).

### Syntax

	myStickyWin.position(options);

### Arguments

1. options - (*object*; optional) positioning options passed to [Element:position][]. By default these options are the options defined when you instantiate the class (see the *relativeTo*, *position*, *offset*, and *edge* options defined in the Class options above). Pass in an alternate set of instructions to position differently.

### Example

	myStickyWin.position({
		relativeTo: $('someElement'),
		offset: {x: 10, y: 10},
		edge: 'upperLeft',
		position: 'upperRight'
	});

### Returns

* (*object*) This instance of [StickyWin][]

StickyWin Method: pin {#StickyWin:pin}
--------------------------------------

Affixes the stickywin to a fixed position, even if the window is scrolled. See [Element:pin][].

### Syntax

	myStickyWin.pin();

### Returns

* (*object*) This instance of [StickyWin][]

StickyWin Method: unpin {#StickyWin:unpin}
--------------------------------------

Sets the StickyWin to an absolute position. See [Element:unpin][].

### Syntax

	myStickyWin.unpin();

### Returns

* (*object*) This instance of [StickyWin][]

StickyWin Method: togglepin {#StickyWin:togglepin}
--------------------------------------

Toggle the pinned state of the Sticky.

### Syntax

	myStickyWin.togglepin();

### Returns

* (*object*) This instance of [StickyWin][]

StickyWin Method: destroy {#StickyWin:destroy}
--------------------------------------

Destroys this instance.

### Syntax

	myStickyWin.destroy();

Element property: StickyWin {#Element:StickyWin}
------------------------------------------------

### Syntax

	myElement.retrieve('StickyWin'); //the instance of StickyWin for the element

### Notes

In the example *myElement.retrieve('StickyWin')*, *myElement* is the containing div, the same one as if you called *$(myStickyWinInstance)* or *myStickyWinInstance.win*. This div always has the class "StickyWinInstance". So:

	var myStickyWin = new StickyWin(...);
	document.getElement('div.StickyWinInstance') == myStickyWin.win == $(myStickyWin);
	myStickyWin == document.getElement('div.StickyWinInstance').retrieve('StickyWin');

[StickyWin]: #StickyWin
[StyleWriter]: http://clientcide.com/docs/UI/StyleWriter
[IframeShim]: http://clientcide.com/docs/Browser/IframeShim
[Element:position]: http://clientcide.com/docs/Element/Element.Position#Element:position
[Element:pin]: http://clientcide.com/docs/Element/Element.Pin#Element:pin
[Element:unpin]: http://clientcide.com/docs/Element/Element.Pin#Element:unpin
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
