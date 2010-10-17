The Clientcide Javascript Repository
------------------------------------

Clientcide's code is released under the Open Source MIT license, which gives you the possibility to use it and modify it in every circumstance. It is built on the [MooTools](http://www.mootools.net) JavaScript framework and has dependencies on [MooTools Core](http://github.com/mootools/mootools-core/tree/master) and [MooTools More](http://github.com/mootools/mootools-more/tree/master).

Links
=====

* [Download Builder](http://www.clientcide.com/js)
* [Docs](http://www.clientcide.com/docs)
* [Tutorials/Examples](http://www.clientcide.com/wiki)
* [Bugs](http://clientcide.lighthouseapp.com)

Changes in 3.0
=======
* The following files are removed entirely:
  * 3rdParty/Lightbox.js
  * 3rdParty/Autocompleter.js
  * 3rdParty/Autocompleter.Remote.js
  * 3rdParty/Autocompleter.Observer.js
  * 3rdParty/Autocompleter.Clientcide.js
  * 3rdParty/Autocompleter.JSONP.js
  * 3rdParty/Autocompleter.Local.js
  * Layout/MenuSlider.js
  * Layout/SimpleCarousel.js
  * Layout/SimpleSlideShow.js
  * Localization/SimpleEditor.Spanish.js
  * Localization/SimpleEditor.Portuguese.js
  * Localization/SimpleEditor.Italian.js
  * Localization/SimpleEditor.French.js
  * Localization/SimpleEditor.English.US.js
  * Localization/SimpleEditor.Dutch.js
  * Forms/DatePicker.js
  * Forms/TagMaker.js
  * Forms/ProductPicker.js
  * Forms/DatePicker.Extras.js
  * Forms/Confirmer.js
  * Forms/Form.Request.Prompt.js
  * Forms/InputFocus.js
  * Forms/SimpleEditor.js
  * Beta/PostEditor.Forum.js
  * Beta/PostEditor.js
  * UI/IconMenu.js
  * UI/ObjectBrowser.js
  * UI/PopupDetails.js
  * Class/Class.ToElement.js
  * Browser/Popup.js
  * Browser/FixPNG.js
* Updated all tests to use the [UI test runner](http://github.com/anutron/mootools-test-runner)
* Updated dependency graph to use new YAML formatted headers and manifest
* Added new method to dbug: dbug.conditional
* dbug now works in chrome
* Various small bug fixes

Changes in 2.2.0
=======
* Modalizer is deprecated in favor of [Mask](http://mootools.net/docs/more/Interface/Mask)
** compat file is just the deprecated library; does not convert to Mask instances but rather just returns Modalizer as it always did
* StickyWin.Modal has new options for Mask; *this is a breaking change*
* Removed Element.Delegation (now in MooTools More; unchanged)
* Deprecated DollarE
* Deprecated DollarG
* Fupdate is now Form.Request in MooTools More; see compat files
** Fupdate.Prompt is now Form.Request.Prompt
** Fupdate.Append.Prompt is now Form.Request.Append.Prompt
** Fupdate.AjaxPrompt is now Form.Request.AjaxPrompt
** Fupdate.Append.AjaxPrompt are now Form.Request.Append.AjaxPrompt
* FormValidator got renamed in MooTools More to Form.Validator (the old name is preserved); updated FormValidator.Tips to Form.Validator.Tips (again, the old name still works).
* Collapsable is now Collapsible (that's correct, I cannot spell). The old name is preserved (though the file name itself changed; update your build scripts).
* HtmlTable moved to MooTools More. No breaking changes, but the -more version has new features.
* Added Italian, Spanish translations for Simple Editor
* New StickyWin features
** Z-index Ordering!
** changing default value for allowMultipleByClass in StickyWin to true
** Added setCaption method to StickyWin.UI
** onUpdate event for StickyWin.Ajax
* added detach method to MooScroller
* dbug should now work in IE8
* offset options are now additive for pointy tip
* numerous bug fixes

Changes in 2.1.0
=======
* MultipleOpenAccordion 
	- now only takes options
	- openAll defaults to false
* CiUI (iPhone code)
	- removed from library; download at [google code](http://code.google.com/p/ciui-dev/)
* Browser.Extras
	- methods now either part of URI class or stand alone string methods
	- Browser.qs deprecated entirely; use *new URI().getData()*
* Class.Binds
	- mutator is now upper case (*Binds* instead of *binds*)
* Class.Refactor
	- no longer an instance method (you can'd to *Foo.refactor({props})* - you must do *Foo = Class.refactor(Foo, props)*)
* Element.Forms
	- deprecated Element property *inputValue*; too confusing!
* Element.Position
	- *Element.setPosition* is now *Element.position* and vice versa. I.e. *Element.position* (which in MooTools 1.2.1 took an object with x/y coords for top/left) is now *Element.setPosition*. *Element.setPosition* (which in the previous Clientcide libs took options for relative positioning) is now *Element.position*.
* Element.Shortcuts
	- *Element.isVisible* is *Element.isDisplayed*
* IframeShim
 	- options:zindex renamed to zIndex
* OverText
	- no longer takes a collection of inputs.
	- .*showTxt* > .*show*, .*hideTxt* > .*hide*
	- .*hide* and .*show* no longer take the element and 'focus' arguments.
	- .*repositionAll* is gone; .*repositionOverTxt* is now just .*reposition*; it does not take an argument
* String.Extras
	- findAllEmails gone, too specific
* Date
	- deprecated String.zeroise
* JsonP
	- renamed to Request.JSONP
	- constructor/send/prepareUrl take options hash, no longer an url directly (like Request)
	- user can change options on the fly when calling send() with a new hash, reusing the object
	- added check method. support for link: ignore, cancel, chain (like Request)
	- added success, request and cancel events
	- data can be a hash or string now (like Request)
	- queryString option gone
	- makeUrl logic now moved to new getScript(), which directly returns the script
	- changed how it essentially works. instead of storing the object reference, we store a new function every time a request is made, that keeps a reference of the script element and the object instance.
	- abortAfter and timeout gone. there's now a single timeout for retries and for when retries run out.
	- globalFunction gone, deemed useless
* Request.Queue
	- event names all renamed; *onRequestStart* >> *onRequest*, *onRequestSuccess* >> *onSuccess*, etc
* StickyWin
	- *StickyWin.Fx* is now just *StickyWin*.
* MultipleOpenAccordion
	- Now only takes an options argument; container argument is deprecated.
	
Breaking Changes in MooTools More 1.2.2.1
=====================================
* FormValidator
	- The base *FormValidator* class no longer injects advice into the document. You must use *FormValidator.Inline* for this behavior.
* Class.refactor
	- this.parent is no longer useful; you must use this.previous
* String.cleanQueryString
	- if you specify a custom message its arguments are now *key, value* (before it was *set* where *set* was "key=value").