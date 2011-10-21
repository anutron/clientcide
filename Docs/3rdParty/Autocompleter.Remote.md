Script Autocompleter.Remote {#Autocompleter:Remote}
================================================

Contains the classes for the Remote methods for [Autocompleter][].

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]: http://www.clientcide.com/wiki/cnet-libraries/11-3rdparty/03-autocompleter.remote

Class Autocompleter.Ajax.Base {#Autocompleter-Ajax:Base}
========================================================

The base functionality for all Autocompleter.Ajax functionality.

### Extends

* [Autocompleter.Base][]

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference of the form input to autocomplete.
2. url - (*string*) the url to query for values based on user input.
3. options - (*object*) key/value set of options.

### Options

* postVar - (*string*) the post variable name for the query string; defaults to *'value'*. This is the key for the user's input value (i.e. if the user is typing in "cookies" but has only typed in "coo" so far, the url in the arguments will be requested with *value=coo* if postVar is set to 'value').
* postData - (*object*) additional request data merged into the request.
* ajaxOptions - (*object*) options for the Request instance.

### Events

* onRequest - (*function*) Callback executed when the request is initiated; passed four arguments: the input that the autocompleter is attached to, the instance of [Request][], the data sent for the query, and the value that the user has thus-far entered.
* onComplete - (*function*) Callback executed when the request is completed; passed four arguments: the input that the autocompleter is attached to, the instance of [Request][], the data sent for the query, and the response from the server.

### Notes

The Autocompleter.Ajax.Base class is not used directly but by its inheritors (see
[Autocompleter.Ajax.Json][] and [Autocompleter.Ajax.Xhtml][]).

Class: Autocompleter.Ajax.Json {#Autocompleter-Ajax:Json}
---------------------------------------------------------
Extends [Autocompleter.Ajax.Base][] to include Json support.

### Extends

* [Autocompleter.Ajax.Base][]

### Syntax

	new Autocompleter.Ajax.Json(input, url, options);

### Arguments

All those specified in [Autocompleter.Ajax.Base][] and [Autocompleter.Base][].

### Example

	new Autocompleter.Ajax.Json($('ajaxJson'), 'server/auto.php', {
		postVar: 'query'
	});

Class: Autocompleter.Ajax.Xhtml {#Autocompleter-Ajax:Xhtml}
-----------------------------------------------------------

Extends [Autocompleter.Ajax.Base][] to include Xhtml support.

### Extends

* [Autocompleter.Ajax.Base][]

### Syntax

	new Autocompleter.Ajax.Xhtml(input, url, options);

### Arguments

All those specified in [Autocompleter.Ajax.Base][] and [Autocompleter.Base][].

### Example:

	new Autocompleter.Ajax.Xhtml($('ajaxXhtml'), 'server/auto.php', {
		postData: {html: 1}, //some data to go along with the request
		//handle the data returned
		injectChoice: function(el) {
			var value = el.getFirst().get('html');
			el.inputValue = value;
			this.addChoiceEvents(el).getFirst().set('html', this.markQueryValue(value));
		}
	});

[Autocompleter.Ajax.Base]: #Autocompleter-Ajax:Base
[Autocompleter.Ajax.Json]: #Autocompleter-Ajax:Json
[Autocompleter.Ajax.Xhtml]: #Autocompleter-Ajax:Xhtml
[Autocompleter.Base]: http://clientcide.com/docs/3rdParty/Autocompleter#Autocompleter:Base
[Autocompleter]: http://clientcide.com/docs/3rdParty/Autocompleter
[Request]: http://www.mootools.net/Request/Request
