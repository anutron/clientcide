Script: Autocompleter {#Autocompleter}
=====================================

This class is extended by the other Autocomplete classes to add autocomplete functionality to text inputs.

* license - MIT-style license
* author & copyright	- Harald Kirschner mail[at]digitarald[dot]de
* homepage - http://digitarald.de/project/autocompleter/

These scripts are presented here for use with the Clientcide Libraries unaltered save for the fact that they have been split up from just *Autocompleter.js* into sub-files for *Autocompleter.Local.js*, and *Autocompleter.Remote.js*. They are amended with *Autocompleter.Clientcide.js* and *Autocompleter.JSONP.js*.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]: http://www.clientcide.com/wiki/cnet-libraries/11-3rdparty/00-autocompleter

### Notes

The *Observer* class that this distribution ships with has been replaced with [IframeShim][], and the Element method [Element:getOffsetParent][] is now part of [Element.Position][].

Class: Autocompleter.base {#Autocompleter-base}
==============================================

This base class is extended by the the other Autocomplete classes. It accepts the following options, which are shared by all the other classes.

### Implements

* [Options][], [Events][]

### Options

* minLength - (*integer*) the minimum length of the string the user must enter before the suggestions are displayed; defaults to *1*
* markQuery - (*boolean*) whether or not to wrap the portion of each suggestion that matches the user entry with a span tag (which gets the css class *autocompleter-queried*); defaults to *true*
* width - (*mixed*) either the *string* *'inherit'*, which specifies that the suggestions dropdown should be as wide as the input, or an *integer* for the desired width in pixels; defaults to *'inherit'*
* maxChoices - (*integer*) the maximum number of suggestion items to display; defaults to *10*
* injectChoice - (*function*) the function that creates each suggestion item in the suggestions dropdown. The default is a function that injects an *li* element into the suggestion dropdown. This method is passed a *token*, which is one of the suggested values (which may or may not be a string, depending on what your server returns). Note that the element created by this function **must** have an attribute called *'inputValue'* that returns the value to be inserted into the input when a suggestion item is selected.
* customChoices - (*element*) an element container for the suggestion items; by default a *ul* is created on the fly, but you may specify a different container into which suggestion items will be injected.
* className - (*string*) the class name to apply to the suggestion container; defaults to *'autocompleter-choices'*
* zIndex - (*integer*) the z-index of the suggestion dropdown; defaults to *42*
* delay - (*integer*) the period (in milliseconds) to wait befor the suggestion dropdown is displayed or its items updated after typing in the input; defaults to *400*
* observerOptions - (*object*) options passed on to the [Observer][] class
* fxOptions - (*object* or *null*) options passed to the effect ([Fx.Tween][]) instance that fades the suggestions dropdown in/out; specifying *null* will mean no effect is used; defaults to *{}* (empty object)
* autoSubmit - (*boolean*) whether to submit the form when the user chooses a suggestion item by hitting *enter*; defaults to *false*
* overflow - (*boolean*) If set to *true*, the *maxChoices* option is ignored and all the available suggestion items are displayed; defaults to *false*
* overflowMargin - (*integer*) if overflow is *true* and the user moves their selection (using the cursor keys) to an item that is outside the viewable list, this option specifies how far to jump down the suggestions dropdown to show more suggestion items; defaults to *25*
* selectFirst - (*boolean*) whether to automatically select the first suggestion item even if it doesn't completely match the user entry. For instance: if the user types "aj" and the first suggestion is "ajax", a *true* setting for this option would select that first entry even though it doesn't completely match the user's entry; defaults to *false*
* filter - (*function*) if defined it will replace the default filter that is applied to the values returned as suggestion items. By default this method constructs a regular expression based on the following *filterCase* and *filterSubset* options.
* filterCase - (*boolean*) if *filter* is not defined (and therefore the filter used is the default one) this setting will, if *true*, filter results using a case sensitive regex; defaults to *false*
* filterSubset - (*boolean*) if *filter* is not defined (and therefore the filter used is the default one) this setting will, if *true*, allow for matches anywhere in the suggestion, otherwise the user entry must match the beginning of the suggestion; defaults to *false*
* forceSelect - (*boolean*) whether to hide the suggestion dropdown **only** if the user selects a suggestion item or enters a value that is an exact match from the suggestion items; defaults to *false*
* selectMode - (*string*) Three options:
	* *true* or *selection* - the user can type without the input value being highlighted or altered in any way. If they want to use a suggestion item, they must select it. Using the cursor keys the user can highlight a potential suggestion item and the input will be filled with the highlighted suggestion, while the portion of the suggestion that the user did not type will be selected so that they can continue typing if they wish. *This is the default.*
	* *type-ahead* - as the user types the first suggestion item is selected and the 'missing' copy (the portion of the text the user has not yet typed) is selected. The user can use their cursor to move right and accept the suggestion or continue typing to refine the suggestion items.
	* *pick* - the user can type without the input value being highlighted or altered in any way. If they want to use a suggestion item, they must select it using the cursor keys to move up and down the suggestion items which will change the input value appropriately. However, in this case the portion of the input value they did not type is **not** selected.
* choicesMatch - (*string*) if defined, this string will be used to select for the choice element objects; defaults to *null*, which does not apply a filter.
* multiple - (*boolean*) whether to split the user entered text into multiple values; defaults to *false*; the following two options affect the behavior of the split.
* separator - (*string*) if *multiple* is *true*, this is the delemiter that will be used to seperate values; defaults to *', '* (comma space)
* separatorSplit - (*RegExp*) if *multiple* is *true*, this regular expression will split the value into multiple values
* autoTrim - (*boolean*) whether to remove leading and trailing spaces from the user entered text when the input loses or gains focus; defaults to *true*; (if *multiple* is *true*, empty values are also removed; i.e. *"blah, , foo , bar"* is cleaned up to *"blah, foo, bar"*)
* allowDupes - (*boolean*) whether to allow duplicate suggestion items; defaults to *false*
* cache - (*boolean*) do not recompute (or re-fetch) suggestions for a value that was previously typed; defaults to *true*
* relative - (*boolean*) if *true*, the suggestions dropdown element is injected immediately after the input. This allows the parent of the input to move and have the suggestions dropdown move with it; defaults to *false*

### Events

*	onSelect - (*function*) This event is fired when the user moves the selection with the cursor keys or their mouse across a suggestion, highlighting it. The event is passed three arguments: the input that the autocompleter is attached to, the suggestion that is highlighted, and a boolean that denotes whether or not the input value should be updated with the highlighted suggestion.
*	onSelection - (*function*) This event is fired when the input is updated with a suggestion value. It is passed four arguments: the input that the autocompleter is attached to, the selection that is highlighted/selected, the current value of the input, and the value of the selected suggestion.
*	onShow - (*function*) This event is fired when the suggestions are displayed (with each key stroke). It is passed two arguments: the input that the autocompleter is attached to and the container of all the suggestions.
*	onHide - (*function*) This event is fired when the suggestions are hidden; it is passed the same two arguments as *onShow*.
*	onBlur - (*function*) This event is fired when the input's blur event occurs; passed one argument: the input that the autocompleter is attached to.
*	onFocus - (*function*) This event is fired when the input's focus event occurs; passed one argument: the input that the autocompleter is attached to.
*	onChoiceConfirm - (*function*) This event is fired when the user confirms the selection either by pressing 'Enter' or by clicking on a suggestion; passed one argument: the selection that is confirmed.

Autocompleter Method: destroy {#Autocompleter:destroy}
------------------------------------------------------

This method removes the instance.

### Syntax

	myAutocompleter.destroy();

[IframeShim]: http://clientcide.com/docs/Browser/IframeShim
[Element:getOffsetParent]: http://www.mootools.net/docs/more/Element/Element.Position#Element:getOffsetParent
[Element.Position]: http://www.mootools.net/docs/more/docs/Element/Element.Position
[Observer]: http://clientcide.com/docs/3rdParty/Autocompleter.Observer
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
[Fx.Tween]: http://www.mootools.net/docs/core/Fx/Fx.Tween
