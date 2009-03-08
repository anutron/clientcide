Class: SimpleSlideShow {#SimpleSlideShow}
=========================================
Makes a very, very simple slideshow gallery with a collection of DOM elements and previous and next buttons.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/08-layout/04-simpleslideshow

### Implements

* [Options][], [Events][]

### Syntax

	new SimpleSlideShow(options);

### Arguments

1. options - (*options*) a key/value set of options

### Options

* slides - (*array*) a collection of elements already in the DOM to add as slides
* startIndex - (*integer*) the first slide to show
* currentSlideClass - (*string*, optional) class to assign the currently visible slide; defaults to *"currentSlide"*
* currentIndexContainer - (*mixed*) A string of the id for an Element or an Element reference to display the currently shown slide index (i.e. "showing **2** of 3")
* maxContainer - (*mixed*) A string of the id for an Element or an Element reference to display the maximum number of slides available (i.e. "showing 2 of **3**")
* nextLink - (*mixed*, optional) A string of the id for an Element or an Element reference that to capture clicks to show the next slide; if not supplied you'll have to execute [forward][] yourself.
* prevLink - (*mixed*, optional) A string of the id for an Element or an Element reference that to capture clicks to show the previous slide; if not supplied you'll have to execute [back][] yourself.
* wrap - (*boolean*) whether to loop round the slides; ie when the user clicks next at the end of a set, go back to the start (and if they click prev at the begining, go to the end); defaults to *true*
* disabledLinkClass - (*string*) class to add to next/prev links when there are no next or prev slides; defaults to *"disabled"*
* crossFadeOptions - (*object*) options object to be passed to the opacity effects. See [Fx.Tween][]

### Events

* onNext - (*function*) callback for when the user clicks next
* onPrev - (*function*) callback for when the user clicks prev
* onSlideClick - (*function*) callback for when the user clicks a slide; passed the slide clicked and the index of the slide (*element*, *integer*).
* onSlideDisplay - (*function*) callback for when the slide displays (after it fades in); passed the index of the slide displayed.

### Example	
	new SimpleSlideShow({
	  startIndex: 0,
	  slides: $$('.slide'),
	  currentIndexContainer: 'slideNow', //an element or it's id
	  maxContainer: 'slideMax',
	  nextLink: 'nextImg',
	  prevLink: 'prevImg'
	});

SimpleSlideShow Method: forward {#SimpleSlideShow:forward}
----------------------------------------------------------

Shows the next slide.

### Syntax

	mySlideShow.forward();

### Returns

* (*object*) This instance of [SimpleSlideShow][]

### Notes

* if options.wrap is set to *false* this method will not do anything if you're at the end of the slide list.

SimpleSlideShow Method: back {#SimpleSlideShow:back}
----------------------------------------------------

Shows the previous slide.

### Syntax

	mySlideShow.back();

### Returns

* (*object*) This instance of [SimpleSlideShow][]

### Notes

* if options.wrap is set to *false* this method will not do anything if you're at the beginning of the slide list.


SimpleSlideShow Method: show {#SimpleSlideShow:show}
----------------------------------------------------

Shows the specified slide.

### Syntax

	mySlideShow.show(index);

### Arguments

1. index - (*integer*) the index of the slide to display

### Returns

* (*object*) This instance of [SimpleSlideShow][]

Class: SimpleImageSlideShow {#SimpleImageSlideShow}
===================================================

Extends [SimpleSlideShow][] to make a slideshow of images.

### Syntax

	new SimpleImageSlideShow(container[, options]);

### Arguments

1. container - (*mixed*) a DOM Element or its id; the container into which the images are placed.
2. options - (*options*) a key/value set of options

### Options

* all the options in [SimpleSlideShow][]
* imgUrls - (*array*) an array of image urls to add to the DOM and to the slideshow
* imgClass - (*string*) a class to add to the images that get created on the fly

SimpleImageSlideShow Method: addImg {#SimpleImageSlideShow:addImg}
----------------------------------------------------------------

Adds a new image to the slide show.

### Syntax

	mySlideShow.addImg(url);

### Arguments

1. url - (*string*) image url to add to the DOM and to the slideshow

### Returns

* (*object*) This instance of [SimpleImageSlideShow][]

### Notes

* if your images are already in the DOM, just use [SimpleSlideShow][]. All this class does is automates the creation of the image DOM elements from urls to images.

Class: SimpleSlideShow.Carousel {#SimpleSlideShow:Carousel}
===========================================================

Same as [SimpleSlideShow][] except the transition is a horizontal carousel.

### Syntax

	new SimpleSlideShow.Carousel(container[, options]);

### Arguments

1. container - (*mixed*) a DOM Element or its id; the container into which the slides are placed.
2. options - (*options*) a key/value set of options

### Options

* all the options in [SimpleSlideShow][]
* sliderWidth - (*integer*) the width of the container for all the slides - just has to be wider than all the slides width combined; defaults to 999999.

Class: SimpleImageSlideShow.Carousel {#SimpleImageSlideShow:Carousel}
=====================================================================

Extends [SimpleImageSlideShow][] so that it uses the horizontal transition from [SimpleSlideShow.Carousel][].

### Syntax

	new SimpleImageSlideShow.Carousel(container[, options]);

### Arguments

1. container - (*mixed*) a DOM Element or its id; the container into which the images are placed.
2. options - (*options*) a key/value set of options

### Options

* all the options in [SimpleSlideShow][] and [SimpleImageSlideShow][]

[SimpleSlideShow]: #SimpleSlideShow
[SimpleSlideShow.Carousel]: #SimpleSlideShow:Carousel
[forward]: #SimpleSlideShow:forward
[back]: #SimpleSlideShow:back
[SimpleImageSlideShow]: #SimpleImageSlideShow
[addImg]: #SimpleImageSlideShow:addImg
[Options]: http://www.mootools.net/docs/core/Class/Class.Extras#Options
[Events]: http://www.mootools.net/docs/core/Class/Class.Extras#Events
[Fx.Tween]: http://www.mootools.net/docs/core/Fx/Fx.Tween
