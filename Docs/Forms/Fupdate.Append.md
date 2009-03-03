Class: Fupdate.Append {#Fupdate-Append}
=======================================
Updates a DOM element with the response from the submission of a form (via Ajax). The result is appended to the DOM element instead of replacing its contents.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/05.2-fupdate.append

### Extends

- [Fupdate][]

Fupdate.Append Method: constructor {#Fupdate-Append:constructor}
--------------------------------------------------

### Syntax

	new Fupdate.Append(form, update[, options]);

### Arguments

* The same as [Fupdate][]

### Options

* The same as [Fupdate][] in addition to:
* useReveal - (*boolean*) Use [Fx.Reveal][] to transition the result in to the appended DOM element; defaults to *true*.
* revealOptions - (*object*) Options passed along to [Fx.Reveal][].
* inject - (*string*) The injection location for the returned content (see [Element.inject][]); defaults to 'bottom'.


### Events

* onBeforeEffect - callback executed before the new element begins it's reveal; passed as arguments the container that is revealing
* onSuccess - callback executed after the new element is visible. Passed container of the new content, the container into which it is injected, and (passed along from Request.HTML's onSuccess method) the response tree, the response elements, the response html, and the response javascript

[Fupdate]: /docs/Forms/Fupdate
[Fx.Reveal]: /docs/Fx/Fx.Reveal
[Element.inject]: http://docs.mootools.net/Element/Element#Element:inject