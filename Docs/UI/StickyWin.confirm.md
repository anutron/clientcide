Function: StickyWin.confirm {#StickyWin:confirm}
==================================

Makes a little confirmation box with ok close buttons.

### Syntax

	StickyWin.confirm(messageHeader, message, callback, options);

### Arguments

1. messageHeader - (*string*) the caption for the window.
2. message - (*string*) the question the user is going to click "ok" or "cancel" to.
3. callback - (*function*) function invoked if the user clicks "ok".
4. options - (*object*) options passed along to [StickyWin.Modal][] (see its options for details).

### Example

	StickyWin.alert("Confirm Deletion", "Are you sure you want to delete the file system?", function(){
		filesystem.rm-r('/');
	});

### Returns

* (*object*) an instance of [StickyWin.Modal][]

[StickyWin.Modal]: /docs/UI/StickyWin.Modal
