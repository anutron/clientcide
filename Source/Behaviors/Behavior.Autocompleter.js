/*
---
name: Behavior.Autocompleter
description: Adds support for Autocompletion on form inputs.
provides: [Behavior.Autocomplete, Behavior.Autocompleter]
requires: [Behavior/Behavior, /Autocompleter.Local, /Autocompleter.Remote, More/Object.Extras]
script: Behavior.Autocomplete.js

...
*/

Behavior.addGlobalFilters({

	/*
		takes elements (inputs) with the data filter "Autocomplete" and creates a autocompletion ui for them
		that either completes against a list of terms supplied as a property of the element (dtaa-autocomplete-tokens)
		or fetches them from a server. In both cases, the tokens must be an array of values. Example:

		<input data-behavior="Autocomplete" data-autocomplete-tokens="['foo', 'bar', 'baz']"/>

		Alternately, you can specify a url to submit the current typed token to get back a list of valid values in the
		same format (i.e. a JSON response; an array of strings). Example:

		<input data-behavior="Autocomplete" data-autocomplete-url="/some/API/for/autocomplete"/>

		When the values ar fetched from the server, the server is sent the current term (what the user is typing) as
		a post variable "term" as well as the entire contents of the input as "value".

		An additional data property for autocomplete-options can be specified; this must be a JSON encoded string
		of key/value pairs that configure the Autocompleter instance (see documentation for the Autocompleter classes
		online at http://www.clientcide.com/docs/3rdParty/Autocompleter but also available as a markdown file in the
		clientcide repo fetched by hue in the thirdparty directory).

		Note that this JSON string can't include functions as callbacks; if you require amore advanced usage you should
		write your own Behavior filter or filter plugin.

	*/

	Autocomplete: {
		defaults: {
			minLength: 1,
			selectMode: 'type-ahead',
			overflow: true,
			selectFirst: true,
			multiple: true,
			separator: ' ',
			allowDupes: true,
			postVar: 'term'
		},
		setup: function(element, api){
			var options = Object.cleanValues(
				api.getAs({
					minLength: Number,
					selectMode: String,
					overflow: Boolean,
					selectFirst: Boolean,
					multiple: Boolean,
					separator: String,
					allowDupes: Boolean,
					postVar: String
				})
			);

			if (element.getData('autocomplete-url')) {
				var aaj = new Autocompleter.Ajax.Json(element, element.getData('autocomplete-url'), options);
				aaj.addEvent('request', function(el, req, data, value){
					data['value'] = el.get('value');
				});
				return aaj;
			} else {
				var tokens = api.getAs(Array, 'tokens');
				if (!tokens) {
					dbug.warn('Could not set up autocompleter; no local tokens found.');
					return;
				}
				return new Autocompleter.Local(element, tokens, options);
			}
		}
	}

});
