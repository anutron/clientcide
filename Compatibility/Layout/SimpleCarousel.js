var CNETcarousel = new Class({
	Extends: SimpleCarousel,
	options:{
		slidesSelector: ".slide",
		buttonsSelector: ".button"
	},
	initialize: function(container, options){
		this.setOptions(options);
		container = $(container);
		slides = container.getElements(this.options.slidesSelector);
		buttons = container.getElements(this.options.buttonsSelector);
		this.parent(container, slides, buttons, options);
	}
});
var CNETcarouselWithButtons = new Class({
	Extends: SimpleCarousel,
	options: {
		bubbleButtonBGImgSelector: '.bbg',
		buttonOnGifSrc: 'http://i.i.com.com/cnwk.1d/i/fd/c/green_button.gif',
		buttonOffGifSrc: 'http://i.i.com.com/cnwk.1d/i/fd/c/gray_button.gif'
	},
	showSlide: function(slideIndex){
		this.buttons.each(function(button, index){
			$(button).getElement(this.options.bubbleButtonBGImgSelector).src = (index == slideIndex)?this.options.buttonOnGifSrc:this.options.buttonOffGifSrc;
		}, this);
		this.parent(slideIndex);
	}
});
var carousel = null;
window.addEvent('domready', function(){
	if ($('Carousel')) {
		carousel = new CNETcarouselWithButtons($('Carousel'),{buttonsSelector:'.bubble', rotateAction:'mouseover'});
	}
});
