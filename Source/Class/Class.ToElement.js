/*
---

script: ToElement.js

description: Defines the toElement method for a class.

license: MIT-Style License

requires:
- core:1.2.4/Class

provides:
- Class.toElement

...
*/
Class.ToElement = new Class({
	toElement: function(){
		return this.element;
	}
});
var ToElement = Class.ToElement;