/*
Script: Waiter.js

Adds a semi-transparent overlay over a dom element with a spinnin ajax icon.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Waiter = new Class({
	Implements: [Options, Events, Chain],
	options: {
		baseHref: 'http://www.cnet.com/html/rb/assets/global/waiter/',
		containerProps: {
			styles: {
				position: 'absolute',
				'text-align': 'center'
			},
			'class':'waiterContainer'
		},
		containerPosition: {},
		msg: false,
		msgProps: {
			styles: {
				'text-align': 'center',
				fontWeight: 'bold'
			},
			'class':'waiterMsg'
		},
		img: {
			src: 'waiter.gif',
			styles: {
				width: 24,
				height: 24
			},
			'class':'waiterImg'
		},
		layer:{
			styles: {
				width: 0,
				height: 0,
				position: 'absolute',
				zIndex: 999,
				display: 'none',
				opacity: 0.9,
				background: '#fff'
			},
			'class': 'waitingDiv'
		},
		useIframeShim: true,
		fxOptions: {},
		injectWhere: null
//	iframeShimOptions: {},
//	onShow: $empty
//	onHide: $empty
	},
	initialize: function(target, options){
		this.target = $(target)||$(document.body);
		this.setOptions(options);
		this.waiterContainer = new Element('div', this.options.containerProps);
		if (this.options.msg) {
			this.msgContainer = new Element('div', this.options.msgProps);
			this.waiterContainer.adopt(this.msgContainer);
			if (!$(this.options.msg)) this.msg = new Element('p').appendText(this.options.msg);
			else this.msg = $(this.options.msg);
			this.msgContainer.adopt(this.msg);
		}
		if (this.options.img) this.waiterImg = $(this.options.img.id) || new Element('img').inject(this.waiterContainer);
		this.waiterOverlay = $(this.options.layer.id) || new Element('div').adopt(this.waiterContainer);
		this.waiterOverlay.set(this.options.layer);
		this.place(target);
		try {
			if (this.options.useIframeShim) this.shim = new IframeShim(this.waiterOverlay, this.options.iframeShimOptions);
		} catch(e) {
			dbug.log("Waiter attempting to use IframeShim but failed; did you include IframeShim? Error: ", e);
			this.options.useIframeShim = false;
		}
		this.waiterFx = this.waiterFx || new Fx.Elements($$(this.waiterContainer, this.waiterOverlay), this.options.fxOptions);
	},
	place: function(target, where){
		var where = where || this.options.injectWhere || target == document.body ? 'inside' : 'after';
		this.waiterOverlay.inject(target, where);
	},
	toggle: function(element, show) {
		//the element or the default
		element = $(element) || $(this.active) || $(this.target);
		this.place(element);
		if (!$(element)) return this;
		if (this.active && element != this.active) return this.stop(this.start.bind(this, element));
		//if it's not active or show is explicit
		//or show is not explicitly set to false
		//start the effect
		if ((!this.active || show) && show !== false) this.start(element);
		//else if it's active and show isn't explicitly set to true
		//stop the effect
		else if (this.active && !show) this.stop();
		return this;
	},
	reset: function(){
		this.waiterFx.cancel().set({
			0: { opacity:[0]},
			1: { opacity:[0]}
		});
	},
	start: function(element){
		this.reset();
		element = $(element) || $(this.target);
		this.place(element);
		if (this.options.img) {
			this.waiterImg.set($merge(this.options.img, {
				src: this.options.baseHref + this.options.img.src
			}));
		}
		
		var start = function() {
			var dim = element.getComputedSize();
			this.active = element;
			this.waiterOverlay.setStyles({
				width: this.options.layer.width||dim.totalWidth,
				height: this.options.layer.height||dim.totalHeight,
				display: 'block'
			}).position({
				relativeTo: element,
				position: 'upperLeft'
			});
			this.waiterContainer.position($merge({
				relativeTo: this.waiterOverlay
			}, this.options.containerPosition));
			if (this.options.useIframeShim) this.shim.show();
			this.waiterFx.start({
				0: { opacity:[1] },
				1: { opacity:[this.options.layer.styles.opacity]}
			}).chain(function(){
				if (this.active == element) this.fireEvent('onShow', element);
				this.callChain();
			}.bind(this));
		}.bind(this);

		if (this.active && this.active != element) this.stop(start);
		else start();
		
		return this;
	},
	stop: function(callback){
		if (!this.active) {
			if ($type(callback) == "function") callback.attempt();
			return this;
		}
		this.waiterFx.cancel();
		this.waiterFx.clearChain();
		//fade the waiter out
		this.waiterFx.start({
			0: { opacity:[0]},
			1: { opacity:[0]}
		}).chain(function(){
			this.active = null;
			this.waiterOverlay.hide();
			if (this.options.useIframeShim) this.shim.hide();
			this.fireEvent('onHide', this.active);
			this.callChain();
			this.clearChain();
			if ($type(callback) == "function") callback.attempt();
		}.bind(this));
		return this;
	}
});

if (typeof Request != "undefined" && Request.HTML) {
	Request.HTML = Class.refactor(Request.HTML, {
		options: {
			useWaiter: false,
			waiterOptions: {},
			waiterTarget: false
		},
		initialize: function(options){
			this._send = this.send;
			this.send = function(options){
				if (this.waiter) this.waiter.start().chain(this._send.bind(this, options));
				else this._send(options);
				return this;
			};
			this.previous(options);
			if (this.options.useWaiter && ($(this.options.update) || $(this.options.waiterTarget))) {
				this.waiter = new Waiter(this.options.waiterTarget || this.options.update, this.options.waiterOptions);
				['onComplete', 'onException', 'onCancel'].each(function(event){
					this.addEvent(event, this.waiter.stop.bind(this.waiter));
				}, this);
			}
		}
	});
}

Element.Properties.waiter = {

	set: function(options){
		var waiter = this.retrieve('waiter');
		return this.eliminate('waiter').store('waiter:options', options);
	},

	get: function(options){
		if (options || !this.retrieve('waiter')){
			if (options || !this.retrieve('waiter:options')) this.set('waiter', options);
			this.store('waiter', new Waiter(this, this.retrieve('waiter:options')));
		}
		return this.retrieve('waiter');
	}

};

Element.implement({

	wait: function(options){
		this.get('waiter', options).start();
		return this;
	},
	
	release: function(){
		var opt = Array.link(arguments, {options: Object.type, callback: Function.type});
		this.get('waiter', opt.options).stop(opt.callback);
		return this;
	}

});