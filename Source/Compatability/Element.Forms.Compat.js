/*

Element Property: inputValue {#Element-Properties:inputValue}
-------------------------------------------------------------

### Setter:

Sets the value of the form Element.

#### Syntax:

	myElement.set('inputValue', value);

#### Arguments:

1. value - (*mixed*) a *string*, *boolean*, or *array*, depending on the type of input.

#### Returns:

* (*element*) This Element.

#### Notes:

* When this setter is used on a standard text input or textarea, it just proxies *myInput.set('value', value);*
* When used on a radio or checkbox, you can pass in a *boolean* to check or uncheck it, or pass in a *string* and if the string matches the name, the input will be checked
* When used on a select, you can pass in a *string* for the option to check (unchecking all others) or an *array* of strings to check more than one (for multi-selects) 

#### Examples:

	document.id('mySelect').set('inputValue', 'option1'); //option with value 'option1' is selected
	document.id('myMultiSelect').set('inputValue', ['option1', 'option2']); 
		//options w/ values 'option1' and 'option2' are selected
	document.id('myRadio').set('inputValue', true); //the radio is checked
	document.id('myRadio').set('inputValue', 'red'); //if the radio's name is 'red', it is checked
	document.id('myCheckbox').set('inputValue', true); //the checkbox is checked
	document.id('myCheckbox').set('inputValue', 'red'); //if the checkbox's name is 'red', it is checked
	document.id('myTextArea').set('inputValue', 'foo'); //the value of the textarea is 'foo'
	document.id('myTextInput').set('inputValue', 'foo'); //the value of the text input is 'foo'

### Getter:	
	
Returns the value of the input.

#### Syntax:

	myElement.get('inputValue');

#### Returns:

* (*mixed*) Depending on the type of object, it may return a *string*, *boolean*, or *array*

#### Notes:

* When this getter is used on a standard text input or textarea, it just proxies *myInput.get('value');*
* When used on a checkbox, if the input is checked it will return the *true*, other wise *false*
* When used on a radio it will return the value of the radio that is checked that shares the same name or *null* if none are.
* When used on a select list it will return the value (a *string*) of the selected option or its text value if the value is not defined
* When used on a multi-select it will always return an *array* of the values (*strings*) of the selected options (or their text values if value is not defined)

*/

Element.Properties.inputValue = {

	get: function(){
		 switch(this.get('tag')) {
		 	case 'select':
				vals = this.getSelected().map(function(op){ 
					var v = $pick(op.get('value'),op.get('text')); 
					return (v=="")?op.get('text'):v;
				});
				return this.get('multiple')?vals:vals[0];
			case 'input':
				switch(this.get('type')) {
					case 'checkbox':
						return this.get('checked')?this.get('value'):false;
					case 'radio':
						var checked;
						if (this.get('checked')) return this.get('value');
						document.id(this.getParent('form')||document.body).getElements('input').each(function(input){
							if (input.get('name') == this.get('name') && input.get('checked')) checked = input.get('value');
						}, this);
						return checked||null;
				}
		 	case 'input': case 'textarea':
				return this.get('value');
			default:
				return this.get('inputValue');
		 }
	},

	set: function(value){
		switch(this.get('tag')){
			case 'select':
				this.getElements('option').each(function(op){
					var v = $pick(op.get('value'), op.get('text'));
					if (v=="") v = op.get('text');
					op.set('selected', $splat(value).contains(v));
				});
				break;
			case 'input':
				if (['radio','checkbox'].contains(this.get('type'))) {
					this.set('checked', $type(value)=="boolean"?value:$splat(value).contains(this.get('value')));
					break;
				}
			case 'textarea': case 'input':
				this.set('value', value);
				break;
			default:
				this.set('inputValue', value);
		}
		return this;
	},

	erase: function() {
		switch(this.get('tag')) {
			case 'select':
				this.getElements('option').each(function(op) {
					op.erase('selected');
				});
				break;
			case 'input':
				if (['radio','checkbox'].contains(this.get('type'))) {
					this.set('checked', false);
					break;
				}
			case 'input': case 'textarea':
				this.set('value', '');
				break;
			default:
				this.set('inputValue', '');
		}
		return this;
	}

};