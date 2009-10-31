/*
Script: Waiter.Compat.js

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Waiter = new Class({
	
	Extends: Spinner,
	
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

	render: function(){
		this.parent();
		this.waiterContainer = this.element.set(this.options.containerProps);
		if (this.msgContainer) this.msgContainer = this.content.set(this.options.msgProps);
		
		if (this.options.img) this.waiterImg = document.id(this.options.img.id) || new Element('img', $merge(this.options.img, {
			src: this.options.baseHref + this.options.img.src
		})).inject(this.img);
		this.element.set(this.options.layer);
	},
	place: function(){
		this.inject.apply(this, arguments);
	},
	reset: function(){
		return this.hide();
	},
	start: function(element){
		return this.show();
	},
	stop: function(callback){
		return this.hide();
	}
});

if (window.Request) {
	Request = Class.refactor(Request, {
		options: {
			useWaiter: false,
			waiterOptions: {},
			waiterTarget: false
		},
		initialize: function(options){
			if (options) {
				if (options.useWaiter) options.useSpinner = options.useWaiter;
				if (options.waiterOptions) options.spinnerOptions = options.waiterOptions;
				if (options.waiterTarget) options.spinnerTarget = options.waiterTarget;
			}
			this.previous(options);
		}
	});
}

Element.Properties.waiter = {

	set: function(options){
		return this.set('spinner', options);
	},

	get: function(options){
		return this.get('spinner', options);
	}

};

Element.implement({

	wait: function(options){
		return this.spin(options);
	},
	
	release: function(){
		return this.unspin(options);
	}

});