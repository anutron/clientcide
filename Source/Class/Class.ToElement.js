/*
---

script: ToElement.js

description: Defines the toElement method for a class.

license: MIT-Style License

requires:
- Core/Class

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