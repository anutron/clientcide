Class: StickyWin.Fx {#StickyWin-Fx}
=================================

Extends [StickyWin][] to create popups that fade in and out.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/06-stickywinfx

### Extends

* [StickyWin][]

### Syntax

	new StickyWin(options);

### Arguments

1. options - (*object*) All [StickyWin][] Options in addition to those listed below.

### Options

* fade - (*boolean*, optional) fade in and out; defaults to *true*
* fadeDuration - (*integer*, optional) the duration of the fade effect; defaults to *150*
* fadeTransition - (*string*, optional) an [Fx.Transitions][] to use for the fade effect; defaults to *'[sine:in:out][]'*

### Example

	var myWin = new StickyWin({
		content: '<div id="myWin">hi there!<br /><a href="javascript:void(0);" class="closeSticky">close</a></div>',
		fadeDuration: 500  //slow it down
	});
	//fades in a box in the middle of the window with "hi there" and a close link

[StickyWin]: http://clientcide.com/docs/UI/StickyWin
[Drag]: http://www.mootools.net/docs/more/Drag/Drag
[Fx.Transitions]: http://www.mootools.net/docs/core/Fx/Fx.Transitions
[sine:in:out]: http://www.mootools.net/docs/core/Fx/Fx.Transitions#Fx-Transitions:sine
