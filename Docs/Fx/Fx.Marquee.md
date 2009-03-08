Class: Fx.Marquee {#Fx-Marquee}
==================================

A simple marquee effect for fading in and out messages.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/05-fx/00-fx.marquee

### Extends

- [Fx.Morph][]

Fx.Marque Method: constructor {#Fx-Marquee:constructor}
-------------------------------------------------------

### Syntax

	new Fx.Marquee(container [, options]);

### Arguments

1. container - (*mixed*) A string of the id for an Element or an Element reference that contains the message
2. options  - (*object*, optional) key/value set of options

### Options
* mode - (*string*) "horizontal" or "vertical" - which way the marquee goes; defaults to *"horizontal"*
* message - (*string*) the message to display; can also be specified at run time
* revert - (*boolean*) revert back to the initial message after a delay; defaults to *true*
* delay - (*number*) duration (in milliseconds) to wait before reverting
* cssClass - (*string*) the css class name to add to the message
* showEffect - (*object*) an object passed to Fx.Styles for the transition in; defaults to *{opacity: 1}*
* hideEffect - (*object*) an object passed to Fx.Styles for the transition out; defaults to *{opacity: 0}*
* revertEffect - (*object*) an object passed to Fx.Styles for the transition on revert; defaults to *{opacity: [0, 1]}*
* currentMessage - (*mixed*) a string of the id for an Element or an Element reference; the container of the currently displayed message; defaults to the first child of the container

### Example

	var myMarquee = new Fx.Marquee($('myContainer'), {
		mode: 'vertical'
	});

### Returns

* (*object*) A new instance of [Fx.Marquee][].

### Notes

-  All options specified can be specified at initialization and also at invocation (so the same effect can be used for numerous messages).

Fx.Marquee Method: announce {#Fx-Marquee:announce}
-------------------------------------------------

Shows the message, hiding the old one.

### Syntax

	myMarquee.announce(options);

### Arguments

1. options - (*object*) a key/value set of options

### Options

1. These are identical to the options for the class. This way you can use the instance for numerous messages.

### Example

	myMarquee.announce({message: "I like cheese", delay: 2000});

### Returns

* (*object*) This [Fx.Marquee][] instance.

[Fx.Marquee]: #Fx-Marquee
[Fx.Morph]: http://www.mootools.net/docs/core/Fx/Fx.Morph
