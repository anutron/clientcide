Class: DatePicker {#DatePicker}
===============================

Allows the user to enter a date in any popuplar format or choose from a calendar. See also: [DatePicker.Extras][] for range and time options.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/02-datepicker

### Authors

* Paul Anderson
* Aaron Newton

### Implements

* [Options][], [Events][], [StyleWriter][]

### Syntax

	new DatePicker(input[, options]);

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference for the input for the date
2. options - (*object*) an object with key/value settings

### Options

* format - (*string*) see [Date][]; defaults to *"%x"* which renders 12/31/1999
* stickyWinOptions - (*object*) key/value settings to pass along to the [StickyWin][] popup object; defaults to *{position: 'bottomLeft', offset: {x:10, y:10}}*
* stickyWinUiOptions - (*object*) options passed to [StickyWin.UI][]; note that the option for *width* is set automatically.
* stickyWinToUse - (*Class*) which [StickyWin][] class to use ([StickyWin][], [StickyWin.Fx][], etc.)
* draggable - (*boolean*) whether or not the popup is draggable; requires [Drag][]; defaults to *true* (if [Drag][] is not present, the element won't be draggable, but it won't throw an error).
* dragOptions - (*object*) key/value settings to pass on to [Drag][]
* additionalShowLinks - (*array*) collection of DOM elements that should show the calendar for the input when clicked
* showOnInputFocus - (*boolean*) whether to show the calendar when the input is focused; defaults to *true*; if set to *false*, you must specify at least one object in additionalShowLinks if you want the calendar to be accessible. **NOTE:** you can set this to false and specify no additional show links and this class will still auto-format date inputs for you
* useDefaultCss - (*boolean*) whether to use the default css described in this class. If *false*, you must define your own css; defaults to *true*
* hideCalendarOnPick - (*boolean*) whether to hide the calendar when the user chooses a date; defaults to *true*
* calendarId - (*string*) the id of the calendar to show
* updateOnBlur - (*boolean*) updates the input when the user moves the focus out of the input. If set to *false*, the only time the date picker will update the input is when the user actually selects a date (this will prevent the date picker from formatting a date the user types in).
* weekStartOffset - (*integer*) the offset for the day that weeks begin. The default day that weeks begin is Sunday, but if you wanted to make it, say, Monday, you'd set *weekStartOffset* to 1.
* showMoreThanOne - (*boolean*) if *true* (the default), more than one DatePicker can be visible at a time; otherwise others are hidden when one is shown.

### Events

* onPick - (*function*) callback to execute when the user choose a date
* onShow - (*function*) callback to execute when the calendar appears
* onHide - (*function*) callback to execute when the calendar is hidden

### CSS

* The calendar popup builds a table with all the dates and months and whatnot. It also creates default styles for this table. You can overwrite the default style applied to the calendar by passing in the option to not use the default styles.

### Autoformatting and Date format

* This class will take a user's input of a date value and convert it into a date. If the user inputs 01.02.03, this class will update it on the blur event of the field. The same is true for 01.02.2003, 01/02/03, 01 02 2003, 2003.02.01, and so on. Additional parsers are available with [Date][] and [Date.Extras][]

### Example

	<input type="text" name="date" id="dateInput"/>
	<img src="calendar.gif" id="calendarImg"/>

	new DatePicker('dateInput', {
		additionalShowLinks: ['calendarImg'],
		showOnInputFocus: false
	});

### Note

This class will play nice with [FormValidator][]. If you specify a date format with the validatorProps property of the input, then the format option in [DatePicker][] will be overwritten by that value (so your form validator will get a valid value). If you don't specify a format in the element, then [DatePicker][] will define one using its format option.

	<input id="birthday" name="birthday" validatorProps="{dateFormat: '%x'}"/>
	new DatePicker("birthday", {format: "%db"}); //format will be overwritten to be %x; validatorProps win

	<input id="birthday" name="birthday"/>
	new DatePicker("birthday", {format: "%db"}); //format will be overwritten to be %x; validatorProps win

	//input is now
	//<input id="birthday" name="birthday" validatorProps="{dateFormat: '%db'}"/>
	//DatePicker assigns format, even if FormValidator not in use.

DatePicker Method: updateInput {#DatePicker:updateInput}
--------------------------------------------------------

Updates the input field with the current selected dates.

### Syntax

	myDatePicker.updateInput();

### Returns

* (*object*) This instance of [DatePicker][]

DatePicker Method: validDate {#DatePicker:validDate}
----------------------------------------------------

Parses a string into a Date object and returns it.

### Syntax

	myDatePicker.validDate(val);

### Arguments

1. val - (*mixed*, optional) either a *string* to parse into a date or a *date* object. If no value is specified, the input value will be used instead.

### Accepted formats

* 01.02.03, 01.02.2003, 01/02/03, 01 02 2003, 2003.02.01, and so on.

### Returns

* (*date* or *null*) if the date parses, returns *date*, otherwise *null*

DatePicker Method: formatDate {#DatePicker:formatDate}
------------------------------------------------------

Formats a date object into the output specified in the options for the class instance.

### Syntax

	myDatePicker.formatDate(date);
	
### Arguments

1. date - (*date*) the date to format.

### Returns

* (*string*) The formated result

DatePicker Method: show {#DatePicker:show}
------------------------------------------

Shows the calendar popup. This will reposition the popup and display the date that the user has entered or today's date if they have not entered anything.

### Syntax

	myDatePicker.show();

### Returns

* (*object*) This instance of [DatePicker][]

DatePicker Method: hide {#DatePicker:hide}
------------------------------------------

Hides the calendar popup.

### Syntax

	myDatePicker.hide();

### Returns

* (*object*) This instance of [DatePicker][]

DatePicker Method: hideOthers {#DatePicker:hideOthers}
------------------------------------------

Hides all other the calendar popups that might be visible.

### Syntax

	myDatePicker.hideOthers();

### Returns

* (*object*) This instance of [DatePicker][]

DatePicker Static Method: hideAll {#DatePicker:hideAll}
-------------------------------------------------------

This method on the DatePicker namespace hides all instances of DatePickers.

### Syntax

	DatePicker.hideAll()


[DatePicker]: #DatePicker
[DatePicker.Extras]: /docs/Forms/DatePicker.Extras
[StyleWriter]: /docs/UI/StyleWriter
[Date]: http://www.mootools.net/docs/more/Native/Date
[Date.Extras]: http://www.mootools.net/docs/more/Native/Date.Extras
[StickyWin]: /docs/UI/StickyWin
[StickyWin.UI]: /docs/UI/StickyWin.UI
[StickyWin.Fx]: /docs/UI/StickyWin.Fx
[FormValidator]: http://www.mootools.net/docs/more/Forms/FormValidator
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
[Drag]: http://www.mootools.net/docs/more/Drag/Drag
