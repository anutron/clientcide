/*
---
script: SimpleCarousel.js

description: Builds a carousel object that manages the basic functions of a generic carousel (a carousel	here being a collection of "slides" that play from one to the next, with a collection of "buttons" that reference each slide).

license: MIT-Style License

requires:
- Core:1.2.4/DomReady
- more:1.2.4.2/Fx.Elements
- more:1.2.4.2/Element.Shortcuts

provides:
- SimpleCarousel

...
*/
var SimpleCarousel = new Class({
	Implements: [Options, Events],
	options: {
//		onRotate: $empty,
//		onStop: $empty,
//		onAutoPlay: $empty,
//		onShowSlide: $empty,
		slideInterval: 4000,
		transitionDuration: 700,
		startIndex: 0,
		buttonOnClass: "selected",
		buttonOffClass: "off",
		rotateAction: "none",
		rotateActionDuration: 100,
		autoplay: true
	},
	initialize: function(container, slides, buttons, options){
		this.container = document.id(container);
		var instance = this.container.retrieve('SimpleCarouselInstance');
		if (instance) return instance;
		this.container.store('SimpleCarouselInstance', this);
		this.setOptions(options);
		this.container.addClass('hasCarousel');
		this.slides = $$(slides);
		this.buttons = $$(buttons);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if (this.options.autoplay) this.autoplay();
		if (this.options.rotateAction != 'none') this.attach(this.options.rotateAction);
		return this;
	},
	toElement: function(){
		return this.container;
	},
	attach: function(action) {
		this.buttons.each(function(el, idx){
			var fn = function() {
				this.slideFx.setOptions(this.slideFx.options, {duration: this.options.rotateActionDuration});
				if (this.currentSlide != idx) this.showSlide(idx);
				this.stop();
			}.bind(this);
			document.id(el).addEvent(action, fn).store('SimpleCarousel:action', fn);
		}, this);
	},
	detach: function(){
		this.buttons.each(function(el, idx){
			var fn = el.retrieve('SimpleCarousel:action');
			if (fn) el.removeEvent(fn).eliminate('SimpleCarousel:action');
		});
		this.container.eliminate('SimpleCarouselInstance');
		return this;
	},
	createFx: function(){
		if (!this.slideFx) this.slideFx = new Fx.Elements(this.slides, {duration: this.options.transitionDuration});
		this.slides.each(function(slide){
			slide.setStyle('opacity',0);
		});
	},
	showSlide: function(slideIndex){
		var action = {};
		this.slides.each(function(slide, index){
			if (index == slideIndex && index != this.currentSlide){ //show
				if (document.id(this.buttons[index])) document.id(this.buttons[index]).swapClass(this.options.buttonOffClass, this.options.buttonOnClass);
				action[index.toString()] = {
					opacity: 1
				};
			} else {
				if (document.id(this.buttons[index])) document.id(this.buttons[index]).swapClass(this.options.buttonOnClass, this.options.buttonOffClass);
				action[index.toString()] = {
					opacity:0
				};
			}
		}, this);
		this.fireEvent('onShowSlide', slideIndex);
		this.currentSlide = slideIndex;
		this.slideFx.start(action);
		return this;
	},
	autoplay: function(){
		this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
		this.fireEvent('onAutoPlay');
		return this;
	},
	stop: function(){
		$clear(this.slideshowInt);
		this.fireEvent('onStop');
		return this;
	},
	rotate: function(){
		var current = this.currentSlide;
		var next = (current+1 >= this.slides.length) ? 0 : current+1;
		this.showSlide(next);
		this.fireEvent('onRotate', next);
		return this;
	}
});