Class: StickyWin.Drag {#StickyWin-Drag}
==============================================

*StickyWin.Drag.js* extends [StickyWin][] to add draggable functionality to it. It adds no new methods or options.

### Extends

* [StickyWin][]

### Syntax

	new StickyWin(options);

### Arguments

1. options - (*object*) All [StickyWin][] Options in addition to those listed below.

### Options

* draggable - (*boolean*, optional) make the popup draggable, defaults to *false*
* dragOptions - (*object*) options to pass to the drag effect
* dragHandleSelector - (*string*, optional) optional css selector to select the element(s) within in your popup to use as a drag handle; defaults to *'.dragHandle'*
* resizable - (*boolean*, optional) make the popup resizable or not; defaults to *false*
* resizeOptions - (*object*, optional) options to pass to the resize effect
* resizeHandleSelector - (*string*, optional) css selector to select the element(s) within in your popup to use as a resize handle

### Example

	var myWin = new StickyWin({
		content: '<div id="myWin">hi there!<br /><a href="javascript:void(0);" class="closeSticky">close</a></div>',
		draggable: true, //make it draggable
		dragHandleSelector: 'img.handle' //get the img with the class "handle" for the handle
	});
	//window is draggable using the image(s) with the class "handle"


[StickyWin]: http://clientcide.com/docs/UI/StickyWin
[StickyWin.Fx]: http://clientcide.com/docs/UI/StickyWin.Fx