Class: StickyWin.Modal {#StickyWin-Modal}
=======================================

Extends [StickyWin][] to add [Modalizer][] functionality for modal popups.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/07-stickywin.modal

### Extends

* [StickyWin][]

### Implements

* [Modalizer][]

### Syntax

	new StickyWin.Modal(options);

### Arguments

* options - (*object*) an object of key/value options

### Options

* all of [StickyWin][]'s options plus [Modalizer][]'s options, and:
* modalize - (*boolean*) if *true* (the default) the modal layer is displayed when the window is displayed, if *false*, then the window behaves just like it's [StickyWin][] counterpart without the modal behavior.

### Example

	new StickyWin.Modal({
	  content: myContent, //a string or a DOM element
	  relativeTo: $('fxTarget'),
	  offset: {
	    x: -200,
	    y: 10
	  },
	  modalOptions: {
	    modalStyle: {
	      'background-color':'#d6e1b9',
	      'opacity':.6
	    }
	  }
	});

[StickyWin]: /docs/UI/StickyWin
[Modalizer]: /docs/UI/Modalizer
