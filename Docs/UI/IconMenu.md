Class: IconMenu {#IconMenu}
===========================

A simple icon (typically using images) based menu.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/07-ui/00-iconmenu

### Implements	

* [Options][], [Events][]

### Syntax

	new IconMenu(options);

### Arguments

1. options - (*object*) set of name/value options

### Options

* container - (*mixed*) a string of the id for an Element or an Element reference that contains the icon elements
* images - (*string*) the class given to all the elements (typically images) in the menu (default *".iconImgs"*); note: does not have to be images - they can be any type of DOM element.
* captions - (*string*) the class given to all the captions (default *".iconCaptions"*)
* removeLinks - (*string* or *collection*) a selector or a collection; all the links to add remove actions to
* clearLinks - (*string* or *collection*) a selector or a collection; all the links to add clear actions to
* useAxis - (*string*) the axis to use; *'x'* (if horizontal layout) or *'y'* (for vertical layouts); defaults to *'x'*
* scrollFxOptions - (*object*) options for the [Fx.Tween][] that scrolls the icons left and right

### Events

* onFocus - (*function*) callback executed when the user mouses over an icon
* onFocusDelay - (*integer*) amount of time to delay the onFocus event; if the user mouses out from the icon before the duration of the delay, the event is not fired; defaults to *0* (zero)
* initialFocusDelay - (*integer*) amount of time to delay before the first onFocus event is fired
* onBlur - (*function*) callback executed when the user mouses out from an icon
* onBlurDelay - (*integer*) amount of time to delay the onBlur event; if the user puts their mouse back over the icon before the duration of the delay, the event is not fired; defaults to *0* (zero)
* onEmpty - (*function*) callback executed when the toolbar is emptied of icons
* onRemoveItem - (*function*) callback executed when an item is removed; passed the container of the image and caption just before they are removed
* onRemoveItems - (*function*) callback executed after items are removed using [IconMenu:removeItems][]; passed an array of the removed items
* onSelect - (*function*) callback executed when an icon is selected; passed the index of the icon and the image in the icon
* onDeSelect - (*function*) same as onSelect, only it's fired when something is deselected
* onItemsAdded - (*function*) callback executed when all the icons are loaded on initialize
* onAdd - (*function*) callback executed when an individual item is added; passed the image and caption

### Properties

* container - (*element*) the element that holds all the icons
* images - (*array*) all the images
* captions - (*array*) all the captions (associated to each image in imgs)
* selected - (*array*) an array of icons that are in the selected state
* side - (*string*) 'left' or 'top' state (where the bar is and its alignment); based on options.useAxis
* currentOffset - (*integer*) the currently scrolled-to index
* inFocus - (*element*) the icon currently hovered over
* prevFocus - (*element*) the icon previously hovered over

### Definitions/Conventions:

* "img" or "image" - generally is a reference to the element that represents the block element of the icon itself (typically an image) in the icon menu
* "caption" - generally is a reference to an optional DOM element that may accompany an image
* "icon" - generally is a reference to the DOM element containing an image (as defined above) and (possibly) a caption

### Example

	var myMenu = new IconMenu({
		//the list that contains all the 'icons'
		container: $E('#userHistoryBar ul'), 
		//the images in the icons
		images: $$('#userHistoryBar img'), 
		//captions, if any; here I use the checkboxes as the caption - these are optional
		captions: $$('#userHistoryBar input'),
		removeLinks: $$('#history #removeSelected'),
		clearLinks: $$('#history #clearall'),
		//a function to execute when an item is selected
		onSelect: function(index, img){
			img.setStyle('border', '1px solid #77f');
		},
		//ditto, for deselect
		onDeSelect: function(index, img){
			img.setStyle('border', '1px solid #555');
		},
		onAdd: function(img, caption){
			//select any items that have their checkboxes already checked
			this.selectItem(this.imgs.indexOf(img), !!caption.getValue());
			//a function executed when the user clicks the image
			//or the checkbox
			var selectIt = function(img){
				this.selectItem(this.imgs.indexOf(img));
			}.bind(this);
			//add the event to the select input
			caption.addEvent('click', function(){
				selectIt(img);
			}.bind(this));
			//add the event to the image
			img.addEvent('click', function(){
				selectIt(img);
				caption.checked = img.hasClass('selected');
			}.bind(this));
		}
	});

IconMenu Method: scrollTo {#IconMenu:scrollTo}
----------------------------------------------

Scrolls the icons in the bar to the specified index.

### Syntax

	myMenu.scrollTo(index[, useFx]);

### Arguments

1. index - (*integer*) the index of the icon you want to scroll to
2. useFx - (*boolean*, optional) whether to use transition or not; defaults to *true*

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.scrollTo(3);
	myMenu.scrollTo(3, false); //no effects, just jump to 3

IconMenu Method: pageForward {#IconMenu:pageForward}
----------------------------------------------------

Pages the icon set one visible set forward; a set is defined as the number of icons in range or the value passed in.

### Syntax

	myMenu.pageForward(howMany);

### Arguments

1. howMany - (*integer*, optional) you can define a set as a fixed number rather than on the visible amount

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.pageForward(4);

IconMenu Method: pageBack {#IconMenu:pageBack}
----------------------------------------------

Pages the icon set one visible set backward; a set is defined as the number of icons in range or the value passed in.

### Syntax

	myMenu.pageBack(howMany);

### Arguments

1. howMany - (*integer*, optional) you can define a set as a fixed number rather than on the visible amount

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.pageBack(4);

IconMenu Method: addItem {#IconMenu:addItem}
--------------------------------------------

Adds an item to the icon bar.

### Syntax

	myMenu.addItem(img[, caption, where]);

### Arguments

1. img - (*mixed*) a string of the id for an Element or an Element reference of the icon; typically an image
2. caption - (*mixed*, optional) a string of the id for an Element or an Element reference of the caption related to the image
3. where - (*integer*, optional) index where to put it; defaults to the end of the icon set

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.addItem($('img2'), $('caption2'), 1);
	myMenu.addItem($('img2'));

IconMenu Method: removeItems {#IconMenu:removeItems}
----------------------------------------------------

Removes a list of items from the icon menu.

### Syntax

	myMenu.removeItems(imgs[, useFx]);

### Arguments

1. imgs - (*array*) an array of images to remove
2. useFx - (*boolean*; optional) *true*: transition the images away; *false*: or remove them instantly; defaults to *true*

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.removeItems([img1, img2, img3]);
	myMenu.removeItems([img1, img2, img3], false);

IconMenu Method: removeSelected {#IconMenu:removeSelected}
----------------------------------------------------------

Removes the icons that the user selected (see [IconMenu:selectItem][]) from the menu.

### Syntax

	myMenu.removeSelected(useFx)

### Arguments

1. useFx - (*boolean*, optional) *true*: transition the images away; *false*: or remove them instantly; defaults to *true*

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.removeSelected();
	myMenu.removeSelected(false);

IconMenu Method: empty {#IconMenu:empty}
----------------------------------------

Empties the menu entirely.

### Syntax

	myMenu.empty(suppressEvent);	
### Arguments

1. suppressEvent - (*boolean*) prevents the onEmpty event from firing.

### Returns

* (*object*) This instance of [IconMenu][]

IconMenu Method: selectItem {#IconMenu:selectItem}
--------------------------------------------------

Designates an item at the specified index as being selected.

### Syntax

	myMenu.selectItem(index[, select]);

### Arguments

1. index - (*integer*) the location of the icon to select
2. select - (*boolean*, optional) *true*: select the item; *false*: deselect; if not specified it toggles

### Returns

* (*object*) This instance of [IconMenu][]

### Example

	myMenu.selectItem(3); //toggles
	myMenu.selectItem(3, true); //selects
	myMenu.selectItem(3, false); //deselects

[IconMenu]: #IconMenu
[IconMenu:selectItem]: #IconMenu:selectItem
[IconMenu:removeItems]: #IconMenu:removeItems
[Fx.Tween]: http://www.mootools.net/docs/core/Fx/Fx.Tween
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
