Class: StickyWin.Alert {#StickyWin.Alert}
======================

The StickyWin.Alert class generates a [StickyWin.Modal][] with a little alert box with a close button. It is not really intended to be used directly. The [StickyWin.alert][] method (below) is a wrapper for this class that generates an output outlined in the documentation below. This class (StickyWin.Alert) is used mostly to provide access for subclassing (see [StickyWin.Error][], [StickyWin.Confirm][] and [StickyWin.Prompt][]).

### Syntax

	new StickyWin.Alert(caption, message[, options]);

### Arguments

1. messageHeader - (*string*) the caption for the window
2. message - (*string*) the error message
3. options - (*object*) a key/value set of options

### Options

* All of [StickyWin.Modal][]'s options, and:
* uiOptions - (*object*) options passed to [StickyWin.UI][].

### Example

	new StickyWin.Alert("Woops!", "Oh nos! I've got five Internets open!", {
		uiOptions: {
			width: 500
		}
	});

Function: StickyWin.alert {#StickyWin:alert}
==================================

This is the intended use for this functionality.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/09-stickywin.alert

### Syntax

	StickyWin.alert(messageHeader, message[, options]);

### Arguments

1. messageHeader - (*string*) the caption for the window
2. message - (*string*) the error message
3. options - (*object*) a key/value set of options (see the options for [StickyWin.Alert][] above)

### Example

	StickyWin.alert("Woops!", "Oh nos! I've got five Internets open!");

### Returns

* (*object*) an instance of [StickyWin.Alert][]

Class: StickyWin.Error {#StickyWin.Error}
======================

Displays an alert with a little error image in it. Again, not intended for use but is here for subclassing. See [StickyWin.error][] below.

### Syntax

	new StickyWin.Error("Panic!", "Something has gone horribly, horribly wrong.", {
		baseHref: 'my/path/to/the/icon/'
	});

### Arguments

1. messageHeader - (*string*) the caption for the window
2. message - (*string*) the error message
3. options - (*object*) a key/value set of options

### Options

* All of the options for [StickyWin.Alert][] and:
* baseHref - (*string*) the location of the *icon_problems_sm.gif* file; defaults to cnet's domain.

### Example

	new StickyWin.error("Panic!", "Something has gone horribly, horribly wrong.");

Function: StickyWin.error {#StickyWin:error}
==================================

This is the intended use for this functionality.

### Syntax

	StickyWin.error(messageHeader, message[, options]);

### Arguments

1. messageHeader - (*string*) the caption for the window
2. message - (*string*) the error message
3. options - (*object*) a key/value set of options (see the options for [StickyWin.Error][] above)

### Example

	StickyWin.error("Panic!", "Something has gone horribly, horribly wrong.");

### Returns

* (*object*) an instance of [StickyWin.Error][]

[StickyWin.alert]: #StickyWin.alert
[StickyWin.Alert]: #StickyWin.Alert
[StickyWin.Modal]: /docs/UI/StickyWin.Modal
[StickyWin.UI]: /docs/UI/StickyWin.UI
[StickyWin.Confirm]: /docs/UI/STickyWin.Confirm
[StickyWin.Prompt]: /docs/UI/STickyWin.Prompt
[StickyWin.Error]: /docs/UI/STickyWin.Error