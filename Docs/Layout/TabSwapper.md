Class: TabSwapper {#TabSwapper}
===============================

Handles the scripting for a common UI layout: the tabbed box. If you have a set of DOM elements that are going to toggle visibility based on the related tabs above them (they don't have to be above, but usually are) you can instantiate a [TabSwapper][] and it's handled for you.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/08-layout/05-tabswapper

### Implements

* [Options][], [Events][]

### Syntax

	new TabSwapper(options);

### Arguments

1. options - (*options*) a key/value set of options

### Options
* selectedClass - (*string*) the css class for the tab when it is selected; defaults to *'tabSelected'*
* deselectedClass - (*string*) the class for the tab when it isn't selected; defaults to *empty string*
* mouseoverClass - (*string*) the class for the tab when the user mouses over; defaults to *'tabOver'*
* rearrangeDOM - (*boolean*) arranges the tabs and sections in the DOM to be in the same order as they are in the class; defaults to *true*.
* tabs - (*array*) a collection of DOM elements for the tabs (these get the above classes added to them when the user interacts with the interface); can also be a [$$][] selector (*string*).
* clickers - (*array*) a collection of DOM elements for the clickers; if your tab contains a child DOM element that the user clicks - not the whole tab but an element within it - to switch the content, pass in an array of them here. If you don't pass these in, the array of tabs is used instead (the default). Can also be a [$$][] selector (*string*).
* sections - (*array*) a collection of DOM elements for the sections (these change when the clickers are clicked); can also be a [$$][] selector (*string*).
* initPanel - (*integer*) the panel to show on init; defaults to *0* (zero)
* smooth - (*boolean*) use opacity effect to smooth transitions; defaults to *false*
* smoothSize - (*boolean*) smoothly resize the sections from one section to the other; *false* is default
* cookieName - (*string*) if defined (it isn't by default), the browser will remember the user's previous tab selection using a cookie
* cookieDays - (*integer*) how many days to remember the user's tab selection with the cookie; it's ignored if cookieName isn't set; defaults to *999*
* effectOptions - (*object*) the options to pass on to the transition effect if the "smooth" option is set to *true*; defaults to *{duration: 500}*
* preventDefault - (*boolean*) if `true` (the default), clicks to the tabs call `preventDefault` on tab clicks.

### Events

* onBackground - (*function*) callback executed when a section is hidden; passed three arguments: the index of the section (*integer*), the section (*element*), and the tab (*element*)
* onActive - (*function*) callback executed when a section is shown; passed three arguments: the index of the section (*integer*), the section (*element*), and the tab (*element*)
* onActiveAfterFx - (*function*) callback executed when a section is shown but after the effects have completed (so it's visible to the user); passed three arguments: the index of the section (*integer*), the section (*element*), and the tab (*element*)

### Example

	<ul id="myTabs">
		<li><a href="1">one</a></li>
		<li><a href="2">two</a></li>
		<li><a href="3">three</a></li>
	</ul>
	<div id="myContent">
		<div>content 1</div>
		<div>content 2</div>
		<div>content 3</div>
	</div>

	var myTabSwapper = new TabSwapper({
		selectedClass: 'on',
		deselectedClass: 'off',
		mouseoverClass: 'over',
		mouseoutClass: 'out',
		tabs: $$('#myTabs li'),
		clickers: $$('#myTabs li a'),
		sections: $$('#myContent div'),
		smooth: true,
		cookieName: 'rememberMe'
	});

### Notes

* you don't have to specify the classes for mouseover/out
* you don't have to specify a click selector; it'll just use the tab DOM elements if you don't give it the click selector
* the click selector is NOT a subselector of the tabs; be sure to specify a full css selector for these
* you can initialize the class without any tabs or sections and add them subsequently with [addTab][]

TabSwapper Method: addTab {#TabSwapper:addTab}
----------------------------------------------

Adds a tab to the interface.

### Syntax

	myTabSwapper.addTab(tab, section[, clicker, index]);

###	Arguments

1. tab - (*mixed*) A string of the id for an Element or an Element reference to the tab
2. section - (*mixed*) A string of the id for an Element or an Element reference to display when the element clicks to change tabs
3. clicker - (*mixed*, optional) A string of the id for an Element or an Element reference to the element (typically within the tab) that the user clicks to switch tabs
4. index - (*integer*, optional) where to insert this tab; defaults to the last place (i.e. push)

### Returns

* (*object*) This instance of [TabSwapper][]

TabSwapper Method: removeTab {#TabSwapper:removeTab}
----------------------------------------------------

Removes a tab from the [TabSwapper][]; does NOT remove the DOM elements for the tab or section from the DOM.

### Syntax

	myTabSwapper.removeTab(index)

### Arguments

1.	index - (*integer*) the index of the tab to remove.

### Returns

* (*object*) This instance of [TabSwapper][]

TabSwapper Method: moveTab {#TabSwapper:moveTab}
------------------------------------------------

Moves a tab from one location to another (ie it changes its index).

### Syntax

	myTabSwapper.moveTab(from, to);

### Arguments

1. from - (*integer*) the index of the tab to move
2. to - (*integer*) its new location

### Returns

* (*object*) This instance of [TabSwapper][]

TabSwapper Method: show {#TabSwapper:show}
------------------------------------------

Shows a given section (as if the user clicked the tab).

### Syntax

	myTabSwapper.show(index);

### Arguments

1. index - (*integer*) the index of the tab to show

### Returns

* (*object*) This instance of [TabSwapper][]

[TabSwapper]: #TabSwapper
[addTab]: #TabSwapper:addTab
[$$]: http://www.mootools.net/docs/core/Element/Element#dollars
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
