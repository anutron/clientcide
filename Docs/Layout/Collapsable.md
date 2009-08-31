Class: Collapsable {#Collapsable}
=================================

Sets up a DOM element to toggle open and closed when another DOM element is clicked (kind of like a single item Accordion).

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/08-layout/0.1-collapsable

### Extends

* [Fx.Reveal][]

### Syntax

	new Collapsable(clicker, section[, options]);

### Arguments

1. clicker - (*mixed*) A dom Element or the string id of a dom Element that, when clicked, will toggle the display of the section.
2. section - (*mixed*) A dom Element or the string id of a dom Element that is displayed or hidden when the clicker is clicked.
3. options - (*object*, optional) The options object described below:

### Options

* All the options for [Fx.Reveal][].

[Fx.Reveal]: http://clientcide.com/docs/Fx/Fx.Reveal