Class: Modalizer {#Modalizer}
=============================

Provides functionality to overlay the window contents with a semi-transparent layer that prevents interaction with page content until it is removed. This class is intended to be implemented into other classes to provide them access to this functionality.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/01-modalizer

### Syntax

	//stand alone class:
	var myModalizer = new Modalizer();
	myModalizer().modalShow();
	//implemented in another class:
	var MyClass = new Class({
		Implements: [Modalizer],
		//...
	});
	MyClass.modalShow();

Modalizer Method: setModalOptions {#Modalizer:setModalOptions}
--------------------------------------------------------------

Sets the options for the modal overlay.

### Syntax

	myModalizer.setModalOptions(options);

### Arguments

1. options - (*object*) an object with name/value definitions

### Options

* see [Modalizer:modalShow][] for options list.

Modalizer Method: setModalStyle {#Modalizer:setModalStyle}
----------------------------------------------------------

Sets the style of the modal overlay to those in the object passed in.

### Syntax

	myModalizer.setModalStyle(styles);

### Arguments
1. styles - (*object*) object with key/value css properties
	
### Default styles

The object you pass in can contain any portion of this object, and the options you specify will overwrite the defaults; any option you do not specify will remain.

	{
		'display':'block',
		'position':'fixed',
		'top':'0px',
		'left':'0px',
		'width':'100%',
		'height':'100%',
		'z-index':this.modalOptions.zIndex,
		'background-color':this.modalOptions.color,
		'opacity':this.modalOptions.opacity
	}

### Returns

* (*object*) the resulting style object

### Example

	myModalizer.setModalStyle({'background-color': '#f00'});

Modalizer Method: modalShow {#Modalizer:modalShow}
--------------------------------------------------

Shows the modal window.

### Syntax

	myModalizer.modalShow(options);

### Arguments

1. options - (*object*) key/value options object

### Options

* elementsToHide - (*string*) comma seperated string of selectors to hide when the overlay is applied; example: *'select, input, img.someClass'*; defaults to *'select'*
* modalHide - (*function*) the function that hides the modal window; defaults to *function(){if ($('modalOverlay'))$('modalOverlay').hide();}*
* modalShow - (*function*) the function that shows the modal window; defaults to *function(){$('modalOverlay').setStyle('display','block');}* 
* hideOnClick - (*boolean*) allow the user to click anywhere on the modal layer to close it; defaults to *true*.
* modalStyle - (*object*) a css style object to apply to the modal overlay. See [Modalizer:setModalStyle][].
* updateOnResize - (*boolean*) will update the size of the modal layer to fit the window if the user resizes; defaults to *true*.
* layerId - (*string*) the id of the DOM element for the layer; defaults to "modalOverlay". If you wish to have more than one overlay active at a time, you must specify unique ids (otherwise instances recycle the same DOM element).

### Events

* onModalHide - (*function*) callback to execute when the modal window is removed
* onModalShow - (*function*) callback to execute when the modal window appears


### Returns

* (*object*) This [Modalizer][] instance.

### Example

	myModalizer.modalShow();
	myModalizer.modalShow({onModalHide: function(){ alert('hidden!');}});

Modalizer Method: modalHide {#Modalizer:modalHide}
--------------------------------------------------

Hides the modal layer.

### Syntax

	myModalizer.modalHide();

### Returns

* (*object*) This [Modalizer][] instance.

[Modalizer]: #Modalizer
[Modalizer:modalShow]: #Modalizer:modalShow
[Modalizer:setModalStyle]: #Modalizer:setModalStyle
