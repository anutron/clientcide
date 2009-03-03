Class: MooScroller {#MooScroller}
=================================

Recreates the standard scrollbar behavior for elements with overflow but using DOM elements so that the scroll bar elements are completely styleable by css.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/08-layout/02-mooscroller

### Implements

* [Options][], [Events][]

### Syntax

	new MooScroller(content, knob[, options]);

### Arguments

1. content - (*mixed*) A string of the id for an Element or an Element reference that contains the overflown content
2. knob - (*mixed*) A string of the id for an Element or an Element reference that acts as the scroll bar
3. options - (*object*, optional) a key/value set of options

### Options

* mode - (*string*) *'vertical'* or *'horizontal'*; defaults to *'vertical'*
* scrollSteps - (*integer*) how many steps to move when the user moves their mouse wheel or clicks the up/down scroll buttons
* wheel - (*boolean*) whether to enable mouse wheel scrolling; defaults to *true*
* scrollLinks - (*object*) object with elements for up and down (or left and right) scrolling
* maxThumbSize - (*integer*) the maximum size to allow the scroll knob to be; defaults to the height of the container it is in.
* hideWhenNoOverflow - (*boolean*) if *true* (the default), the container of all the scroll elements is hidden if there is no overflow (as with native scroll bars).

### Options.scrollLinks
* forward - (*mixed*) A string of the id for an Element or an Element reference that, when clicked, will scroll the area forward; defaults to *$('scrollForward')*; (if not found, nothing bad happens)
* back - (*mixed*) A string of the id for an Element or an Element reference that, when clicked, will scroll the area back; defaults to *$('scrollBack')*; (if not found, nothing bad happens)
	
### Events

* onScroll - (*function*) callback to execute when the user scrolls; passed the number of steps scrolled (*integer*: positive for forward or negative for backward)
* onPage - (*function*) callback to execute when the user pages up or down; passed a boolean: (*true* for forward or *false* for backward)

### Notes

* scrolling *forward* equates to **left** in *horizontal* mode and **up** in *vertical* mode.
* scrolling *backward* equates to **right** in *horizontal* mode and **down** in *vertical* mode.

### Example

	<div id="scroller">
		<div id="content">
			<ol id="scrollerOL">
				<li>one</li>
				<li>two</li>
				<li>three</li>
				<li>four</li>
				<li>five</li>
				<li>six</li>
				<li>seven</li>
				<li>eight</li>
				<li>nine</li>
				<li>ten</li>
			</ol>
			<p>a paragraph</p>
			<ol>
				<li>blah</li>
				<li>blah</li>
			</ol>
		</div>
		<div id="scrollarea">
			<div id="scrollBack"></div>
			<div id="scrollBarContainer">
				<div id="scrollKnob"></div>
			</div>
			<div id="scrollForward"></div>
		</div>
	</div>

	new MooScroller('content', 'scrollKnob');

MooScroller Method: update {#MooScroller:update}
------------------------------------------------

Updates the size of the scroll knob; execute this method when the content changes or the container's size is altered.

### Syntax

	myMooScroller.update();

[Options]: http://docs.mootools.net/Class/Class.Extras#Options
[Events]: http://docs.mootools.net/Class/Class.Extras#Events
