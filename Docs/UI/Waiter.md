Class: Waiter {#Waiter}
=======================

Adds a semi-transparent overlay over a DOM element with a 'spinning' ajax icon.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/11-waiter

### Implements

* [Options][], [Events][], [Chain][]

### Syntax

	new Waiter(target[, options]);

### Arguments

1. target - (*mixed*) A string of the id for an Element or an Element reference to overlay; defaults to *document.body*
2. options - (*object*) a key/value set of options

### Options

* baseHref - (*string*) url prefix for the img src (see below); defaults to *'http://www.cnet.com/html/rb/assets/global/waiter/'*
* img - (*object* or *false*) options for the image (see below); if set to *false* no image will be injected.
* containerPosition - (*object*) options passed to [Element:position][] for the container of the message; relativeTo is set to the target above automatically (but can be overwritten).
* containerProps - (*object*) attributes for the container div that contains the (optional) message and the image
* msg - (*mixed*, optional) message placed above the spinner image (as in "Please wait..."). Can be a *string* or an *element*.
* msgProps - (*object*) attributes for the container of the (optional) message
* layer - (*object*) options for the overlay layer (see below)
* fxOptions - (*object*) options passed to the effects used to transition the overlay and the image opacity
* useIframeShim - (*boolean*) *true*: an [IframeShim][] will be used underneath the modal layer; *false*: no shim is used; defaults to *true*
* iframeShimOptions - (*object*) options passed to [IframeShim][]


### Events

* onShow - (*function*) callback to execute when the waiting layer is shown; passed the target element to which the [Waiter][] was attached
* onHide - (*function*) callback to execute when the waiting layer is hidden; passed the target element to which the [Waiter][] was attached

### Default Element Properties

These are the default properties for all the DOM elements created by the [Waiter][] class. You can pass in your own properties. If you pass in a subset of these properties, the remaining (unspecified) properties will be merged from the default.

	containerProps: {
		styles: {
			position: 'absolute',
			'text-align': 'center'
		},
		'class':'waiterContainer'
	},
	containerPosition: {},
	msg: false,
	msgProps: {
		styles: {
			'text-align': 'center',
			fontWeight: 'bold'
		},
		'class':'waiterMsg'
	},
	img: {
		src: 'waiter.gif',
		styles: {
			width: 24,
			height: 24
		},
		'class':'waiterImg'
	},
	layer:{
		styles: {
			width: 0,
			height: 0,
			position: 'absolute',
			zIndex: 999,
			display: 'none',
			opacity: 0.9,
			background: '#fff'
		},
		'class': 'waitingDiv'
	}

### Example

	<div id="myElement">...</div>
	
	new Waiter('myElement', {
		baseHref: 'http://myserver.com/art',
		img: {
			src: 'waiter.gif',
			id: 'waitingImg',
			styles: {
				position: 'absolute',
				width: 24,
				height: 24,
				display: 'none',
				opacity: 0,
				zIndex: 999
			}
		},
		layer: {
			id: 'waitingDiv',
			background: '#fff',
			opacity: 0.9
		}
	});


Waiter Method: toggle {#Waiter:toggle}
--------------------------------------

Toggles the [Waiter][] over the specified element. If the [Waiter][] is currently showing over the specified element, it will hide. Otherwise it will display.

### Syntax

	myWaiter.toggle(element);

### Arguments

1. element - (*mixed*, optional) A string of the id for an Element or an Element reference to overlay; defaults to the target passed in at initialization, but you can specify a different element if you wish to reuse the class.

### Returns

* (*object*) This instance of [Waiter][]

Waiter Method: start {#Waiter:start}
------------------------------------

Displays the [Waiter][] layer.

### Syntax

	myWaiter.start(element);

### Arguments

1. element - (*mixed*, optional) A string of the id for an Element or an Element reference to overlay; defaults to the target passed in at initialization, but you can specify a different element if you wish to reuse the class.

### Returns

* (*object*) This instance of [Waiter][]

Waiter Method: stop {#Waiter:stop}
----------------------------------

Hides the [Waiter][] layer.

### Syntax

	myWaiter.stop();

### Returns

* (*object*) This instance of [Waiter][]

Class: Request.HTML {#Request-HTML}
===================================

Extends [Request.HTML][] to add integrated [Waiter][] functionality.

### Extends

* [Request.HTML][]

### Syntax

	new Request.HTML(options);

### Arguments

* options - (*object*) an object with key/value options

### Options

* all of [Request.HTML][] options PLUS:
* useWaiter - (*boolean*) use the [Waiter][] class with this request
* waiterOptions - (*object*) the options object for the [Waiter][] class
* waiterTarget - (*mixed*) a string of the id for an Element or an Element reference to use instead of the one specifed in the *update* option. This is useful if you want to overlay a different area (or, say, the parent of the one being updated).

### Example

	new Request.HTML({
		url: '/myHtmlFragment.html',
		update: $('myElement'),
		useWaiter: true,
		waiterOptions: {
			baseHref: 'http://myserver.com/art',
			img: {
				src: 'waiter.gif',
				styles: {
					width: 24,
					height: 24
				}
			},
			layer: {
				background: '#fff',
				opacity: 0.9
			}
		}
	});

### Notes

* When you execute *Request.HTML.send* the [Waiter][] class will automatically overlay the area on the page that's going to get updated with the new content and when this area is updated the [Waiter][] hides itself.


Native: Element {#Element}
==========================

Extends the native Element object with [Waiter][] methods.

Element Property: waiter {#Element-Properties:waiter}
---------------------------------------------------

### Setter

Sets a default [Waiter][] instance for an Element.

#### Syntax:

	el.set('waiter'[, options]);

#### Arguments

1. options - (*object*, optional) The [Waiter][] options.

#### Returns

* (*element*) This Element.

#### Examples

	el.set('waiter', {msg: 'one moment...'});
	el.wait(); //obscure the element with the spinner
	el.release(); //hide the spinner

### Getter

Gets the default [Waiter][] instance for the Element.

#### Syntax

	el.get('waiter'[, options]);

#### Arguments

1. name - (*string*) This should always be 'waiter'.
1. options - (*object*, optional) The [Waiter][] options. If these are passed in, a new instance will always be generated.

#### Returns

* (*object*) The Element's internal [Waiter][] instance.

#### Examples

	el.set('waiter', {msg: 'one moment...'});
	el.wait(); //show the spinner
	el.get('waiter'); //The Waiter instance.

Native: Element {#Element}
==========================

Adds [Waiter][] shortcuts to the [Element][] class.

Element Method: wait {#Element:wait}
----------------------------------------

Retrieves the "build-in" instance of [Waiter][] and calls its *start* method.

### Syntax

	$('myElement').wait([options]);

### Arguments

1. options - (*object* - optional) the options for the default waiter.

### Returns

* (*element*) This Element

Element Method: release {#Element:release}
--------------------------------------------

Retrieves the "build-in"  instance of [Waiter][] and calls its *release* method.

### Syntax

	$('myElement').release();

### Returns

* (*element*) This Element


[Waiter]: #Waiter
[IframeShim]: /docs/Browser/IframeShim
[Element:position]: /docs/Element/Element.Position#Element:position
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
[Chain]: http://www.mootools.net/docs/core/Class/Class.Extras#Chain
[Request.HTML]: http://www.mootools.net/docs/core/Request/Request.HTML
