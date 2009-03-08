Class: MultipleOpenAccordion {#MultipleOpenAccordion}
=====================================================

A Mootools Accordion-like class that allows the user to open more than one element.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/08-layout/02.1-multipleopenaccordion

### Implements

* [Options][], [Events][], [Chain][]

### Syntax

	new MultipleOpenAccordion(container[,options]);

###	Arguments

1. container - (*mixed*) A string of the id for an Element or an Element reference that contains the accordion
2. options - (*object*) a key/value set of options
### Options

* togglers - (*mixed*) an array of elements or a selector representing all the elements that toggle elements in the accordion open and closed.
* elements - (*mixed*) an array of elements in the accordion that are toggled open and closed.
* openAll - (*boolean*) whether to open all elements on startup; defaults to *true*.
* firstElementsOpen - (*array*) an array of integers representing the indexes of the elements to open on startup; only used if *openAll = false*; defaults to *[0]*; can be *[]* (empty array) to signifiy that all should be closed.
* fixedHeight - (*integer*) if you want your accordion to have a fixed height; defaults to *false*.
* fixedWidth - (*integer*), if you want your accordion to have a fixed width; defaults to *false*.
* height - (*boolean*) whether to add a height transition to the accordion; defaults to *true*.
* opacity - (*boolean*) whether to add an opacity transition to the accordion; defaults to *true*.
* width - (*boolean*) whether to add a width transition to the accordion; defaults to *false*.

### Events

* onActive - (*function*) callback to execute when an element is shown; passed arguments: (toggler, section)
* onBackground - (*function*) callback to execute when an element starts to hide; passed arguments: (toggler, section)

### Example

	new MultipleOpenAccordion($('myContainer'), {
		openAll: false,
		firstElementsOpen: [] //close everything
	});

Method MultipleOpenAccordion: addSection {#MultipleOpenAccordion:addSection}
---------------------------------------------------------------------------

Adds a section to the accordion.

### Syntax

	myMultipleOpenAccordion.addSection(toggler, element);

### Arguments

1. toggler - (*mixed*) A string of the id for an Element or an Element reference that, when clicked, will reveal the associated element.
2. element - (*mixed*) A string of the id for an Element or an Element reference that is exposed with its corresponding toggler is clicked.

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: toggleSection {#MultipleOpenAccordion:toggleSection}
--------------------------------------------------------------------------

Toggles a specific section open or closed.

### Syntax

	myMultipleOpenAccordion.toggleSection(index[, useFx]);

### Arguments

1. index - (*integer*) the index of the section to toggle
2. useFx - (*boolean*, optional) toggle with the transition, or just toggle immediately

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: showSection {#MultipleOpenAccordion:showSection}
--------------------------------------------------------------------------

Shows a specific section.

### Syntax

	myMultipleOpenAccordion.showSection(index[, useFx]);

### Arguments

1. index - (*integer*) the index of the section to show
2. useFx - (*boolean*; optional) show with the transition, or just show immediately

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: hideSection {#MultipleOpenAccordion:hideSection}
--------------------------------------------------------------------------

Hides a specific section.

### Syntax

	myMultipleOpenAccordion.hideSection(index[, useFx]);

### Arguments

1. index - (*integer*) the index of the section to hide
2. useFx - (*boolean*, optional) hide with the transition, or just hide immediately

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: toggleAll {#MultipleOpenAccordion:toggleAll}
--------------------------------------------------------------------------

Toggles the state of each item in the accordion.

### Syntax

	myMultipleOpenAccordion.toggleAll(useFx);

### Arguments

1. useFx - (*boolean*, optional) toggle each element with the transition, or just toggle each immediately

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: showAll {#MultipleOpenAccordion:showAll}
----------------------------------------------------------------------

Shows all the items in the accordion.

### Syntax

	myMultipleOpenAccordion.showAll(useFx);

### Arguments

1. useFx - (*boolean*, optional) shows each element with the transition, or just shows each immediately

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: hideAll {#MultipleOpenAccordion:hideAll}
----------------------------------------------------------------------

Hides all the items in the accordion.

### Syntax

	myMultipleOpenAccordion.hideAll(useFx);

### Arguments

1. useFx - (*boolean*, optional) hides each element with the transition, or just hides each immediately

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: toggleSections {#MultipleOpenAccordion:toggleSections}
--------------------------------------------------------------------------------

Toggles specific sections open or closed.

### Syntax

	myMultipleOpenAccordion.toggleSections(sections[, useFx]);

### Arguments

1. sections - (*array*) an array of integers representing the indexes of the elements to toggle
2. useFx - (*boolean*, optional) hides each element with the transition, or just hides each immediately

### Example

	myMultipleOpenAccordion.toggleSections([1,2,5]);

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: showSections {#MultipleOpenAccordion:showSections}
--------------------------------------------------------------------------------

Shows specific sections open or closed.

### Syntax

	myMultipleOpenAccordion.showSections(sections[, useFx]);

### Arguments

1. sections - (*array*) an array of integers representing the indexes of the elements to show
2. useFx - (*boolean*, optional) hides each element with the transition, or just hides each immediately

### Example

	myMultipleOpenAccordion.showSections([1,2,5]);

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

Method MultipleOpenAccordion: hideSections {#MultipleOpenAccordion:hideSections}
--------------------------------------------------------------------------------

Hides specific sections open or closed.

### Syntax

	myMultipleOpenAccordion.hideSections(sections[, useFx]);

### Arguments

1. sections - (*array*) an array of integers representing the indexes of the elements to hide
2. useFx - (*boolean*, optional) hides each element with the transition, or just hides each immediately

### Example

	myMultipleOpenAccordion.hideSections([1,2,5]);

### Returns

* (*object*) This instance of [MultipleOpenAccordion][]

[MultipleOpenAccordion]: #MultipleOpenAccordion
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
[Chain]: http://www.mootools.net/docs/core/Class/Class.Extras#Chain
