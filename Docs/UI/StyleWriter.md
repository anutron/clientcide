Class: StyleWriter {#StyleWriter}
=================================

Provides a simple method for injecting a css style element into the DOM if it's not already present. This class is intended to be implemented into other classes.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/04-stylewriter

### Syntax

	//standalone
	new StyleWriter();
	//implemented into a class (intended use)
	var MyClass = new Class({
		Implements: [StyleWriter],
		//...
	});

StyleWriter Method: createStyle {#StyleWriter:createStyle}
----------------------------------------------------------

Writes a style element into the DOM if, optionally, it is not already present.

### Syntax

	myStyleWriter.createStyle(css[, id]);

### Arguments

1. css - (*string*) css rules for the *style* element
2. id - (*string*, optional) if supplied and there is already a DOM element with this id present, the method just exits without creating the style element.

### Returns

* nothing.

### Example

	//implemented into a class (intended use)
	var MyClass = new Class({
		Implements: [StyleWriter],
		//...
	});
	new MyClass().createStyle("a.example { color: red }", "redLinks");
	//standalone
	new StyleWriter().createStyle("a.example { color: red }", "redLinks"); // just exits as 'redLinks' already exists

[StyleWriter]: #StyleWriter
