Class: StickyWin.UI.Pointy {#StickyWin-UI-Pointy}
=================================================

Extends the [StickyWin.UI][] class to create a layout with a pointer that can point in the specified direction. Note that this class is only defined for extensibility. The intended use is the static method [StickyWin.UI.pointy][]. See [StickyWin.UI][] for usage details.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/04-element/0.1-element.delegate

### Extends

* [StickyWin.UI][]

Static Method: StickyWin.UI.pointy {#StickyWin-UI-pointy}
=========================================================

Creates an html holder for in-page [StickyWin][] popups using a default style - this one using a pointer that can point in a specified direction. **This is not a class**; it is a stand-alone method. This is the intended use for this interface. You can use the class ([StickyWin.UI.Pointy][] above) but there's really no need.
	
### Syntax

	StickyWin.UI.pointy([caption, body, options]); //returns a DOM element

### Arguments

The same as [StickyWin.UI][]

### Options

* The same options as [StickyWin.UI][] in addition to:
* theme - (*string*) Which theme to use for the popup. See below for information on themes.
* themes - (*object*) A collection of styling information. See below for information on themes.
* css - (*string*) You may use your own custom CSS for the instance. This will be injected into the document for you.
* divot - (*string*) The location of the pointer image for the tip.
* divotSize - (*integer*) The size of the pointer image in pixels.
* direction - (*mixed*) Either an *integer* or a *string* for the direction the tip should point. See below for information on direction.

### Themes

This is just used to change the colors and image locations/names in the default css. The default themes are *light* and *dark* which are either a light background or a dark one. The default CSS contains keys that are substituted for the values in the selected theme. Here are the default options:

		theme: 'dark',
		themes: {
			dark: {
				bgColor: '#333',
				fgColor: '#ddd',
				imgset: 'dark'
			},
			light: {
				bgColor: '#ccc',
				fgColor: '#333',
				imgset: 'light'
			}
		}

The dark theme has a dark background color, a light foreground color, and uses an image set that all begin with "dark". The css looks like this (this is just a portion):

		div.DefaultPointyTip div.body{background: {%bgColor%}; color: {%fgColor%};}
		div.DefaultPointyTip div.top_ul{background: url({%baseHref%}{%imgset%}_back.png) top left no-repeat;}

This is processed and injected into the document when you invoke this method.

### Direction

The pointy ui has a pointer that points up, down, left, or right. The *direction* option can be these directions ("up", "down", "left", or "right") or an integer between 1 and 12. These represent the positions of the hours on a clock. So direction *12* points straight up, while position *1* points up but the pointer is on the upper right corner. This goes all the way around the tip, so *5* points down with the pointer on the bottom right corner of the tip. If you pass in "up" it translates to *12*. "left" is *9*, "right" is *3*, and "down" is *6*.

### Example

	var myUI = new StickyWin.UI.Pointy('A caption', 'A body', {
		width: 150,
		direction: 11,
		theme: 'light'
	}); //myUI is a DOM element

### See also

See also [StickyWin.PointyTip][] which is a version of [StickyWin][] that automatically positions itself using this tip layout and the direction you specify.

[StickyWin.UI]: /docs/UI/StickyWin.UI
[StickyWin.UI.pointy]: #StickyWin-UI-pointy
[StickyWin.PointyTip]: /docs/UI/StickyWin.PointyTip
[StickyWin]: /docs/UI/StickyWin