Class: ObjectBrowser {#ObjectBrowser}
=====================================

Creates a tree view of any javascript object.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/02-objectbrowser

### Implements

* [Options][], [Events][]

### Syntax

	new ObjectBrowser(container[, options]);

### Arguments

1. container - (*mixed*) a string of the id for an Element or an Element reference to insert the html elements for the [ObjectBrowser][]
2. options - (*object*) a key/value set of options

### Options

* data - (*object*) the object to explore
* initPath - (*string*) the path in the object where the tree display starts; defaults to "", which is the top of the options data object
* buildOnInit - (*boolean*) *true*: builds the interface with the data in the options on initialization. *false*: will not build the UI and you'll have to execute [ObjectBrowser:showLevel][] yourself; defaults to *true*
* excludeKeys - (*array* of *strings*) list of key names that should not be displayed in the object tree; defaults to *none* (an empty array)
* includeKeys - (*array* of *strings*) list of key names to explicitly include in the object tree; defaults to *none* (an empty array)

### Events

* onLeafClick - (*function*) function called when a leaf (a node with no children) is clicked; see data section below for arguments passed to event.
* onBranchClick - (*function*) function called when a branch (a node with children) is clicked; see data section below for arguments passed to event.

### Data passed to events

* li - (*element*) the dom element that was clicked
* key - (*string*) the key of the value in the tree
* value - (*mixed*) the corresponding value of the item clicked in the tree
* path - (*string*) the path to the parent node of the item clicked; the path + "." + key will give you the full path to the value.
* nodePath - (*string*) the path to the node in the tree; computed as path + "." + key + "NODE"; used to find the injection parent for the new list items.
* event - (*event*) the event object for the clicked item so it can be manipulated; it has already been stopped.	

### Example

	new ObjectBrowser($('objBrowser1'), {
	  data: {
		  fruits: {
		    apples: ['red','yellow','green','fuji','granny smith'],
		    grapes: [
		      {
		        fun: 'green',
		        notFun: 'purple'
		      },
		      {
		        wine: ['merlot', 'cabernet'],
		        jelly: 'concord'
		      }
		    ]
		  },
		  veggies: {
		    apples: ['test'],
		    summer: {
		      tomatoes: ['big','small'],
		      melons: ['watermelon','canteloupe']
		    },
		    winter: ['potatoes', 'carots'],
		    someFunction: function(someVariable){
		      alert(someVariable);
		    }
		  }
		}
	});

ObjectBrowser Method: showLevel {#ObjectBrowser:showLevel}
----------------------------------------------------------

Displays a level given a path. If the level hasn't been built yet, the level is built and then injected into the target using the given method.

### Syntax

	myObjectBrowser.showLevel(path, target, method);

### Arguments

1. path - (*string*, optional) the path to the level to show; if not defined or defined as an empty string the top node of the object tree is used.
2. target - (*mixed*, optional) A string of the id for an Element or an Element reference to insert the html elements; if not defined the container specified on initialization is used
3. method - (*string*, optional) any of the injection options for [Element:inject][] (*'bottom'*, *'top'*, *'after'*, *'before'*); defaults to *'bottom'*

### Example

	myObjectBrowser.showLevel(); //shows the top level just as it would on inititialization
	//inject the tree starting at fruits.apples into myContainer at the top
	myObjectBrowser.showLevel("fruits.apples", "myContainer", "top"); 

### Returns

* (*object*) This instance of [ObjectBrowser][]

[ObjectBrowser]: #ObjectBrowser
[ObjectBrowser:showLevel]: #ObjectBrowser:showLevel
[Options]: http://docs.mootools.net/Class/Class.Extras#Options
[Events]: http://docs.mootools.net/Class/Class.Extras#Events
[Element:inject]: http://docs.mootools.net/Element/Element#Element:inject
