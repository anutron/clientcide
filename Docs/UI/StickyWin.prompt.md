Function: StickyWin.prompt {#StickyWin:prompt}
==================================

Makes a little prompt box with an input as well as ok close buttons.

### Syntax

	StickyWin.prompt(messageHeader, message, callback, options);

### Arguments

1. messageHeader - (*string*) the caption for the window.
2. message - (*string*) the question the user is going to click "ok" or "cancel" to.
3. callback - (*function*) function invoked if the user clicks "ok".
4. options - (*object*) an object with key/value options.

### Options

* options passed along to [StickyWin.Modal][] (see its options for details), as well as:
* defaultValue - (*string*) the default value displayed in the input of the prompt

### Example

	StickyWin.prompt("Move This Item", "Enter a new location for this item:", function(value){
		filesystem.mv(oldpath, value);
	}, {
		defaultValue: oldpath
	});

### Returns

* (*object*) an instance of [StickyWin][]

[StickyWin.Modal]: /docs/UI/StickyWin.Modal
