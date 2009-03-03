Class: Tips.Pointy {#Tips-Pointy}
=================================

Extends the [Tips][] class to use [StickyWin.PointyTip][].

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/10.2-tips.pointy

### Syntax

	new Tips.Pointy(elements[, options]);

### Arguments

1. elements - (*mixed*) An array of DOM elements or a selector that will return DOM elements to attach the tips to.
2. options - (*object*) A key/value set of options.

### Options

* All the options in the [Tips][] class.
* pointyTipOptions - (*object*) options passed along to the [StickyWin.PointyTip][] class. Defaults:

		pointyTipOptions: {
			point: 11,
			width: 150,
			pointyOptions: {
				closeButton: false
			}
		}

### Example

	new Tips.Pointy($$('a'));

[Tips]: http://mootools.net/docs/Plugins/Tips
[StickyWin.PointyTip]: /docs/UI/StickyWin.PointyTip
