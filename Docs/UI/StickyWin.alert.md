Function: StickyWin.alert {#StickyWin:alert}
==================================

Makes a little alert box with a close button.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/09-stickywin.alert

### Syntax

	StickyWin.alert(messageHeader, message[, baseHref]);

### Arguments

1. messageHeader - (*string*) the caption for the window
2. message - (*string*) the error message
3. baseHref - (*string*) the location of the *icon_problems_sm.gif* file; defaults to cnet's domain.

### Example

	StickyWin.alert("Woops!", "Oh nos! I've got five Internets open!");

### Returns

* (*object*) an instance of [StickyWin.Modal][]

[StickyWin.Modal]: /docs/UI/StickyWin.Modal
