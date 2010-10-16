/*
---

script: StickyWin.js

description: Creates a div within the page with the specified contents at the location relative to the element you specify; basically an in-page popup maker.

license: MIT-Style License

requires:
- Core/DomReady
- Core/Slick.Finder
- More/Element.Position
- More/Class.Binds
- More/Element.Shortcuts
- More/Element.Pin
- More/IframeShim
- /Clientcide
- /StyleWriter

provides:
- StickyWin
- StickyWin.Stacker
...
*/


var StickyWin = new Class({
	Binds: ['destroy', 'hide', 'togglepin', 'esc'],
	Implements: [Options, Events, StyleWriter],
	options: {
//		onDisplay: function(){},
//		onClose: function(){},
//		onDestroy: function(){},
		closeClassName: 'closeSticky',
		pinClassName: 'pinSticky',
		content: '',
		zIndex: 10000,
		className: '',
//		id: ... set above in initialize function
/*  	these are the defaults for Element.position anyway
		************************************************
		edge: false, //see Element.position
		position: 'center', //center, corner == upperLeft, upperRight, bottomLeft, bottomRight
		offset: {x:0,y:0},
		relativeTo: document.body, */
		width: false,
		height: false,
		timeout: -1,
		allowMultipleByClass: true,
		allowMultiple: true,
		showNow: true,
		useIframeShim: true,
		iframeShimSelector: '',
		destroyOnClose: false,
		closeOnClickOut: false,
		closeOnEsc: false,
		getWindowManager: function(){ return StickyWin.WM; }
	},

	css: '.SWclearfix:after {content: "."; display: block; height: 0; clear: both; visibility: hidden;}'+
		 '.SWclearfix {display: inline-table;} * html .SWclearfix {height: 1%;} .SWclearfix {display: block;}',
	
	initialize: function(options){
		this.options.inject = this.options.inject || {
			target: document.body,
			where: 'bottom'
		};
		this.setOptions(options);
		this.windowManager = this.options.getWindowManager();
		this.id = this.options.id || 'StickyWin_'+new Date().getTime();
		this.makeWindow();
		if (this.windowManager) this.windowManager.add(this);

		if (this.options.content) this.setContent(this.options.content);
		if (this.options.timeout > 0) {
			this.addEvent('onDisplay', function(){
				this.hide.delay(this.options.timeout, this);
			}.bind(this));
		}
		//add css for clearfix
		this.createStyle(this.css, 'StickyWinClearFix');
		if (this.options.closeOnClickOut || this.options.closeOnEsc) this.attach();
		if (this.options.destroyOnClose) this.addEvent('close', this.destroy);
		if (this.options.showNow) this.show();
	},
	toElement: function(){
		return this.element;
	},
	attach: function(attach){
		var method = attach != null && attach ? 'addEvents' : 'removeEvents';
		var events = {};
		if (this.options.closeOnClickOut) events.click = this.esc;
		if (this.options.closeOnEsc) events.keyup = this.esc;
		document[method](events);
	},
	esc: function(e) {
		if (e.key == "esc") this.hide();
		if (e.type == "click" && this.element != e.target && !this.element.contains(e.target)) this.hide();
	},
	makeWindow: function(){
		this.destroyOthers();
		if (!document.id(this.id)) {
			this.win = new Element('div', {
				id: this.id
			}).addClass(this.options.className).addClass('StickyWinInstance').addClass('SWclearfix').setStyles({
			 	display: 'none',
				position: 'absolute',
				zIndex: this.options.zIndex
			}).inject(this.options.inject.target, this.options.inject.where).store('StickyWin', this);
		} else this.win = document.id(this.id);
		this.element = this.win;
		if (this.options.width && typeOf(this.options.width.toInt())=="number") this.win.setStyle('width', this.options.width.toInt());
		if (this.options.height && typeOf(this.options.height.toInt())=="number") this.win.setStyle('height', this.options.height.toInt());
		return this;
	},
	show: function(suppressEvent){
		this.showWin();
		if (!suppressEvent) this.fireEvent('display');
		if (this.options.useIframeShim) this.showIframeShim();
		this.visible = true;
		return this;
	},
	showWin: function(){
		if (this.windowManager) this.windowManager.focus(this);
		if (!this.positioned) this.position();
		this.win.show();
	},
	hide: function(suppressEvent){
		if (typeOf(suppressEvent) == "event" || !suppressEvent) this.fireEvent('close');
		this.hideWin();
		if (this.options.useIframeShim) this.hideIframeShim();
		this.visible = false;
		return this;
	},
	hideWin: function(){
		this.win.setStyle('display','none');
	},
	destroyOthers: function() {
		if (!this.options.allowMultipleByClass || !this.options.allowMultiple) {
			$$('div.StickyWinInstance').each(function(sw) {
				if (!this.options.allowMultiple || (!this.options.allowMultipleByClass && sw.hasClass(this.options.className))) 
					sw.retrieve('StickyWin').destroy();
			}, this);
		}
	},
	setContent: function(html) {
		if (this.win.getChildren().length>0) this.win.empty();
		if (typeOf(html) == "string") this.win.set('html', html);
		else if (document.id(html)) this.win.adopt(html);
		this.win.getElements('.'+this.options.closeClassName).each(function(el){
			el.addEvent('click', this.hide);
		}, this);
		this.win.getElements('.'+this.options.pinClassName).each(function(el){
			el.addEvent('click', this.togglepin);
		}, this);
		return this;
	},
	position: function(options){
		this.positioned = true;
		this.setOptions(options);
		this.win.position({
			allowNegative: [this.options.allowNegative, this.options.relativeTo != document.body].pick(),
			relativeTo: this.options.relativeTo,
			position: this.options.position,
			offset: this.options.offset,
			edge: this.options.edge
		});
		if (this.shim) this.shim.position();
		return this;
	},
	pin: function(pin) {
		if (!this.win.pin) {
			dbug.log('you must include element.pin.js!');
			return this;
		}
		this.pinned = pin != null && pin;
		this.win.pin(pin);
		return this;
	},
	unpin: function(){
		return this.pin(false);
	},
	togglepin: function(){
		return this.pin(!this.pinned);
	},
	makeIframeShim: function(){
		if (!this.shim){
			var el = (this.options.iframeShimSelector)?this.win.getElement(this.options.iframeShimSelector):this.win;
			this.shim = new IframeShim(el, {
				display: false,
				name: 'StickyWinShim'
			});
		}
	},
	showIframeShim: function(){
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			this.shim.show();
		}
	},
	hideIframeShim: function(){
		if (this.shim) this.shim.hide();
	},
	destroy: function(){
		this.destroyed = true;
		if (this.windowManager) this.windowManager.remove(this);
		if (this.win) this.win.destroy();
		if (this.options.useIframeShim && this.shim) this.shim.destroy();
		if (document.id('modalOverlay')) document.id('modalOverlay').destroy();
		this.fireEvent('destroy');
	}
});

StickyWin.Stacker = new Class({
	Implements: [Options, Events],
	Binds: ['click'],
	instances: [],
	options: {
		zIndexBase: 9000
	},
	initialize: function(options) {
		this.setOptions(options);
	},
	add: function(sw) {
		this.instances.include(sw);
		$(sw).addEvent('mousedown', this.click);
	},
	click: function(e) {
		this.instances.each(function(sw){
			var el = $(sw);
			if (el == e.target || el.contains($(e.target))) this.focus(sw);
		}, this);
	},
	focus: function(instance){
		if (this.focused == instance) return;
		this.focused = instance;
		if (instance) this.instances.erase(instance).push(instance);
		this.instances.each(function(current, i){
			$(current).setStyle('z-index', this.options.zIndexBase + i);
		}, this);
		this.focused = instance;
	},
	remove: function(sw) {
		this.instances.erase(sw);
		$(sw).removeEvent('click', this.click);
	}
});
StickyWin.WM = new StickyWin.Stacker();