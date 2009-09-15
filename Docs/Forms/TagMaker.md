Class: TagMaker {#TagMaker}
===========================

Prompts the user to fill in the gaps to create an HTML tag output.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/08-tagmaker

### Implements

* [Options][], [Events][], [StyleWriter][]

### Syntax

	new TagMaker(options);

### Arguments

1. options - (*object*) a key/value set of options

### Options

* name - (*string*) the name displayed in the caption area of the popup
* output - (*string*) the HTML tag with tokens for the areas the user is to fill in (see example below)
* picklets - (*object*) a key/value set where the keys are the tokens in the output and the values are arrays of picklets; see [Picklet][] and [ProductPicker][];
* help - (*object*) a key/value set where the keys are the tokens in the output and the values are help text for tooltips; see example.
* example - (*object*) a key/value set where the keys are the tokens in the output and the values are examples of valid inputs.
* class - (*object*) a key/value set where the keys are the tokens in the output and the values are css classes; use these to pass along validators for [Form.Validator][] if you want the fields validated.
* selectLists - (*object*) a key/value set where the keys are the tokens in the output and the values are arrays of objects. These sub-objects have keys for "key" and "value" that correspond to the innerText of the option and the value of the option respectively. Additionally, one of them can have the key/value set of *"selected: true"* to have that option be selected. (see example)
* width - (*integer*) the width for the prompt; defaults to *400*
* maxHeight - (*integer*) the maximum height for the prompt; defaults to *500*
* showResult - (*boolean*) whether an input is shown with the resulting output in it; defaults to *true*
* clearOnPrompt - (*boolean*) whether the prompt is emptied every time it is displayed; defaults to *true*
* css - (*string*) css rules to be injected into the page to style the prompt; defaults to the default style included in this class (see source).

### Events

* onPrompt - (*function*) callback executed when the prompt is displayed to the user
* onChoose - (*function*) callback executed when the user clicks "paste" or "copy", which closes the prompt

### Example

	TagMaker.image = new Class({
		Extends: TagMaker,
		options: {
			name: "Image Builder",
			output: '<img src="%Full Url%" width="%Width%" height="%Height%" alt="%Alt Text%" style="%Alignment%"/>',
			help: {
				'Full Url': 'Enter the external URL (http://...) to the image',
				'Width': 'Enter the width in pixels.',
				'Height': 'Enter the height in pixels.',
				'Alt Text': 'Enter the alternate text for the image.',
				'Alignment': 'Choose how to float the image.'
			},
			example: {
				'Full Url': 'http://i.i.com.com/cnwk.1d/i/hdft/redball.gif'
			},
			'class': {
				'Full Url': 'validate-url required',
				'Width': 'validate-digits required',
				'Height': 'validate-digits required',
				'Alt Text': 'required'
			},
			selectLists: {
				Alignment: [
					{
						key: 'left',
						value: 'float: left'
					},
					{
						key: 'right',
						value: 'float: right'
					},
					{
						key: 'none',
						value: 'float: none',
						selected: true
					},
					{
						key: 'center',
						value: 'margin-left: auto; margin-right: auto;'
					}
				]		
			},
			showResult: false
		}
	});


TagMaker Method: prompt {#TagMaker:prompt}
------------------------------------------

Prompts the user to interact with the builder.

### Syntax

	myTagMaker.prompt(target);

### Arguments

1. target - (*mixed*) A string of the id for an Element or an Element reference that the [TagMaker][] is associated with per prompt. This allows you to have one instance that creates, say, links, but show the same one for different inputs.

### Returns

* (*object*) This instance of [TagMaker][]

Class: TagMaker.image {#TagMaker-image}
=======================================

The default image tag maker.

### Extends

* [TagMaker][]

### Syntax

	new TagMaker.image(options);

### Arguments

* options - (*object*) see [TagMaker][] for options. [TagMaker.image][] defines the default options for a basic image tag.

Class: TagMaker.anchor {#TagMaker-anchor}
=========================================

The default anchor tag maker.

### Extends

* [TagMaker][]

### Syntax

	new TagMaker.anchor(options);

### Arguments

* options - (*object*) see [TagMaker][] for options. [TagMaker.anchor][] defines the default options for a basic anchor tag.



[TagMaker]: #TagMaker
[TagMaker.anchor]: #TagMaker-anchor
[TagMaker.image]: #TagMaker-image
[Picklet]: http://clientcide.com/docs/Forms/ProductPicker#Picklet
[ProductPicker]: http://clientcide.com/docs/Forms/ProductPicker#ProductPicker
[Form.Validator]: http://clientcide.com/docs/Forms/Form.Validator
[StyleWriter]: http://clientcide.com/docs/UI/StyleWriter
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
