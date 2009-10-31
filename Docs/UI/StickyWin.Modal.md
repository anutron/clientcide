Class: StickyWin.Modal {#StickyWin-Modal}
=======================================

Extends [StickyWin][] to add [Mask][] functionality for modal popups.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/07-stickywin.modal

### Extends

* [StickyWin][]

### Syntax

	new StickyWin.Modal(options);

### Arguments

* options - (*object*) an object of key/value options

### Options

* all of [StickyWin][]'s options plus:
* modalize - (*boolean*) if *true* (the default) the modal layer is displayed when the window is displayed, if *false*, then the window behaves just like it's [StickyWin][] counterpart without the modal behavior.
* maskOptions - (*object*) options passed to [Mask][].
* hideOnClick - (*boolean*) if *true* (the default) clicking the mask closes the window.

### Example

	new StickyWin.Modal({
		content: myContent, //a string or a DOM element
		relativeTo: $('fxTarget'),
		offset: {
			x: -200,
			y: 10
		},
		maskOptions: {
			style: {
				'background-color':'#d6e1b9',
				'opacity':.6
			}
		}
	});

[StickyWin]: http://clientcide.com/docs/UI/StickyWin
[Mask]: http://mootools.net/docs/more/Interface/Mask
