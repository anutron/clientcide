Class: StickyWin.Prompt {#StickyWin:Prompt}
==================================

The StickyWin.Prompt class generates a [StickyWin.Confirm][] a 'cancel' button and an 'ok' button as well as an input that the user can fill in. It is not really intended to be used directly. The [StickyWin.prompt][] method (below) is a wrapper for this class that generates an output outlined in the documentation below. This class (StickyWin.Prompt) is used mostly to provide access for subclassing.

### Syntax

	new StickyWin.Prompt(messageHeader, message[, options]);

### Arguments

1. messageHeader - (*string*) the caption for the window.
2. message - (*string*) the question the user is going to click "ok" or "cancel" to.
4. options - (*object*) an object with key/value options.

### Options

* options passed along to [StickyWin.Confirm][] (see its options for details), as well as:
* defaultValue - (*string*) the default value displayed in the input of the prompt

### Events

* onConfirm - (*function*) callback executed when the user clicks "ok" (instead of "cancel"); passed the value of the input in the prompt.

### Example

	new StickyWin.Prompt("Move This Item", "Enter a new location for this item:", {
		onConfirm: function(value){
			filesystem.mv(oldpath, value);
		},
		defaultValue: oldpath
	});

Function: StickyWin.prompt {#StickyWin:prompt}
==================================

This is the intended use for this functionality.

### Syntax

	StickyWin.prompt(messageHeader, message, callback, options);

### Arguments

1. messageHeader - (*string*) the caption for the window.
2. message - (*string*) the question the user is going to click "ok" or "cancel" to.
3. callback - (*function*) function invoked if the user clicks "ok".
4. options - (*object*) an object with key/value options.

### Options

* options passed along to [StickyWin.Prompt][] (see its options for details)

### Example

	StickyWin.prompt("Move This Item", "Enter a new location for this item:", function(value){
		filesystem.mv(oldpath, value);
	}, {
		defaultValue: oldpath
	});

### Returns

* (*object*) an instance of [StickyWin.Prompt][]

[StickyWin.Alert]: #StickyWin.Alert
[StickyWin.Confirm]: #StickyWin.Confirm
[StickyWin.Prompt]: #StickyWin.Prompt
[StickyWin.prompt]: #StickyWin.prompt