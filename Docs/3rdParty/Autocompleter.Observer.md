Class: Observer {#Observer}
===========================

Observes form elements for changes; part of the [Autocompleter][] 3rd party package.

* license - MIT-style license
* author & copyright	- Harald Kirschner mail[at]digitarald[dot]de
* homepage - http://digitarald.de/project/autocompleter/

### Implements

* [Options][], [Events][]

### Syntax

	new Observer(input, onFired, options);

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference of the form input to monitor.
2. onFired - (*function*) the callback function to execute when the input value changes (see options); passed two arguments: the value of the input and the input.
3. options - (*object*) a key/value set of options.

### Options

* periodical - (*integer* or *false*) *integer*: milliseconds to periodically invoke the *onFired* callback regardless of whether or not the input value changes; *false*: the *onFire* callback will only be invoked when the input value actually changes; defaults to *false*
* delay - (*integer*) milliseconds to wait before invoking the *onFired* callback after the input value changes. This is useful to allow for the user to continue typing or changing values. The *onFired* callback will only be invoked when the input has not been changed for this duration.

Observer Method: pause {#Observer:pause}
----------------------------------------

Stop observing the input for changes.

### Syntax

	myObserver.pause();

### Returns

* (*object*) This instance of [Observer][].

Observer Method: resume {#Observer:resume}
----------------------------------------

Resume observing the input for changes.

### Syntax

	myObserver.resume();

### Returns

* (*object*) This instance of [Observer][].

### Notes

If the input value has changed between calling *pause* and *resume*, the *onFire* callback will not be invoked.


[Observer]: #Observer
[Autocompleter]: http://clientcide.com/docs/3rdParty/Autocompleter
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
