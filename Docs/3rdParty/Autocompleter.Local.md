Class Autocompleter.Local {#Autocompleter:Local}
================================================

Extends the [Autocompleter.Base][] class to add support for a pre-defined object.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]: http://www.clientcide.com/wiki/cnet-libraries/11-3rdparty/02-autocompleter.local

### Syntax

	new Autocompleter.Local(input, tokens, options);

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference of the form input to autocomplete.
2. tokens - (*array*) A list of values (*strings*).
3. options - (*object*) key/value set of options.

### Options

* All values passed to [Autocompleter.Base][], PLUS:
* filter - (*function*) An optional *function* to override default filter method.

### Example
	//this object's structure is arbitrary
	var tokens = [
		['Apple', 'Red'],
		['Lemon', 'Yellow'],
		['Grape', 'Purple']];

	new Autocompleter.Local($('myInput'), tokens, {
		delay: 100,
		//this is a custom filter because our object has a unique structure
		filter: function() {
			var regex = new RegExp('^' + (this.queryValue || '').escapeRegExp(), 'i');
			var filtered = this.tokens.filter(function(token){
				return (regex.test(token[0]) || regex.test(token[1]));
			});
			return filtered;
		},
		//again, because our data structure is unique, we must handle the results ourselves
		injectChoice: function(choice) {
			var el = new Element('li')
				.setHTML(this.markQueryValue(choice[0]))
				.adopt(new Element('span', {'class': 'example-info'}).set('html', this.markQueryValue(choice[1])));
			el.inputValue = choice[0];
			this.addChoiceEvents(el).inject(this.choices);
		}
	});

[Autocompleter.Base]: http://clientcide.com/docs/3rdParty/Autocompleter
