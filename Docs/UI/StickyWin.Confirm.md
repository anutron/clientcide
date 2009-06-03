Class: StickyWin.Confirm {#StickyWin.Alert}
======================

The StickyWin.Confirm class generates a [StickyWin.Alert][] a 'cancel' button and an 'ok' button. It is not really intended to be used directly. The [StickyWin.confirm][] method (below) is a wrapper for this class that generates an output outlined in the documentation below. This class (StickyWin.Confirm) is used mostly to provide access for subclassing.

Class: StickyWin.Confirm {#StickyWin:Confirm}
==================================

Makes a little confirmation box with ok close buttons.

### Syntax

	StickyWin.confirm(messageHeader, message[, options]);

### Arguments

1. messageHeader - (*string*) the caption for the window.
2. message - (*string*) the question the user is going to click "ok" or "cancel" to answer.
3. callback - (*function*) function invoked if the user clicks "ok".
4. options - (*object*) options passed along to [StickyWin.Alert][] (see its options for details).

### Events

* onConfirm - (*function*) callback executed when the user clicks "ok" (instead of "cancel")

### Example

	new StickyWin.Confirm("Confirm Deletion", "Are you sure you want to delete the file system?", {
		onConfirm: function(){
			filesystem.rm-r('/');
		}
	});

Function: StickyWin.confirm {#StickyWin:confirm}
==================================

This is the intended use for this functionality

### Syntax

	StickyWin.confirm(messageHeader, message, callback, options);

### Arguments

1. messageHeader - (*string*) the caption for the window.
2. message - (*string*) the question the user is going to click "ok" or "cancel" to answer.
3. callback - (*function*) function invoked if the user clicks "ok".
4. options - (*object*) options passed along to [StickyWin.Confirm][] (see its options for details).

### Example

	StickyWin.confirm("Confirm Deletion", "Are you sure you want to delete the file system?", function(){
		filesystem.rm-r('/');
	});

### Returns

* (*object*) an instance of [StickyWin.Confirm][]

[StickyWin.Alert]: #StickyWin.Alert
[StickyWin.Confirm]: #StickyWin.Confirm
[StickyWin.confirm]: #StickyWin.confirm
