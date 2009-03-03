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

* all of [StickyWin][]'s options plus [Modalizer][]'s options

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


Class: StickyWin.Fx.Modal {#StickyWin-Fx-Modal}
=======================================

Extends [StickyWin.Fx][] to add [Modalizer][] functionality for modal popups.

### Extends

* [StickyWin.Fx][]

### Implements

* [Modalizer][]

### Syntax

	new StickyWin.Fx.Modal(options);

### Arguments

* options - (*object*) an object of key/value options

### Options

* all of [StickyWin][]'s and [StickyWin.Fx][]'s options plus [Modalizer][]'s options

### Example

	new StickyWin.Fx.Modal({
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
[StickyWin.Fx]: /docs/UI/StickyWin.Fx
[Modalizer]: /docs/UI/Modalizer
