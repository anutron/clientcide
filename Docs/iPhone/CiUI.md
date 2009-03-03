Class: CiUI {#CiUI}
=============================

Mimics the iPhone UI behavior and provides functionality to easily implement that behavior using only HTML.

Author:
Vladimir Olexa

### Usage

	<html>
	...
	<body>
	<div id="iphone_header">
		<div id="iphone_backbutton" style="display: none;">
			<a id="iphone_backbutton_text" href="#" class="go_back">Back</a>
		</div>
		<div id="iphone_title"></div>
	</div>
	
	<div id="iphone_body" style="clear:both;">
		<a href="my_page1.php" class="go_forward" title="Item 1">Item 1</a>
		<a href="my_page2.php" class="go_forward" title="Item 2">Item 2</a>
		<a href="my_page3.php" class="go_forward" title="Item 3">Item 3</a>
	</div>
	
	<div id="iphone_footer">My footer</div>
	
	<div id="iphone_loading_page" style="display: none;">
		<div id='loading'>
			loading...
		</div>
	</div>
	</body>
	</html>

Element: iphone_header {#iphone_header}
--------------------------------------------------------------

The header includes title and back button. These are updated
automatically with each page load. 

### iphone_backbutton and iphone_backbutton_text

	<div id="iphone_backbutton" style="display: none;">
		<a id="iphone_backbutton_text" href="#" class="go_back">Back</a>
	</div>

The text is always set to previous page's title and trimmed 
to properly fit in. *go_back* here means that the application content will slide
from left to right. You can substitute it for *go_forward* if you wish the backward
movement to appear to go forward. See the section on *iphone_body* for more details. 

### iphone_title

	<div id="iphone_title"></div>

Title is set in the link leading to current page. Meaning,
whatever triggered the page load had page title information
in it. 

Element: iphone_body {#iphone_body}
--------------------------------------------------------------

This is the part that slides. Everything within iphone_body is 
treated as content.

### go_forward and go_back

Including these style sheet classes in any HTML element will make that element
iPhone-clickable. Meaning, the element will become a part of iPhone UI. 

	<a href="my_page.php" class="go_forward" title="Item">Item</a>

There are a couple of events that will be added to the element.

1. Animated transition (from right to left for *go_forward* and left to right for *go_back*)
2. AJAX call to whatever page is specified in the href attribute of the element

*href* and *title* are required attributes if you're going to equip your element with *go_forward*
or *go_back*. The *title* attribute sets the title of the page loaded from *href*. 

### Caching

When you annotate your link with classname cache.

	<a href="my_page.htm" class="go_forward cache" title="My Page">My Page</a>

In the example above the page will be cached. Meaning, navigating to that page again will not fire a new Ajax request. 

Element: iphone_footer {#iphone_footer}
--------------------------------------------------------------

You can add your own footer within this element. The footer will adjust its position to *iphone_body*
size automatically. 

Property: callbackFunct {#callbackFunct}
--------------------------------------------------------------

You can inject your own functions to the end of event stack of CiUI. This function will be called
after slide finishes animating and page content is loaded.

### Usage
	function foo() {
		alert("I loaded, foo!");
	}
	addEventListener("load", function(event) {
		CiUI.callbackFunct = foo;
	}, false);
	
