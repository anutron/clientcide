Class: Form.Validator.Tips {#Form-Validator-Tips}
===============================================

Extends the [Form.Validator][] class to use [StickyWin.PointyTip][] to display validation errors in a tip overlay that points at the input.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/04.5-formvalidator.tips

### Extends

* [Form.Validator][]

### Syntax

	new Form.Validator.Tips(form[, options]);

### Arguments

1. form - (*mixed*) A string of the id for an Element or an Element reference of the form to evaluate
2. options - (*object*) a key/value set of options

### Options

* The same options as [Form.Validator][] in addition to:
* pointyTipOptions - (*object*) Options object passed along to [StickyWin.PointyTip][] for each validation popup
* tipCaption - (*mixed*) A string, DOM id, or DOM element to be used for the caption for each popup tip (not required).

### Best Practices

* Because the tips show up in ways that can obscure elements of the form and each other (all along one side, or always above or below the input), it's best that the *serial* option remain at the default (*true*).

[Form.Validator]: http://mootools.net/docs/more/Forms/Form.Validator
[StickyWin.PointyTip]: http://clientcide.com/docs/UI/StickyWin.PointyTip