Class: Picklet {#Picklet}
=========================

Container for all the information required to allow the user to search a data source and pick a result.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/06-productpicker

### Note

This script contains no [Picklets][]. This means that it isn't very useful unless you write your own or include some (such as [CNETProductPicker][] or [NewsStoryPicker][]);

### Implements

* [Options][], [Events][]

### Syntax

	new Picklet(className, options);

### Arguments

1. className - (*string*, required) the className associated with the [Picklet][]
2. options - (*object*, required) a key/value object of options for the [Picklet][]

### Options:

**NOTE: all options are required unless otherwise noted.**

* url - (*string*) the base url for the data source, defaults to the CNET API (http://api.cnet.com/restApi/v1.0/techProductSearch)
* baseHref - (*string*) the base url for images for the picker
* descriptiveName - (*string*) the name to show in the select list of [Picklets][] available for an input
* callBackKey - (*string*) the wrapper for [Request.JSONP][] (see it for details); defaults to *'callback'*
* data - (*object*) an object of key/value pairs to pass along with the request in the url
* getQuery - (*function*) returns a [Request][] or [Request.JSONP][] object that has not yet been executed. Will be passed the data input into the search form by the user
* inputs - (*object*) an object of key/value pairs for inputs for the form. (see below)
* previewHtml - (*function*) a function that is passed a data result from the ajax/json results that will return the HTML for the preview using that data object
* resultsList - (*function*) a function that is passed the response from the ajax/json object above that will turn that response into a list of items (*array*) to be chosen from
* listItemName - (*function*) a function that is passed a single item from the resultsList and returns the name (*string*) to be displayed in the list
* listItemValue - (*function*) a function that is passed a single item from the resultsList and returns the value that will be set to the value of the input for the picker
* updateInput - (*function*) a function that is passed the input and the data item that the user selected that then does something with that selection (typically updating the input)

### Inputs

The inputs for the search form in the picker can be anything. Each input is described in the inputs object that is an option of the [Picklet][]. See *inputs* in the *options* section (above).

Each item in the inputs must be defined thus:

First, the key of the object will be used for the name of the input (i.e. inputs: {query: ....} will result in &lt;input name="query".../&gt;).
The values for the object will be translated into the input and its descriptors and properties.

* tagName - (*string*) the name of the tag ('input', 'select', etc.)
* type - (*string*) the type of the input ('text', 'hidden', etc')
* instructions - (*string*) text that will be displayed to the left of the input
* tip - (*string*) tool-tip info that is displayed on hover. Format: *CAPTION::TIP DEFINITION*
* value - (*string*) the value of the input by default. If type is *'select'*, this should be an array of values
* optionNames - (*string*) if the type is *'select'*, an array text values for the option elements (what the user sees)
* style - (*string*) an object of style properties for the input (e.g. *style: {width: "100%"}*)

### Example

Here is an example [Picklet][] in it's entirety:

	var CNETProductPicker = new Picklet('CNETProductPicker',{
		url: 'http://api.cnet.com/restApi/v1.0/techProductSearch',
		descriptiveName: 'CNET Product Picker Sortable',
		callBackKey: 'callback', //see <JSONP> options
		data: {
			partKey: 'YOUR PARTNER KEY FROM API.CNET.COM',
			iod: 'hlPrice',
			viewType: 'json',
			sortDesc: 'true'
		}, //static data
		getQuery: function(data){ //return Request or JSONP
			return new Request.JSONP({
				url: this.options.url,
				callBackKey: this.options.callBackKey,
				data: $merge(this.options.data, data)
			});
		},
		inputs: {
			query: {
				tagName: 'input',
				type: 'text',
				instructions: 'search for: ',
				tip: 'cnet product search::input a product name and hit &lt;enter&gt; to get results',
				value: '',
				style: {
					width: '100%'
				}
			},
			orderBy: {
				tagName: 'select',
				instructions: 'order by: ',
				style: {
					width: '100%'
				},
				value: ['pop9%2Bdesc', 'edRating7'],
				optionNames: ['most popular', 'editor\'s rating']
			},
			submit: {
				tagName: 'input',
				type: 'submit',
				style: {
					cssFloat: 'right'
				},
				instructions: '',
				value: 'submit'
			}
		}, //form builder
		previewHtml: function(data){
			var editors = "";
			var html = '<div class="dataId" style="color: #999; font-weight:bold; margin: 0px; padding: 0px;">' +
				id: ' + data['@id'] + '</div>'+
				'<div class="dataDetails" style="font-size: 10px;">' +
				<img height="45" width="' + data.ImageURL[0]["@width"] + '" style="margin-left: 10px" src="' +
				data.ImageURL[1].$ + '"/><br /><b>' + data.Name.$ + '</b>';
			if (data.EditorsRating && data.EditorsRating.$) 
				html += "<br/>editors' rating: " + data.EditorsRating.$;
			html += "<div>";
			if (data.LowPrice && data.LowPrice.$) html += 
				"<span class='productPickerPrices'>" + data.LowPrice.$ + "</span>";
			if (data.HighPrice && data.HighPrice.$ && (data.LowPrice.$ != data.HighPrice.$))
					html += " to <span class='productPickerPrices'>" + data.HighPrice.$ + "</span>";
			html += "</div></div>";
			html += "<div>";
			if (data.Offers && data.Offers['@numFound'] > 0) 
				html += "resellers: " + data.Offers["@numFound"];
			html += "</div>";
			return html;
		}, //html template for returned json data
		resultsList: function(results){
			if (results.CNETResponse.TechProducts && results.CNETResponse.TechProducts["@numFound"] > 0)
				return results.CNETResponse.TechProducts.TechProduct;
			return false;
		},
		listItemName: function(data){
			return data.Name.$
		}, //line item name for the selection list
		listItemValue: function(data){
			return data['@id'];
		},
		//handle the click event; user chooses an item, and this function updates the input 
		//(or does something else)
		updateInput: function(input, data) {
			input.value = data['@id'];
		}
	});



Class: ProductPicker {#ProductPicker}
=====================================

Handles the UI for picking products; requires at least one [Picklet][].

### Implements

* [Options][], [Events][], [StyleWriter][]

### Syntax

	new ProductPicker(inputs, picklets[, options]);

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference that the ProductPicker references
2. picklets - (*array*) an array of [Picklets][]
3. options - (*object*) a key/value set of options

### Options

* title - (*string*) caption for the [StickyWin][] popup; defaults to *"Product picker"*
* showOnFocus - (*boolean*) whether the product picker shoule show when the user focuses the input; default to *true*
* additionalShowLinks - (*array*) array of DOM elements or ids that show the picker when clicked
* stickyWinToUse - (*class*) a reference to a [StickyWin][] class to use for the popup; default is *[StickyWin.Fx][]*
* stickyWinOptions - (*object*) a key/value set of options to pass along to the [StickyWin][]; defaults to *{fadeDuration: 200, draggable: true}*
* moveIntoView - (*boolean*) moves the picker to be on screen if it is partially obscured; defaults to *true*

### Events

* onShow - (*function*) callback to execute when the [ProductPicker][] is displayed
* onPick - (*function*) callback to execute when the user clicks an entry

ProductPicker Method: show {#ProductPicker:show}
-------------------------------------------------
Shows the [ProductPicker][]

### Syntax

	myProductPicker.show();

### Returns

* *object* - This instance of [ProductPicker][]

ProductPicker method: hide {#ProductPicker:hide}
------------------------------------------------

Hides the ProductPicker.

### Syntax

	myProductPicker.hide();

### Returns

* (*object*) - This instance of ProductPicker

ProductPicker global functions {#ProductPickerGlobalFunctions}
==============================================================
These functions are available to the [ProductPicker][] namespace itself, not instances of it. Use these functions to add [Picklets][] to the [ProductPicker][] object, which will be available to all instances of the [ProductPicker][] class.

ProductPicker Namespace Method: add {#ProductPickerGlobalFunctions:add}
-----------------------------------------------------------------------

Adds a [Picklet][] to the list of [Picklets][] available to the [ProductPicker][] class.

### Syntax

  ProductPicker.add(picklet);

### Arguments

1. picklet - (*class*) a [Picklet][]

### Returns

* nothing

ProductPicker Namespace Method: addAllThese {#ProductPickerGlobalFunctions:addAllThese}
---------------------------------------------------------------------------------------

Adds several [Picklets][] to the list of [Picklets][] available to the [ProductPicker][] class.

### Syntax

	ProductPicker.addAllThese([picklet, picklet, etc.]);

### Arguments

1. picklets - an array of [Picklets][]

### Returns

* nothing

ProductPicker Namespace Method: getPicklet {#ProductPickerGlobalFunctions:getPicklet}
---------------------------------------------------------------------------------------

Returns a [Picklet][] that matches the given className (or false, if none was found).

### Syntax

	ProductPicker.getPicklet(className);

### Arguments

1. className - (*string*) the css className for the [Picklet][]

### Returns

* nothing

Class: FormPickers {#FormPickers}
=================================

Adds the appropriate [ProductPicker][]s to all the inputs in a form as defined in the classNames assigned to each input.

### Implements

* [Options][]

### Syntax

	new FormPickers(form[, options]);

### Arguments

1. form - (*mixed*) A string of the id for an Element or an Element reference to the form
2. options - (*object*) a key/value set of options

### Options

* inputs - (*string*) selector of input types to parse; defaults to *'input'* (but could include textarea, select, etc.)
* additionalShowLinkClass - (*string*) className for links that should show the [ProductPicker][] when clicked. Each input in the form will be checked to see if its next sibling (i.e. the DOM element right after the input) has this class and, if so, the element will have an event attached so that the picker is shown when it is clicked.
* pickletOptions - (*object*) options passed along to each [ProductPicker][] created.

[Picklet]: #Picklet
[Picklets]: #Picklet
[ProductPicker]: #ProductPicker
[Request.JSONP]: http://www.mootools.net/docs/more/Request/Request.JSONP
[StickyWin]: /docs/UI/StickyWin
[StickyWin.Fx]: /docs/UI/StickyWin.Fx
[StyleWriter]: /docs/UI/StyleWriter
[CNETProductPicker]: http://cnetjavascript.googlecode.com/svn/trunk/implementations/picklets/
[NewsStoryPicker]: http://cnetjavascript.googlecode.com/svn/trunk/implementations/picklets/
[Request]: http://www.mootools.net/docs/core/Request/Request
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
