Hash: Browser {#Browser}
========================

Some browser properties are attached to the [Browser][] Object.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/02-browser/03-popup

Browser Class: Popup {#Browser-Popup}
=====================================

This class opens a popup window with the passed in values.

### Syntax

	new Browser.Popup(url[, options]);

### Arguments

1. url - (*string*) the destination for the popup
2. options - (*object*) an object containing key/value options

### Options

* width - (*integer*) the width of the window; defaults to *500*
* height - (*integer*) the height of the window; defaults to *300*
* x - (*integer*) the offest from the left of the screen; defaults to *50*
* y - (*integer*) the offset from the top of the screen; defaults to *50*
* toolbar - (*integer*) show the browser toolbar in the window; *0* (zero) does not show it, *1* (one) does; defaults to *0* (zero)
* location - (*integer*) show the location in the browser; *0* (zero) does not show it; defaults to *0* (zero)
* directories - (*integer*) show the directories in the browser; *0* (zero) does not show it; defaults to *0* (zero)
* status - (*integer*) show the status bar in the browser; *0* (zero) does not show it; defaults to *0* (zero)
* scrollbars - (*string*) *'auto'* shows the scroll bars if they are required, *'no'* shows none, *'yes'* shows them all the time
* resizable - (*integer*) lets the user resize the window; *1* (one) allows resizing; defaults to *1* (one)
* name - (*string*) the name of the popup; defaults to *"popup"*

### Examples

	var myPopup = new Popup('http://www.example.com'); //opens with default parameters
	var myPopup = new Popup('http://www.example.com', {
		width: 300,
		height: 800,
		x: 500,
		toolbar: 1
	}); //launch a window with custom properties

Popup Method: focus {#Browser-Popup:focus}
------------------------------------------

Focus the window.

### Syntax

	myPopup.focus();

### Returns

* (*object*) This instance of [Popup][].

### Example

	var myPopup = new Popup('http://www.example.com'); //opens with default parameters
	myPopup.focus(); //bring it to the front

### Notes

When you create a new [Popup][] it calls *focus* on itself immediately by default.

Popup Method: close {#Browser-Popup:close}
------------------------------------------

Closes the popup window.

### Syntax

	myPopup.close();

### Returns

* (*object*) This instance of [Popup][]

### Example
	var myPopup = new Popup('http://www.example.com'); //opens with default parameters
	myPopup.close(); //close the window

Popup Property: window {#Browser-Popup:window}
----------------------------------------------

The window object itself (the popup). The class [Popup][] opens a new browser window. The pointer to this window can be reached like so:

	var myPopup = new Popup('http://www.example.com');
	myPopup.window; // this is the reference to the popup itself.

### Notes

If you call this class with the same name (the default name is 'popup') as an already open window	you won't open a new popup window, but instead will send your url to the existing window. You should probably give it something unique so you can have more than one if you need. 

	var myPopup = new Popup('http://www.example.com'); //default name for the popup is "popup"
	var anotherPopup = new Popup('http://www.example2.com'); //you just refreshed the "popup" window with this new url

This actually represents a way to keep refering to the same window that's already open. So long as the window 	calling it is the same window that opened the popup to begin with (even if the user goes to another page), the above code will always re-acquire the already open popup.

	//page loads
	var myPopup = new Popup('http://www.example.com'); //default name for the popup is "popup"
	
	//user goes to another page, and, when that page loads, this happens again
	var myPopup = new Popup('http://www.example.com'); //default name for the popup is "popup"

The result is you just refreshed the already open window with the same url. There are ways to do this	without refreshing, but not with this class (yet).

[Popup]: #Browser-Popup
[Browser]: http://docs.mootools.net/Core/Browser
