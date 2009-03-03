Namespace: Clipboard {#Clipboard}
=================================

Provides access to the OS clipboard so that data can be copied to it (using a flash plugin).

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/00-clipboard

Original source:
[http://www.jeffothy.com/weblog/clipboard-copy/][]
[http://www.jeffothy.com/weblog/clipboard-copy/]:http://www.jeffothy.com/weblog/clipboard-copy/

### Note
* Clipboard is not a class, it's just a namespace. There is no initialization.

Clipboard Property: swfLocation {#Clipboard:swfLocation}
--------------------------------------------------------

Static property for the location of the Clipboard swf file.

Defaults to: [http://www.cnet.com/html/rb/assets/global/clipboard/_clipboard.swf][]
[http://www.cnet.com/html/rb/assets/global/clipboard/_clipboard.swf]: http://www.cnet.com/html/rb/assets/global/clipboard/_clipboard.swf


Clipboard Property: copyFromElement {#Clipboard:copyFromElement}
----------------------------------------------------------------

Copies the selected text in an element to the clipboard.
### Syntax

	Clipboard.copyFromElement(element);

### Arguments

1. element - (*mixed*) A string of the id for an Element or an Element reference of the element that has selected text

### Example

	Clipboard.copyFromElement("myElementId");

### Returns

* (*element*) the element passed in.


Clipboard Property: copy {#Clipboard:copy}
------------------------------------------

Copies a string to the clipboard.

### Syntax

	Clipboard.copy(text);

### Arguments

* text - (*string*) value to be copied to the clipboard
