Class: SimpleCarousel {#SimpleCarousel}
=======================================

Builds a carousel object that manages the basic functions of a generic carousel (a carousel here being a collection of "slides" that play from one to the next, with a collection of "buttons" that reference each slide).

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]: http://www.clientcide.com/wiki/cnet-libraries/08-layout/03-simplecarousel

### Implements

* [Options][], [Events][]

### Syntax

	new SimpleCarousel(container, slides, buttons[, options]);

### Arguments

1. container - (*mixed*) A string of the id for an Element or an Element reference that contains the slides and buttons
2. slides - (*array*) A collection of elements that are meant to crossfade as the slideshow rotates; each must be positioned absolutely on top of the other.
3. buttons - (*array*) A collection of elements that when clicked stop the autoplay animation and show the corresponding slide
4. options - (*options*) a key/value set of options

### Options

* startIndex - (*integer*) the first item to show; default: *0*
* buttonOnClass - (*string*) the class for the "on" state of the buttons; default: *"selected"*
* buttonOffClass - (*string*) the class for the "off" state of the buttons; default: *"off"*
* rotateAction - (*string*) the action the user takes to rotate to the next button; *'mouseover'*, *'click'*, or *'none'*; defaults to *'none'*
* rotateActionDuration - (*integer*) the duration to use when the user interacts with the buttons if rotateAction != "none"; defaults to *100*
* slideInterval - (*integer*) the interval between slide rotations in the slideshow; defaults to *4000*
* transitionDuration - (*integer*) the duration of the transition effect; defaults to *700*
* autoplay -  (*boolean*) whether to start the slide show immediately on instantiation; defaults to *true*

### Events

* onStop - (*function*) callback to execute when the autoplay is stopped
* onAutoPlay - (*function*) callback to execute when autoplay is started
* onRotate - (*function*) callback to execute when the carousel auto-rotates to the next slide; passed the index of the slide shown
* onShowSlide - (*function*) callback to execute when a slide is shown; passed the index of the slide shown

### Examples

	<div id="Carousel">
		<!-- SLIDE #1 -->
		<div class="slide dark">
			...slide stuff goes here...
		</div>
		<!-- SlIDE #2 -->
		...
		<!-- SlIDE #3 -->
		...
		<!-- SlIDE #4 -->
		...
		<div class="button">
			... text or whatever goes here...
		</div>
		<!-- BUTTON #2 -->
		<!-- BUTTON #3 -->
		<!-- BUTTON #4 -->
	</div>

	new SimpleCarousel($('Carousel'), $$('#Carousel div.slide'), $$('#Carousel div.button'), {
		rotateAction: 'click'
	});

### Notes

This class should work for any type of layout, provided that:

*  The carousel is made up of buttons and slides, and there are an equal amount of both;
*  The buttons have an "on state" class and an "off state" class;
*  The slides are "on top" of each other (ie position absolute). This class fades one out and fades another in. It does not create a slide or position	it.
  
SimpleCarousel Method: showSlide {#SimpleCarousel:showSlide}
------------------------------------------------------------

Shows a slide (and hides the others).

### Syntax

	myCarousel.showSlide(index);

### Arguments

1. index - (*integer*) the slide index to show

### Example

	myCarousel.showSlide(0); //shows the first slide

### Returns

* (*object*) This instance of [SimpleCarousel][]

SimpleCarousel Method: autoplay {#SimpleCarousel:autoplay}
------------------------------------------------------------

Turns the autoplay on.

### Syntax

	myCarousel.autoplay();

### Returns

* (*object*) This instance of [SimpleCarousel][]

SimpleCarousel Method: stop {#SimpleCarousel:stop}
------------------------------------------------------------

Turns the autoplay off.

### Syntax

	myCarousel.stop();

### Returns

* (*object*) This instance of [SimpleCarousel][]

SimpleCarousel Method: rotate {#SimpleCarousel:rotate}
------------------------------------------------------------

Rotates one slide forward.

### Syntax

	myCarousel.rotate();

### Returns

* (*object*) This instance of [SimpleCarousel][]

[SimpleCarousel]: #SimpleCarousel
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
