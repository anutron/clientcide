Class: InputFocus {#InputFocus}
=======================

Simply adds the css class 'focused' to an input that currently has focus.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/04.1-inputfocus

### Implements

* [Options][], [Class.Occlude][], [Class.ToElement][]

### Syntax

	new InputFocus(input[, options]);

### Arguments

1. input - (*mixed*) an Element or the string id of an Element to manage submissions.
2. options - (*object*; optional) an object with key/value sets of options.

### Options

* focusedClass - (*string*) the css class name to apply when the input has focus; defaults to 'focused'.

### Example

	new InputFocus($('myInput'), {
		focusedClass: 'highlight'
	});

[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Class.Occlude]: http://www.mootools.net/docs/more/Class/Class.Occlude
[Class.ToElement]: /docs/Class/ToElement