Class: DatePicker {#DatePicker}
===============================

DatePicker.Extras extends [DatePicker][] to include range selection and time entry.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/03-datepicker.extras


### Syntax

	new DatePicker(inputs[, options]);

### Arguments

1. inputs - (*mixed*) one or two inputs for the picker; if using range selection, pass in an array of inputs (start and end times), else a single input
2. options - (*object*) a set of key/value settings

### Options

* format - (*string*) see [Date][] and [Date.Extras][]; defaults to *"%x %X"*, which outputs *'12/31/1999 12:59PM'*
* extraCSS - (*string*) overwritable css styles for the extra date picker content for range and time.
* range - (*boolean*) whether or not the user can choose a range; defaults to *false*
* time - (*boolean*) whether or not the user can enter a time (hours and minutes); defaults to *false*

### Notes

*	See [DatePicker][] for more options.

[DatePicker]: http://clientcide.com/docs/Forms/DatePicker
[Date]: http://www.mootools.net/docs/more/Native/Date
[Date.Extras]: http://www.mootools.net/docs/more/Native/Date.Extras
