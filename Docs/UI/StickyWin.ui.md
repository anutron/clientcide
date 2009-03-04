Class: StickyWin.UI {#StickyWin-UI}
======================================

The StickyWin.UI class generates the default style for [StickyWin][] popups but is not really intended to be used directly. The [StickyWin.ui][] method (below) is a wrapper for this class that generates an output outlined in the documentation below. This class (StickyWin.UI) is used mostly to provide access for subclassing (see [StickyWin.UI.Pointy][]).

### Usage

The intended use is the [StickyWin.ui][] method defined below. See it for usage and details.

The container element returned when you call the static [StickyWin.ui][] method has access to this class via element storage. For example:

		var ui = StickyWin.ui("A caption", "A message"); //same as new StickyWin.UI("A caption", "A message");
		//ui is a DOM element
		ui.retrieve('StickyWinUI'); //the instance of StickyWin.UI
		
StickyWin.UI method: setContent {#StickyWin-UI:setContent}
----------------------------------------------------------

This method sets new values for the caption and the body:

### Syntax

	myStickyWinUi.setContent(caption, body);

### Arguments

1. caption - (*mixed*) A string (text or html), a DOM Element, or a DOM Element's id to be set as the caption.
2. body - (*mixed*) A string (text or html), a DOM Element, or a DOM Element's id to be set as the body.

### Returns

* *object* - This instance of StickyWin.UI

### Example

	var myUI = StickyWin.ui('A caption', 'Some body text');
	myUI.retrieve('StickyWinUI').setContent('New caption', 'New body');

Static Method: StickyWin.ui {#StickyWin-ui}
===========================================

Creates an html holder for in-page [StickyWin][] popups using a default style. **This is not a class**; it is a stand-alone method. This is the intended use for this interface. You can use the class ([StickyWin.UI][] above) but there's really no need.
	
### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/10-stickywin.ui

### Syntax

	StickyWin.ui([caption, body, options]);
	//example with StickyWin Class
	new StickyWin({
		content: StickyWin.ui('this is the caption', 'this is the body')
	});

### Arguments

1. caption - (*string*) the caption for the popup window
2. body - (*string* or *DOM element*) content for the popup; a string of html or a DOM element to be injected into the body
3. options - (*object*) a key/value set of options

### Notes on Arguments

All of the arguments for invocation are optional. The method can be invoked in any of the following ways:

		StickyWin.ui(caption, body, options);
		StickyWin.ui(caption, body);
		StickyWin.ui(body, options);
		StickyWin.ui(body);
		StickyWin.ui(options);

After invocation you can retrieve the instance of [StickyWin.UI][] and set content at any time:

		var myUI = StickyWin.ui(); //myUI is a DOM element - a div
		myUI.retrieve('StickyWinUI').setContent('A caption', 'A body');
		//or just a body:
		myUI.retrieve('StickyWinUI').setContent('A body');

### Options

* width - (*string*) width for the box; defaults to *300px*.
* css - (*string*) override for the css styles for the default html. It can also be overridden with an external stylesheet (see [notes][]).
* cssClass - (*string*) adds a css class in addition to "DefaultStickyWin" to the container
* baseHref - (*string*) url to the path where the images in the default style are located; defaults to *http://www.cnet.com/html/rb/assets/global/stickyWinHTML/*
* buttons - (*array*) array of key/value set of button options (see below)
* cornerHandle - (*boolean*) *true*: adds a handle to the corner of the caption area for dragging; *false*: if the [StickyWin][] is draggable, the whole caption is the drag handle; defaults to *false*
* cssId - (*string*) The id of the style class to inject into the document if it's not already found. Defaults to 'defaultStickyWinStyle', which will already be in the document.
* cssClassName - (*string*) The css class to apply to the DOM element returned. Used in the CSS generated and inserted into the DOM for you (unless you overwrite it with the *css* option above). Defaults to 'DefaultStickyWin'.
* closeButton - (*boolean*) If *true* (the default) the UI will have a close button in the upper right corner.

### Buttons

* text - (*string*) the text of the button
* onClick - (*function*) function to execute on click
* properties - (*object*) a name/value set of properties applied to the element using [Element:setProperties][]
* properties.class - (*string*) a css class name for the button; defaults to *"closeSticky"* which closes the popup. You can give a different class name and the button won't close the sticky when clicked. You can also give it an additional class name (className: 'closeSticky button') so that it will have your additional class but will still close the popup.

### Example

	StickyWin.ui('the caption', 'this is the body', {
	  width: '400px',
		buttons: [
			{
				text: 'close', 
				onClick: function(){alert('closed!')}
			},
			{
				text: 'okey-dokey', 
				onClick: function(){alert('ok!')},
				properties: {'class': 'ok'} //don't close though
			},
			{
				text: 'blah', 
				onClick: function(){alert('blah!')},
				properties: {
					'class': 'closeSticky blah', //still closes
					style: 'width: 100px, border: 1px solid red',
					title: 'blah! I say!'
				}
			}
		]
	});
	//Resulting HTML:
	<div class="DefaultStickyWin">
		<div class="top">
			<div class="top_ul"></div>
			<div class="top_ur">
				<div class="closeButton closeSticky"></div>
				<h1 style="width: 335px;" class="caption">the caption</h1>
			</div>
		</div>
		<div class="middle">
			<div class="body">this is the body</div>
		</div>
		<div class="closeBody">
			<div class="closeButtons">
				<a class="closeSticky button">close</a>
				<a class="ok button">okey-dokey</a>
				<a class="closeSticky blah button" title="blah! I say!" style="width: 100px, border; 1px solid red">blah</a>
			</div>
		</div>
		<div class="bottom">
			<div class="bottom_ll"></div>
			<div class="bottom_lr"></div>
		</div>
	</div>

### Notes {#StickyWin-notes}

* You can overwite the default [StickyWin][] styles created when this method is invoked by placing a style object/tag in your document (the head or the body) with the id "defaultStickyWinStyle" or by providing the appropriate css instructions with your invocation of the method or class.

### Example

	<style type="text/css" id="defaultStickyWinStyle" rel="..yourStyleSheetUrl.." /> 
	// OR
	<style type="text/css" id="defaultStickyWinStyle">
		/* Your styles */
	</style> 

[Notes]: #StickyWin-notes
[StickyWin]: /docs/UI/StickyWin
[StickyWin.ui]: #StickyWin-ui
[StickyWin.UI.Pointy]: /docs/UI/StickyWin.UI.Pointy
[Element:setProperties]: http://docs.mootools.net/Element/Element#Element:setProperties
