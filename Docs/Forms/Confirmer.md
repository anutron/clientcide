Class: Confirmer {#Confirmer}
=============================

Fades a message in and out to alert the user that some event (like an ajax save) has occurred.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/01-confirmer

### Implements

* [Options][], [Events][]

### Syntax

	new Confirmer(options);

### Arguments

* options - (*object*) a key/value set of options

### Options

* reposition - (*boolean*) if the element that is going to fade in and out is already present in the DOM and you want to leave it where it is, set this to *false* and it will just fade in and out; defaults to *true*
* positionOptions - (*object*) options to pass along to [Element:position][]; (see below)
* msg - (*mixed*) the default confirmation message; A string of the id for an Element or an Element reference or a string that is the message itself; can be overwritten at the time of prompting (see [Confirmer.prompt][]). If the item is a DOM element (or id) then the element will get the transition, otherwise, the message string will be inserted into a new div element and positioned; defaults to *'your changes have been saved'*
* msgContainerSelector - (*string*, css selector) if the DOM element that's fading in and out contains more HTML,	with a child element that is to contain the string of your message, this selector describes where that element is within that HTML, so that new messages can be swapped in and out without altering your HTML; defaults to *'.body'*; If this element is not found, it'll replace the entire innerHTML of the container with the message string.
* delay - (*integer*) delay (in ms) to wait after [Confirmer.prompt][] is called before the message fades in. This is useful when	the user might create numerous prompt events in a row. If they create more than one event within this delay period, the prompt will wait until the last one to actually convey the message. Defaults to *250*.
* pause: (*integer*) period to leave the message visible until fading back out; defaults to *1000*
* effectOptions: (*object*) options object to be passed to [Fx.Tween][]; defaults to *{duration: 500}*
* prompterStyle: (*object*) css style object to apply to the style box; only used if the msg option is a string.
	
### Events

* onComplete - (*function*) callback to execute when the message finishes fading out

### Notes and Examples

[Confirmer][] concerns itself mostly with fading your message in and out. If your message is already in the DOM, you can create a Confirmer and then just fade that message in and out in place.

	<input id="myInput" .../> <span id="savedMsg" style="visibility: hidden">your changes have been saved</span>
	<script>
	var myConf = new Confirmer({
		msg: 'savedMsg'
	});
	$('myInput').addEvent('change', function(){
		new Ajax(..., {onSuccess: myConf.prompt});
	});
	</script>

You can also position the confirmation element wherever you want it and, additionally, you can pass in a string for the message or a DOM element.

	var myConf = new Confirmer({
		msg: 'your changes are saved!',
		positionOptions: {
			relativeTo: 'myInput',
			position: 'bottomLeft'
		}
	});
	...
	myConf.prompt();

The message can be changed at prompt time, so you can reuse an element as you like.

	var myConf = new Confirmer({
		msg: 'your changes are saved!',
		positionOptions: {
			relativeTo: 'myInput',
			position: 'bottomLeft'
		}
	});
	...
	myConf.prompt({msg: 'your changes were NOT saved'});
Confirmer Method: prompt {#Confirmer:prompt}
--------------------------------------------

Fades the message in and out.

### Syntax

	myConfirmer.prompt(options);

### Arguments

1. options - (*object*) a key/value set of options

### Options

* msg - (*mixed*) A string of the id for an Element or an Element reference to display or a string that is the message itself.
* pause - (*integer*) the duration (in ms) to leave the message visible
* delay - (*integer*) the duration (in ms) to wait before displaying the message
* positionOptions - (*object*) options object to pass to [Element:position][]
* saveAsDefault - (*boolean*) overwrite the options specified at instantiation with these new values; defaults to *false*
								
### Returns

* (*object*) This instance of [Confirmer][]

### Note
* All of the above options are not required and will default to the values stored	in the options of the instance. The saveAsDefault option will update the stored	values with those passed in.

Confirmer Method: stop {#Confirmer:stop}
----------------------------------------

Stops the [Confirmer][] and hides it immediately.

### Syntax

	myConfirmer.stop();

### Returns

* (*object*) This instance of [Confirmer][]

[Confirmer]: #Confirmer
[Confirmer.prompt]: #Confirmer:prompt
[Element:position]: /docs/Element/Element.Position#Element:position
[Fx.Tween]: http://docs.mootools.net/Fx/Fx.Tween
[Options]: http://docs.mootools.net/Class/Class.Extras#Options
[Events]: http://docs.mootools.net/Class/Class.Extras#Events
