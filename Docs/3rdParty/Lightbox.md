Class: Lightbox {#Lightbox}
-------------------------
A lightbox clone for Mootools.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]: http://www.clientcide.com/wiki/cnet-libraries/11-3rdparty/05-lightbox

### Authors

* Christophe Beyls (for Slimbox) ([http://www.digitalia.be][]); MIT-style license.
* Inspired by [the original Lightbox v2 by Lokesh Dhakar][].
* Refactored by Aaron Newton 

### Implements

* [Options][], [Events][]

### Syntax

	new Lightbox(options);

### Arguments

* options - (*object*) a set of key/value options


### Options
* anchors - (*array*) a group of anchors to which to add lightbox functionality; defaults to *$$('a[rel=lightbox]')*.
* resizeDuration - (*integer*) duration in milliseconds for the resize effect; defaults to *400*
* resizeTransition - (*function*) optional [Fx.Transitions][] transition reference
* initialWidth - (*integer*) the initial width of the box; defaults to *250*
* initialHeight - (*integer*) the height width of the box; defaults to *250*
* zIndex - (*integer*) zindex for the overlay; defaults to *5000*
* overlayStyles - (*object*) styles object to pass to [Element:setStyle][] for the modal layer (so you can set it to be whatever color or opacity you like). Note that the default styles are located in the (external) css file.
* animateCaption - (*boolean*) slide the caption in smoothly; defaults to *true*
* showCounter - (*boolean*) shows the number of images in the set; defaults to *true*
* autoScanLinks - (*boolean*) scan the document for anchor tags with rel tags == the relString option (only used if the *anchors* option is undefined); defaults to *true*
* relString - (*string*) the string value for the "rel" tag that will make the link use the lightbox; defaults to *'lightbox'*. Unused if the anchors argument is specified.
* useDefaultCss - (*boolean*) injects the default css for the lightbox; defauls to *true*.
* assetBaseUrl - (*string*) the url where the css and image assets are (a directory); defaults to
                     *"http://www.cnet.com/html/rb/assets/global/slimbox/"*. See [Clientcide.setAssetLocation][].

### Events

* onImageShow - (*function*) optional callback fired when an image is displayed; passed two arguments: the index of the image shown and the image element shown.
* onDisplay - (*function*) optional callback fired when the lightbox first shows up (*onImageShow* is fired just after this for the first image displayed and all subsequent images displayed if a set is shown). Passed no arguments.
* onHide - (*function*) optional callback fired when the lightbox is closed. Passed no arguments.

### Element Storage

Each image managed by the instance will have a property called "lightbox" stored that will retrive the instance.

### Examples

	new Lightbox(); //defaults; scans the document for rel="lightbox...
	new Lightbox({
		anchors: $$('a.lightbox'), //use all anchor tags with class "lightbox" instead
		autoScanLinks: false
	});

### Note

A new Lightbox is created on [DomReady][], so it is not required that you write any javascript at all. All you must do is add rel="lightbox" to your images (and rel="lightbox[setName]" for sets). If you want to create a Lightbox on the fly or with some other set of images, you can do that whenever you like.

[LightBox]: #LightBox
[Clientcide.setAssetLocation]: /docs/Core/Clientcide#Clientcide:setAssetLocation
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
[Fx.Transitions]: http://www.mootools.net/docs/core/Fx/Fx.Transitions
[Element:setStyle]: http://www.mootools.net/docs/core/Element/Element.Style#Element:setStyle
[DomReady]: http://www.mootools.net/docs/core/Utilities/DomReady
[http://www.digitalia.be]: http://www.digitalia.be
[the original Lightbox v2 by Lokesh Dhakar]: http://www.huddletogether.com/projects/lightbox2/
