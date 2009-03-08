Class: HoverGroup {#HoverGroup}
=======================

Keeps track of when the mouse enters and exits a group of elements, allowing for time for the mouse to pass between them (think dropdown menus).

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/08-layout/0.2-hovergroup

### Implements

* [Options][], [Events][]

### Syntax

	new HoverGroup(options);

### Arguments

1. options - (*object*) an object of key/value settings

### Options

* onEnter - (*function*) callback fired when the mouse enters the group
* onLeave - (*function*) callback fired when the mouse leaves the group
* elements - (*mixed*) collection of elements, a selector, an id, or an element to monitor for mouse enter/leave behavior
* delay - (*integer*) time (in ms) alloted for the mouse to leave one item in the group before it must enter another item in order to fire either the *onEnter* or *onLeave* events. Defaults to 300.
* start - (*array*) an array of events that can cause the *onEnter* event to fire. Defaults to *['mouseenter']* but could easily be, for example, *['click']*.
* remain - (*array*) the events that keep the group open. Events that will keep the group from firing the *onLeave* event but only after the *onEnter* event has fired. If the *start* array doesn't include *mouseenter*, for example, you might want to set remains to *['mouseenter']*. This would allow the user to click to open the group, but mouse around the group to keep it open. If *start* contains *mouseenter*, there's no need to specify it in the *remain* group. This value starts off as an empty array, as the default for *start* is *['mouseenter']*.
* end - (*array*) the events that cause the *onLeave* event to fire. Defaults to *['mouseleave']*.

HoverGroup method: attachTo {#HoverGroup:attachTo}
--------------------------------------------------

Attaches and detaches elements to the group. By default, the elements specified in the options are automatically attached, but you and add or remove items from the group at will.

### Syntax

	myHoverGroup.attachTo(elements[, detach]);

### Arguments

1. elements - (*mixed*) collection of elements, a selector, an id, or an element to attach to the group.
2. detach - (*boolean*) if *true* the elements will be removed from the group.

### Returns

* (*object*) - This instance of [HoverGroup][]

[HoverGroup]: #HoverGroup
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events

