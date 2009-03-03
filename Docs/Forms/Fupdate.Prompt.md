Class: Fupdate.Prompt {#Fupdate-Prompt}
=======================================
Prompts the user with the contents of a form and updates a DOM element with the result of the submission.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:

### Extends

- [Fupdate][]

Fupdate.Prompt Method: constructor {#Fupdate-Prompt:constructor}
----------------------------------------------------------------

### Syntax

	new Fupdate.Prompt(form, update[, options]);

### Arguments

1. form - (*mixed*) A form Element or the string id of a form Element or the HTML (a *string*) of a form Element used to manage submissions. This form will be injected into a [StickyWin][] specified in the options and optionally wrapped with [StickyWin.ui].
2. update - (*mixed*) An Element or the string id of an Element to update with the response.
3. options - (*object*, optional) The options object described below:

### Options

* The same as [Fupdate][] in addition to:
* stickyWinToUse - (*class*) Which [StickyWin][] to use, defaults to [StickyWin.Fx.Modal][].
* stickyWinOptions - (*object*) Options to pass along to the specified [StickyWin][].
* useUi - (*boolean*) If *true* (the default), the form will be wrapped in [StickyWin.ui][].
* stickyWinUiOptions - (*object*) Options passed along to [StickyWin.ui][]; defaults to *{ width: 500}*.
* useWaiter - (*boolean*) If *true* (the default) the form (in the popup) will have a [Waiter][] on it while it is being submitted.

### Example

	new Fupdate($('myForm'), $('info'));

Fupdate.Prompt Method: prompt {#Fupdate-Prompt:prompt}
------------------------------------------------------

Displays the popup with the form to the user.

### Syntax

	myFupdate.prompt();

### Returns

* (*object*) This instance of [Fupdate.Prompt][]

Fupdate.Prompt Method: hide {#Fupdate-Prompt:hide}
------------------------------------------------------

Hides the popup from to the user.

### Syntax

	myFupdate.hide();

### Returns

* (*object*) This instance of [Fupdate.Prompt][]

Class: Fupdate.AjaxPrompt {#Fupdate-AjaxPrompt}
=================================================

The same as [Fupdate.Prompt][] except the form is fetched from the specified url.

### Extends

- [Fupdate.Prompt][]

Fupdate.AjaxPrompt Method: constructor {#Fupdate-AjaxPrompt:constructor}
--------------------------------------------------------------------------

### Syntax

	new Fupdate.AjaxPrompt(formUrl, update[, options]);

### Arguments

1. formUrl - (*string*) The url to use to retrieve the HTML for the form for the prompt.
2. update - (*mixed*) An Element or the string id of an Element to update with the response.
3. options - (*object*, optional) The options object described below:

### Options

* The same as [Fupdate][]
* Note: the default for the *stickyWinToUse* for this class is [StickyWin.Fx.Modal.Ajax][]



Class: Fupdate.Append.Prompt {#Fupdate-Append-Prompt}
=====================================================

Extends [Fupdate.Append][] to use a prompt popup.

Fupdate.Append.Prompt Method: constructor {#Fupdate-Append-Prompt:constructor}
------------------------------------------------------------------------------

### Syntax

	new Fupdate.Append.Prompt(form, update[,options]);

### Arguments

* The same as [Fupdate.Append][] and [Fupdate.Prompt][] combined

### Options

* The same as [Fupdate.Append][] and [Fupdate.Prompt][] combined

Class: Fupdate.Append.AjaxPrompt {#Fupdate-Append-AjaxPrompt}
=============================================================

Extends [Fupdate.Append][] to use a prompt popup, fetching the prompt form from the specified url.

Fupdate.Append.AjaxPrompt Method: constructor {#Fupdate-Append-AjaxPrompt:constructor}
--------------------------------------------------------------------------------------

### Syntax

	new Fupdate.Append.AjaxPrompt(formUrl, update[,options]);

### Arguments

* The same as [Fupdate.Append][] and [Fupdate.AjaxPrompt][] combined

### Options

* The same as [Fupdate.Append][] and [Fupdate.AjaxPrompt][] combined

[Fupdate.Append]: /docs/Forms/Fupdate.Append
[Fupdate.AjaxPrompt]: #Fupdate-AjaxPrompt
[StickyWin]: /docs/UI/StickyWin
[StickyWin.Fx.Modal]: /docs/UI/StickyWin.Fx.Modal
[StickyWin.ui]: /docs/UI/StickyWin.ui
[StickyWin.Fx.Modal.Ajax]: /docs/UI/StickyWin.Fx.Modal.Ajax
[Waiter]: /docs/UI/Waiter
[Fupdate]: /docs/Forms/Fupdate