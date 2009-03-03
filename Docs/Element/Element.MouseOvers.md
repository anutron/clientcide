Native: Element {#Element}
==========================

Collection of mouseover behaviours (images, class toggles, etc.).
These functions handle standard mouseover behaviour.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/04-element/02-element.mouseovers

Element Method: autoMouseOvers {#Element:autoMouseOvers}
--------------------------------------------------------

Handles hover states for images and DOM elements. Producers simply author all their images to have an on version and an off version with same naming conventions, then call this method with those conventions.

### Syntax

	myElement.autoMouseOvers(options);

### Arguments

1. options - (*object*) a key/value set of options

### Options

* overString - (*string*) string to replace the *outString* with in image sources on mouseenter if the element is an image; defaults to '_over'
* outString - (*string*) string to replace the *overString* with in image sources on mouseleave if the element is an image; defaults to '_out'
* cssOver - (*string*) css class name to add to the element on mouseenter; defaults to 'hover'
* cssOut - (*string*) css class name to add to the element on mouseleave: defaults to 'hoverOut'
* subSelector - (*string*) if defined will be used to select for child elements of this element and will apply the *cssOver* and *cssOut* classes to this element when the user mouseenters and mouseleaves the child element
* applyToBoth - (*boolean*) if true and *subSelector* is defined the *cssOver* and *cssOut* classes will be applied to both the child and this element; defaults to *false*

### Returns

* (*element*) This element.

### Example

	<img src="myimg_out.gif" id="myImage" />
	
	$('myImage').autoMouseOvers();

	//Result when users mouseover:
	<img src="myimg_over.gif" id="myImage" class="hover" />
	//and on mouse out:
	<img src="myimg_out.gif" id="myImage" class="hoverOut" />

### Notes

* For DOM elements that are not images, just the classes are applied to them.
* The default instance of this function is included in this library. If producers name their on/off state files with *"_over"* and *"_out"* in the file names and give their images the class *"autoMouseOver"* then they don't have to write any javascript. This also works for inputs that are images.
