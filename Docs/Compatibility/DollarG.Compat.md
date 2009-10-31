Function: $G {#DollarG}
=======================

Returns an array of elements when passed an Element, an id for an element, a selector, or an array of elements.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/04.1-utilities/02-dollarg

### Syntax

	$G(toFind)

### Arguments

1. toFind - (*mixed*) can be an id of an element (*string*), an element (*element*), selector (*string*), or a collection of elements (*array*)

### Examples

	$G('div'); //all the divs on the page
	$G('myElement'); //[$('myElement)]
	$G($$('div')); //all the divs on the page
	$G($('myElement')); //[$('myElement')]