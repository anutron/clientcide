Class: StickyWin.PointyTip {#StickyWin-PointyTip}
=================================================

This is an instance of [StickyWin][] that automatically wraps the values you pass in [StickyWin.UI.Pointy][] to create a tool-tip that points at a specified DOM element from a specified direction.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/07.5-stickywin.pointytip

### Implements

* [Options][], [StyleWriter][]

### Extends

* [StickyWin][]

### Syntax

	new StickyWin.PointyTip([caption, body, options]);

### Arguments

1. caption - (*mixed*; optional) A *string*, DOM *element*, or DOM element id for the caption for the tip.
2. body - (*mixed*; optional) A *string*, DOM *element*, or DOM element id for the body for the tip.
3. options - (*object*; optional) A key/value set of options.

### A Note on Arguments

Note that like [StickyWin.UI][] each of the arguments is optional. Thus, all of these would work:

		new StickyWin.Pointy(caption, body, options);
		new StickyWin.Pointy(caption, body);
		new StickyWin.Pointy(body, options);
		new StickyWin.Pointy(body);
		new StickyWin.Pointy(options);

### Options

* All the options for [StickyWin][] in addition to:
* point - (*mixed*) A *string* or *integer* for the direction of the pointer (see [StickyWin.UI.Pointy][]). This direction will be used not only to position the pointer on the tip but also to position the tip. So, if the pointer points up, the tip will be below the *relativeTo* element. If the tip points left, the tip will be to the right. etc.
* pointyOptions - (*object*) A set of key/value options passed on to [StickyWin.UI.Pointy][].

StickyWin.PointyTip Method: setContent {#StickyWin-PointyTip:setContent}
========================================================================

Sets the caption and body of the tip.

### Syntax

	myStickyWinPointyTip.setContent(caption, body);
	//OR
	myStickyWinPointyTip.setContent(body);

### Arguments

1. caption - (*mixed*; optional) A *string*, DOM *element*, or DOM element id for the caption for the tip.
2. body - (*mixed*; optional) A *string*, DOM *element*, or DOM element id for the body for the tip.

### A Note on Arguments

See the note on arguments in the section above.

### Returns

* *object* - This instance of StickyWin.PointyTip

[StickyWin]: http://clientcide.com/docs/UI/StickyWin
[StickyWin.UI.Pointy]: http://clientcide.com/docs/UI/StickyWin.UI.Pointy
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras
[StyleWriter]: http://clientcide.com/docs/UI/StyleWriter