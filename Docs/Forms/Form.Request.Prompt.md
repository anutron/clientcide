Class: Form.Request.Prompt {#Form-Request-Prompt}
=======================================
Prompts the user with the contents of a form and updates a DOM element with the result of the submission.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:

### Extends

- [Form.Request][]

Form.Request.Prompt Method: constructor {#Form-Request-Prompt:constructor}
----------------------------------------------------------------

### Syntax

	new Form.Request.Prompt(form, update[, options]);

### Arguments

1. form - (*mixed*) A form Element or the string id of a form Element or the HTML (a *string*) of a form Element used to manage submissions. This form will be injected into a [StickyWin][] specified in the options and optionally wrapped with [StickyWin.UI].
2. update - (*mixed*) An Element or the string id of an Element to update with the response.
3. options - (*object*, optional) The options object described below:

### Options

* The same as [Form.Request][] in addition to:
* stickyWinToUse - (*class*) Which [StickyWin][] to use, defaults to [StickyWin.Modal][].
* stickyWinOptions - (*object*) Options to pass along to the specified [StickyWin][].
* useUi - (*boolean*) If *true* (the default), the form will be wrapped in [StickyWin.ui][].
* stickyWinUiOptions - (*object*) Options passed along to [StickyWin.ui][]; defaults to *{ width: 500}*.
* useWaiter - (*boolean*) If *true* (the default) the form (in the popup) will have a [Waiter][] on it while it is being submitted.

### Example

	new Form.Request($('myForm'), $('info'));

Form.Request.Prompt Method: prompt {#Form-Request-Prompt:prompt}
------------------------------------------------------

Displays the popup with the form to the user.

### Syntax

	myFormRequest.prompt();

### Returns

* (*object*) This instance of [Form.Request.Prompt][]

Form.Request.Prompt Method: hide {#Form-Request-Prompt:hide}
------------------------------------------------------

Hides the popup from to the user.

### Syntax

	myFormRequest.hide();

### Returns

* (*object*) This instance of [Form.Request.Prompt][]

Class: Form.Request.AjaxPrompt {#Form-Request-AjaxPrompt}
=================================================

The same as [Form.Request.Prompt][] except the form is fetched from the specified url.

### Extends

- [Form.Request.Prompt][]

Form.Request.AjaxPrompt Method: constructor {#Form-Request-AjaxPrompt:constructor}
--------------------------------------------------------------------------

### Syntax

	new Form.Request.AjaxPrompt(formUrl, update[, options]);

### Arguments

1. formUrl - (*string*) The url to use to retrieve the HTML for the form for the prompt.
2. update - (*mixed*) An Element or the string id of an Element to update with the response.
3. options - (*object*, optional) The options object described below:

### Options

* The same as [Form.Request][]
* Note: the default for the *stickyWinToUse* for this class is [StickyWin.Modal.Ajax][]



Class: Form.Request.Append.Prompt {#Form-Request-Append-Prompt}
=====================================================

Extends [Form.Request.Append][] to use a prompt popup.

Form.Request.Append.Prompt Method: constructor {#Form-Request-Append-Prompt:constructor}
------------------------------------------------------------------------------

### Syntax

	new Form.Request.Append.Prompt(form, update[,options]);

### Arguments

* The same as [Form.Request.Append][] and [Form.Request.Prompt][] combined

### Options

* The same as [Form.Request.Append][] and [Form.Request.Prompt][] combined

Class: Form.Request.Append.AjaxPrompt {#Form-Request-Append-AjaxPrompt}
=============================================================

Extends [Form.Request.Append][] to use a prompt popup, fetching the prompt form from the specified url.

Form.Request.Append.AjaxPrompt Method: constructor {#Form-Request-Append-AjaxPrompt:constructor}
--------------------------------------------------------------------------------------

### Syntax

	new Form.Request.Append.AjaxPrompt(formUrl, update[,options]);

### Arguments

* The same as [Form.Request.Append][] and [Form.Request.AjaxPrompt][] combined

### Options

* The same as [Form.Request.Append][] and [Form.Request.AjaxPrompt][] combined

[Form.Request.Append]: http://clientcide.com/docs/Forms/Form.Request.Append
[Form.Request.AjaxPrompt]: #Form.Request-AjaxPrompt
[StickyWin]: http://clientcide.com/docs/UI/StickyWin
[StickyWin.Modal]: http://clientcide.com/docs/UI/StickyWin.Modal
[StickyWin.UI]: http://clientcide.com/docs/UI/StickyWin.UI
[StickyWin.Modal.Ajax]: http://clientcide.com/docs/UI/StickyWin.Modal.Ajax
[Waiter]: http://clientcide.com/docs/UI/Waiter
[Form.Request]: http://mootools.net/docs/more/Forms/Form.Request