/*
Script: SimpleSlideShow.js

Makes a very, very simple slideshow gallery with a collection of dom elements and previous and next buttons.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleSlideShow = new Class({
	Implements: [Events, Options, Chain],
	options: {
		startIndex: 0,
		slides: [],
		currentSlideClass: 'currentSlide',
		currentIndexContainer: false,
		maxContainer: false,
		nextLink: false,
		prevLink: false,
		wrap: true,
		disabledLinkClass: 'disabled',
//		onNext: $empty,
//		onPrev: $empty,
//		onSlideClick: $empty,
//		onSlideDisplay: $empty,
		crossFadeOptions: {}
	},
	initialize: function(options){
		this.setOptions(options);
		var slides = this.options.slides;
		this.makeSlides(slides);
		this.setCounters();
		this.setUpNav();
		this.now = this.options.startIndex;
		if (this.slides.length > 0) this.show(this.now);
	},
	slides:[],
	setCounters: function(){
		if (document.id(this.options.currentIndexContainer))document.id(this.options.currentIndexContainer).set('html', this.now+1);
		if (document.id(this.options.maxContainer))document.id(this.options.maxContainer).set('html', this.slides.length);
	},
	makeSlides: function(slides){
		//hide them all
		slides.each(function(slide, index){
			if (index != this.now) slide.setStyle('display', 'none');
			else slide.setStyle('display', 'block');
			this.makeSlide(slide);
		}, this);
	},
	makeSlide: function(slide){
		slide.addEvent('click', function(){ this.fireEvent('onSlideClick'); }.bind(this));
		this.slides.include(slide);
	},
	setUpNav: function(){	
		if (document.id(this.options.nextLink)) {
			document.id(this.options.nextLink).addEvent('click', function(){
				this.forward();
			}.bind(this));
		}
		if (document.id(this.options.prevLink)) {
			document.id(this.options.prevLink).addEvent('click', function(){
				this.back();
			}.bind(this));
		}
	},
	disableLinks: function(now){
		if (this.options.wrap) return;
		now = $pick(now, this.now);
		var prev = document.id(this.options.prevLink);
		var next = document.id(this.options.nextLink);
		var dlc = this.options.disabledLinkClass;
		if (now > 0) {
			if (prev) prev.removeClass(dlc);
			if (now === this.slides.length-1 && next) next.addClass(dlc);
			else if (next) next.removeClass(dlc);
		}	else { //now is zero
			if (this.slides.length > 0 && next) next.removeClass(dlc);
			if (prev) prev.addClass(dlc);
		}
	},
	forward: function(){
		if ($type(this.now) && this.now < this.slides.length-1) this.show(this.now+1);
		else if ($type(this.now) && this.options.wrap) this.show(0);
		else if (!$type(this.now)) this.show(this.options.startIndex);
		this.fireEvent('next');
		return this;
	},
	back: function(){
		if (this.now > 0) {
			this.show(this.now-1);
			this.fireEvent('onPrev');
		} else if (this.options.wrap && this.slides.length > 1) {
			this.show(this.slides.length-1);
			this.fireEvent('prev');
		}
		return this;
	},
	show: function(index){
		if (this.showing) return this.chain(this.show.bind(this, index));
		var now = this.now;
		var s = this.slides[index]; //saving bytes
		function fadeIn(s, resetOpacity){
			s.setStyle('display','block');
			if (!Browser.Engine.trident4) {
				if (resetOpacity) s.setStyle('opacity', 0);
				s.set('tween', this.options.crossFadeOptions).get('tween').start('opacity', 1).chain(function(){
					this.showing = false;
					this.disableLinks();
					this.callChain();
					this.fireEvent('onSlideDisplay', index);
				}.bind(this));
			}
		};
		if (s) {
			if ($type(this.now) && this.now != index){
				if (!Browser.Engine.trident4) {
					var fx = this.slides[this.now].get('tween');
					fx.setOptions(this.options.crossFadeOptions);
					this.showing = true;
					fx.start('opacity', 0).chain(function(){
						this.slides[now].setStyle('display','none');
						s.addClass(this.options.currentSlideClass);
						fadeIn.run([s, true], this);
						this.fireEvent('onSlideDisplay', index);
					}.bind(this));
				} else {
					this.slides[this.now].setStyle('display','none');
					fadeIn.run(s, this);
				}
			} else fadeIn.run(s, this);
			this.now = index;
			this.setCounters();
		}
	},
	slideClick: function(){
		this.fireEvent('onSlideClick', [this.slides[this.now], this.now]);
	}
});

SimpleSlideShow.Carousel = new Class({
	Extends: SimpleSlideShow,
	Implements: [Class.ToElement],
	Binds: ['makeSlide'],
	options: {
		sliderWidth: 999999
	},
	initialize: function(container, options){
		this.setOptions(options);
		this.container = document.id(container);
		this.element = new Element('div').wraps(this.container).setStyles({
			width: this.container.getSize().x,
			overflow: 'hidden',
			position: 'relative'
		});
		this.container.setStyles({
			width: this.options.sliderWidth,
			position: 'relative'
		});
		this.parent(options);
	},
	makeSlides: function(slides) {
		this.slides = [];
		slides.each(this.makeSlide);
	},
	makeSlide: function(slide) {
		if (slide.retrieve('slideSetup')) return;
		slide.store('slideSetup', true);
		slide.show();
		var s = new Element('div', {
			styles: {
				'float': 'left',
				width: document.id(this).getSize().x
			}
		}).wraps(slide);
		this.parent(s);
		this.slides.erase(slide);
		this.setCounters();
		s.show();
		s.inject(this.container);
	},
	show: function(index) {
		if (!this.container) return;
		this.fx = this.fx || new Fx.Tween(this.container.setStyle('left', 0), $merge({
			property: 'left'
		}, this.options.crossFadeOptions));
		if (this.showing) return this.chain(this.show.bind(this, index));
		var now = this.now;
		var s = this.slides[index]; //saving bytes
		if (s) {
			if (this.now != index) {
				this.fx.start(-s.getPosition(this.container).x).chain(function(){
					s.addClass(this.options.currentSlideClass);
					this.showing = false;
					this.disableLinks();
					this.callChain();
					this.fireEvent('onSlideDisplay', index);
				}.bind(this));
			}
			this.now = index;
			this.setCounters();
		}
	}
});

var SimpleImageSlideShow;
(function(){
	var extender = function(extend, passContainer) {
		return {
			Extends: extend,
			Implements: Class.ToElement,
			options: {
				imgUrls: [],
				imgClass: 'screenshot',
				container: false
			},
			initialize: function(){
				var args = Array.link(arguments, {options: Object.type, container: $defined});
				this.container = document.id(args.container) || (args.options?document.id(args.options.container):false); //legacy
				if (passContainer) this.parent(this.container, args.options);
				else this.parent(args.options);
				this.options.imgUrls.each(function(url){
					this.addImg(url);
				}, this);
				this.show(this.options.startIndex);
			},
			addImg: function(url){
				if (this.container) {
					var img = new Element('img', {
						'src': url,
						'id': this.options.imgClass+this.slides.length
					}).addClass(this.options.imgClass).setStyle(
						'display', 'none').inject(this.container).addEvent(
						'click', this.slideClick.bind(this));
					this.slides.push(img);
					this.makeSlide(img);
					this.setCounters();
				}
				return this;
			}
		};
	};
	SimpleImageSlideShow = new Class(extender(SimpleSlideShow));
	SimpleImageSlideShow.Carousel = new Class(extender(SimpleSlideShow.Carousel, true));
})();
