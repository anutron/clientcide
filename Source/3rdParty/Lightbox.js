/*
Script: Lightbox.js
	A lightbox clone for MooTools.

* Christophe Beyls (http://www.digitalia.be); MIT-style license.
* Inspired by the original Lightbox v2 by Lokesh Dhakar: http://www.huddletogether.com/projects/lightbox2/.
* Refactored by Aaron Newton 

*/
var Lightbox = new Class({
	Implements: [Options, Events],
	Binds: ['click', 'keyboardListener', 'addHtmlElements'],
	options: {
//		anchors: null,
		resizeDuration: 400,
//		resizeTransition: false,	// default transition
		initialWidth: 250,
		initialHeight: 250,
		zIndex: 5000,
		animateCaption: true,
		showCounter: true,
		autoScanLinks: true,
		relString: 'lightbox',
		useDefaultCss: true,
		overlayStyles: {
			'background-color':'#333',
			opacity:0.8
		}
//		onImageShow: $empty,
//		onDisplay: $empty,
//		onHide: $empty
	},

	initialize: function(){
		var args = Array.link(arguments, {options: Object.type, links: Array.type});
		this.setOptions(args.options);
		var anchors = args.links || this.options.anchors;
		if (this.options.autoScanLinks && !anchors) anchors = $$('a[rel^='+this.options.relString+']');
		if (!$$(anchors).length) return; //no links!
		this.addAnchors(anchors);
		if (this.options.useDefaultCss) this.addCss();
		window.addEvent('domready', this.addHtmlElements.bind(this));
	},
		
	anchors: [],
	
	addAnchors: function(anchors){
		$$(anchors).each(function(el){
			if (!el.retrieve('lightbox')) {
				el.store('lightbox', this);
				this.attach(el);
			}
		}.bind(this));
	},
	
	attach: function(el) {		
		el.addEvent('click', this.click.pass(el, this));
		this.anchors.include(el);
	},

	addHtmlElements: function(){
		this.container = new Element('div', {
			'class':'lbContainer'
		}).inject(document.body);
		this.mask = new Mask(document.body, {
			onHide: this.close.bind(this),
			style: this.options.overlayStyles,
			hideOnClick: true
		});
		this.popup = new Element('div', {
			'class':'lbPopup'
		}).inject(this.container);
		this.center = new Element('div', {
			styles: {	
				width: this.options.initialWidth, 
				height: this.options.initialHeight, 
				marginLeft: (-(this.options.initialWidth/2)),
				display: 'none',
				zIndex:this.options.zIndex+1
			}
		}).inject(this.popup).addClass('lbCenter');
		this.image = new Element('div', {
			'class': 'lbImage'
		}).inject(this.center);
		
		this.prevLink = new Element('a', {
			'class': 'lbPrevLink', 
			href: 'javascript:void(0);', 
			styles: {'display': 'none'}
		}).inject(this.image);
		this.nextLink = this.prevLink.clone().removeClass('lbPrevLink').addClass('lbNextLink').inject(this.image);
		this.prevLink.addEvent('click', this.previous.bind(this));
		this.nextLink.addEvent('click', this.next.bind(this));

		this.bottomContainer = new Element('div', {
			'class': 'lbBottomContainer', 
			styles: {
				display: 'none', 
				zIndex:this.options.zIndex+1
		}}).inject(this.popup);
		this.bottom = new Element('div', {'class': 'lbBottom'}).inject(this.bottomContainer);
		new Element('a', {
			'class': 'lbCloseLink', 
			href: 'javascript:void(0);'
		}).inject(this.bottom).addEvent('click', this.close.bind(this));
		this.caption = new Element('div', {'class': 'lbCaption'}).inject(this.bottom);
		this.number = new Element('div', {'class': 'lbNumber'}).inject(this.bottom);
		new Element('div', {'styles': {'clear': 'both'}}).inject(this.bottom);
		var nextEffect = this.nextEffect.bind(this);
		this.fx = {
			resize: new Fx.Morph(this.center, $extend({
				duration: this.options.resizeDuration, 
				onComplete: nextEffect}, 
				this.options.resizeTransition ? {transition: this.options.resizeTransition} : {})),
			image: new Fx.Tween(this.image, {property: 'opacity', duration: 500, onComplete: nextEffect}),
			bottom: new Fx.Tween(this.bottom, {property: 'margin-top', duration: 400, onComplete: nextEffect})
		};

		this.preloadPrev = new Element('img');
		this.preloadNext = new Element('img');
	},
	
	addCss: function(){
		window.addEvent('domready', function(){
			if (document.id('LightboxCss')) return;
			new Element('link', {
				rel: 'stylesheet', 
				media: 'screen', 
				type: 'text/css', 
				href: (this.options.assetBaseUrl || Clientcide.assetLocation + '/slimbox') + '/slimbox.css',
				id: 'LightboxCss'
			}).inject(document.head);
		}.bind(this));
	},

	click: function(el){
		link = document.id(el);
		var rel = link.get('rel')||this.options.relString;
		if (rel == this.options.relString) return this.show(link.get('href'), link.get('title'));

		var j, imageNum, images = [];
		this.anchors.each(function(el){
			if (el.get('rel') == link.get('rel')){
				for (j = 0; j < images.length; j++) {
					if (images[j][0] == el.get('href')) break;
				}
				if (j == images.length){
					images.push([el.get('href'), el.get('title')]);
					if (el.get('href') == link.get('href')) imageNum = j;
				}
			}
		}, this);
		return this.open(images, imageNum);
	},

	show: function(url, title){
		return this.open([[url, title]], 0);
	},

	open: function(images, imageNum){
		this.fireEvent('onDisplay');
		this.images = images;
		this.setup(true);
		this.top = (window.getScroll().y + (window.getSize().y / 15)).toInt();
		this.center.setStyles({
			top: this.top,
			display: ''
		});
		this.mask.show();
		return this.changeImage(imageNum);
	},

	setup: function(open){
		var elements = $$('iframe');
		elements.extend($$(Browser.Engine.trident ? 'select' : 'embed, object'));
		elements.reverse().each(function(el){
			if (open) el.store('lbBackupStyle', el.getStyle('visibility') || 'visible');
			var vis = (open ? 'hidden' : el.retrieve('lbBackupStyle') || 'visible');
			el.setStyle('visibility', vis);
		});
		var fn = open ? 'addEvent' : 'removeEvent';
		document[fn]('keydown', this.keyboardListener);
		this.step = 0;
	},

	keyboardListener: function(event){
		switch (event.code){
			case 27: case 88: case 67: this.close(); break;
			case 37: case 80: this.previous(); break;	
			case 39: case 78: this.next();
		}
	},

	previous: function(){
		return this.changeImage(this.activeImage-1);
	},

	next: function(){
		return this.changeImage(this.activeImage+1);
	},

	changeImage: function(imageNum){
		this.fireEvent('onImageShow', [imageNum, this.images[imageNum]]);
		if (this.step || (imageNum < 0) || (imageNum >= this.images.length)) return false;
		this.step = 1;
		this.activeImage = imageNum;

		this.center.setStyle('backgroundColor', '');
		this.bottomContainer.setStyle('display', 'none');
		this.prevLink.setStyle('display', 'none');
		this.nextLink.setStyle('display', 'none');
		this.fx.image.set(0);
		this.center.addClass('lbLoading');
		this.preload = new Element('img', {
			events: {
				load: function(){
					this.nextEffect.delay(100, this);
				}.bind(this)
			}
		});
		this.preload.set('src', this.images[imageNum][0]);
		return false;
	},

	nextEffect: function(){
		switch (this.step++){
		case 1:
			this.image.setStyle('backgroundImage', 'url('+escape(this.images[this.activeImage][0])+')');
			this.image.setStyle('width', this.preload.width);
			this.bottom.setStyle('width',this.preload.width);
			this.image.setStyle('height', this.preload.height);
			this.prevLink.setStyle('height', this.preload.height);
			this.nextLink.setStyle('height', this.preload.height);

			this.caption.set('html',this.images[this.activeImage][1] || '');
			this.number.set('html',(!this.options.showCounter || (this.images.length == 1)) ? '' : 'Image '+(this.activeImage+1)+' of '+this.images.length);

			if (this.activeImage) document.id(this.preloadPrev).set('src', this.images[this.activeImage-1][0]);
			if (this.activeImage != (this.images.length - 1)) 
				document.id(this.preloadNext).set('src',  this.images[this.activeImage+1][0]);
			if (this.center.clientHeight != this.image.offsetHeight){
				this.fx.resize.start({height: this.image.offsetHeight});
				break;
			}
			this.step++;
		case 2:
			if (this.center.clientWidth != this.image.offsetWidth){
				this.fx.resize.start({width: this.image.offsetWidth, marginLeft: -this.image.offsetWidth/2});
				break;
			}
			this.step++;
		case 3:
			this.bottomContainer.setStyles({
				top: (this.top + this.center.getSize().y), 
				height: 0, 
				marginLeft: this.center.getStyle('margin-left'), 
				display: ''
			});
			this.fx.image.start(1);
			break;
		case 4:
			this.center.style.backgroundColor = '#000';
			if (this.options.animateCaption){
				this.fx.bottom.set(-this.bottom.offsetHeight);
				this.bottomContainer.setStyle('height', '');
				this.fx.bottom.start(0);
				break;
			}
			this.bottomContainer.style.height = '';
		case 5:
			if (this.activeImage) this.prevLink.setStyle('display', '');
			if (this.activeImage != (this.images.length - 1)) this.nextLink.setStyle('display', '');
			this.step = 0;
		}
	},

	close: function(){
		this.fireEvent('onHide');
		if (this.step < 0) return;
		this.step = -1;
		if (this.preload) this.preload.destroy();
		for (var f in this.fx) this.fx[f].cancel();
		this.center.setStyle('display', 'none');
		this.bottomContainer.setStyle('display', 'none');
		this.mask.hide();
		this.setup(false);
		return;
	}
});
window.addEvent('domready', function(){if (document.id(document.body).get('html').match(/rel=?.lightbox/i)) new Lightbox();});
