Class Autocompleter.JSONP {#Autocompleter:JSONP}
================================================

Implements [Request.JSONP][] support for the [Autocompleter][] class.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]: http://www.clientcide.com/wiki/cnet-libraries/11-3rdparty/04-autocompleter.JSONP

### Extends

* [Autocompleter.Ajax.Json][]

### Syntax

	new Autocompleter.JSONP(input, url, options);

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference of the form input to autocomplete.
2. url - (*string*) the url to query for values based on user input.
3. options - (*object*) key/value set of options.

### Options

* All the options for [Autocompleter.Base][], [Autocompleter.Ajax.Base][], and [Autocompleter.Ajax.Json][] PLUS:
* JSONPOptions - (*object*) options passed along to the [JSONP][] class.

### Examples

Let's say the user is typing into an input to search for ipods and you need to take what they've typed ("ipo" so far) and send it to a server to get back filtered results like so:

	http://server.com/handler.jsp?query=ipo

Then the postVar option would be "query" so that the user's input is mapped to this key in the query string.

	var myCompleter = new Autocomplete.JSONP($('myinput'), 'http://server.com/handler.jsp', {
		postVar: 'query'
		...
	});

You're not really done though, because you need to handle the results that come back using the functionality in the base [Autocompleter][] class. Here's an example that will work with the cnet API:


	new Autocompleter.JSONP($('JSONP'), 'http://api.cnet.com/restApi/v1.0/techProductSearch', {
		JSONPOptions: {
			//this data gets added to the query string using JSONP's options
			data: {
				viewType: 'json',
				partKey: '19926949750937665684988687810562', //this is my code, use your own!
				iod: 'none',
				start: 0,
				results: 10
			}
		},
		//require at least a key stroke from the user
		minLength: 1,
		//this function filters the results based on the input
		filterResponse: function(resp) {
			//test it
			if (!choices || choices.length == 0) return [];
			//filter it and return it
			var regex = new RegExp('^' + (this.queryValue || '').escapeRegExp(), 'i');
			return choices.filter(function(choice){
				return (regex.test(choice.Name.$) || regex.test(choice['@id']));
			});
		},
		useSelection: false,
		//because the data returned has a unique structure, we must manage the parsing ourselves
		filterResponse: function(resp) {
			try {
				//this structure is unique to the CNET API
				choices = resp.CNETResponse.TechProducts.TechProduct;
				//test it
				if (!choices || choices.length == 0) return [];
				//filter it and return it
				return choices.filter(function(choice){
					return (choice.Name.$.test(this.getQueryValue(), 'i') || choice['@id'].test(this.getQueryValue()), 'i');
				}.bind(this));
			} catch(e){'filterResponse error: ', dbug.log(e)}
		},
		injectChoice: function(choice) {
			//again, the structure of these items is unique to the CNET API
			if (!choice.Name.$)return;
			var el = new Element('li')
				.set('html', this.markQueryValue(choice.Name.$))
				.adopt(new Element('span', {'class': 'example-info'}).set('html', this.markQueryValue(choice['@id'])));
			el.inputValue = choice.Name.$ + ' (' + choice['@id'] + ')';
			this.addChoiceEvents(el).inject(this.choices);
		}
	});

[Autocompleter]: http://clientcide.com/docs/3rdParty/Autocompleter
[Autocompleter.Base]: http://clientcide.com/docs/3rdParty/Autocompleter
[Request.JSONP]: http://www.mootools.net/docs/more/Request/Request.JSONP
[Autocompleter.Ajax.Base]: http://clientcide.com/docs/3rdParty/Autocompleter.Remote#Autocompleter-Ajax:Base
[Autocompleter.Ajax.Json]: http://clientcide.com/docs/3rdParty/Autocompleter.Remote#Autocompleter-Ajax:Json
