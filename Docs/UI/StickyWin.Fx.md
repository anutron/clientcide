Class: StickyWin.Fx {#StickyWin-Fx}
=================================

Extends [StickyWin][] to create popups that fade in and out and can be dragged and resized (requires [StickyWin.Fx.Drag][]).

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/06-stickywinfx

### Extends

* [StickyWin][]

### Syntax

	new StickyWin.Fx(options);

### Arguments

1. options - (*object*) All [StickyWin][] Options in addition to those listed below.

### Options

* fade - (*boolean*, optional) fade in and out; defaults to *true*
* fadeDuration - (*integer*, optional) the duration of the fade effect; defaults to *150*
* fadeTransition - (*string*, optional) an [Fx.Transitions][] to use for the fade effect; defaults to *'[sine:in:out][]'*

### Additional Options for Dragging

These options depend on [StickyWin.Fx.Drag][] and [Drag][]; so they don't do anything if those files are not included in your environment.

* draggable - (*boolean*, optional) make the popup draggable, defaults to *false*
* dragOptions - (*object*) options to pass to the drag effect
* dragHandleSelector - (*string*, optional) optional css selector to select the element(s) within in your popup to use as a drag handle; defaults to *'.dragHandle'*
* resizable - (*boolean*, optional) make the popup resizable or not; defaults to *false*
* resizeOptions - (*object*, optional) options to pass to the resize effect
* resizeHandleSelector - (*string*, optional) css selector to select the element(s) within in your popup to use as a resize handle

### Example

	var myWin = new StickyWin.Fx({
		content: '<div id="myWin">hi there!<br /><a href="javascript:void(0);" class="closeSticky">close</a></div>',
		fadeDuration: 500,  //slow it down
		draggable: true, //make it draggable
		dragHandleSelector: 'img.handle' //get the img with the class "handle" for the handle
	});
	//fades in a box in the middle of the window with "hi there" and a close link
	//window is draggable using the image(s) with the class "handle"

[StickyWin]: /docs/UI/StickyWin
[StickyWin.Fx.Drag]: /docs/UI/StickyWin.Fx.Drag
[Drag]: http://docs.mootools.net/Drag/Drag
[Fx.Transitions]: http://docs.mootools.net/Fx/Fx.Transitions
[sine:in:out]: http://docs.mootools.net/Fx/Fx.Transitions#Fx-Transitions:sine
