/*
Script: MooScroller.js

Recreates the standard scrollbar behavior for elements with overflow but using DOM elements so that the scroll bar elements are completely styleable by css.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MooScroller = new Class({
	Implements: [Options, Events],
	options: {
		maxThumbSize: 10,
		mode: 'vertical',
		width: 0, //required only for mode: horizontal
		scrollSteps: 10,
		wheel: true,
		scrollLinks: {
			forward: 'scrollForward',
			back: 'scrollBack'
		},
		hideWhenNoOverflow: true
//		onScroll: $empty,
//		onPage: $empty
	},

	initialize: function(content, knob, options){
		this.setOptions(options);
		this.horz = (this.options.mode == "horizontal");

		this.content = $(content).setStyle('overflow', 'hidden');
		this.knob = $(knob);
		this.track = this.knob.getParent();
		this.setPositions();
		
		if (this.horz && this.options.width) {
			this.wrapper = new Element('div');
			this.content.getChildren().each(function(child){
				this.wrapper.adopt(child);
			}, this);
			this.wrapper.inject(this.content).setStyle('width', this.options.width);
		}
		

		this.bound = {
			'start': this.start.bind(this),
			'end': this.end.bind(this),
			'drag': this.drag.bind(this),
			'wheel': this.wheel.bind(this),
			'page': this.page.bind(this)
		};

		this.position = {};
		this.mouse = {};
		this.update();
		this.attach();
		
		var clearScroll = function (){
			$clear(this.scrolling);
		}.bind(this);
		['forward','back'].each(function(direction) {
			var lnk = $(this.options.scrollLinks[direction]);
			if (lnk) {
				lnk.addEvents({
					mousedown: function() {
						this.scrolling = this[direction].periodical(50, this);
					}.bind(this),
					mouseup: clearScroll.bind(this),
					click: clearScroll.bind(this)
				});
			}
		}, this);
		this.knob.addEvent('click', clearScroll.bind(this));
		window.addEvent('domready', function(){
			try {
				$(document.body).addEvent('mouseup', clearScroll.bind(this));
			}catch(e){}
		}.bind(this));
	},
	setPositions: function(){
		[this.track, this.knob].each(function(el){
			if (el.getStyle('position') == 'static') el.setStyle('position','relative');
		});

	},
	toElement: function(){
		return this.content;
	},
	update: function(){
		var plain = this.horz?'Width':'Height';
		this.contentSize = this.content['offset'+plain];
		this.contentScrollSize = this.content['scroll'+plain];
		this.trackSize = this.track['offset'+plain];

		this.contentRatio = this.contentSize / this.contentScrollSize;

		this.knobSize = (this.trackSize * this.contentRatio).limit(this.options.maxThumbSize, this.trackSize);

		if (this.options.hideWhenNoOverflow) {
			this.hidden = this.knobSize == this.trackSize;
			this.track.setStyle('opacity', this.hidden?0:1);
		}
		
		this.scrollRatio = this.contentScrollSize / this.trackSize;
		this.knob.setStyle(plain.toLowerCase(), this.knobSize);

		this.updateThumbFromContentScroll();
		this.updateContentFromThumbPosition();
	},

	updateContentFromThumbPosition: function(){
		this.content[this.horz?'scrollLeft':'scrollTop'] = this.position.now * this.scrollRatio;
	},

	updateThumbFromContentScroll: function(){
		this.position.now = (this.content[this.horz?'scrollLeft':'scrollTop'] / this.scrollRatio).limit(0, (this.trackSize - this.knobSize));
		this.knob.setStyle(this.horz?'left':'top', this.position.now);
	},

	attach: function(){
		this.knob.addEvent('mousedown', this.bound.start);
		if (this.options.scrollSteps) this.content.addEvent('mousewheel', this.bound.wheel);
		this.track.addEvent('mouseup', this.bound.page);
	},

	wheel: function(event){
		if (this.hidden) return;
		this.scroll(-(event.wheel * this.options.scrollSteps));
		this.updateThumbFromContentScroll();
		event.stop();
	},

	scroll: function(steps){
		steps = steps||this.options.scrollSteps;
		this.content[this.horz?'scrollLeft':'scrollTop'] += steps;
		this.updateThumbFromContentScroll();
		this.fireEvent('onScroll', steps);
	},
	forward: function(steps){
		this.scroll(steps);
	},
	back: function(steps){
		steps = steps||this.options.scrollSteps;
		this.scroll(-steps);
	},

	page: function(event){
		var axis = this.horz?'x':'y';
		var forward = (event.page[axis] > this.knob.getPosition()[axis]);
		this.scroll((forward?1:-1)*this.content['offset'+(this.horz?'Width':'Height')]);
		this.updateThumbFromContentScroll();
		this.fireEvent('onPage', forward);
		event.stop();
	},

	
	start: function(event){
		var axis = this.horz?'x':'y';
		this.mouse.start = event.page[axis];
		this.position.start = this.knob.getStyle(this.horz?'left':'top').toInt();
		document.addEvent('mousemove', this.bound.drag);
		document.addEvent('mouseup', this.bound.end);
		this.knob.addEvent('mouseup', this.bound.end);
		event.stop();
	},

	end: function(event){
		document.removeEvent('mousemove', this.bound.drag);
		document.removeEvent('mouseup', this.bound.end);
		this.knob.removeEvent('mouseup', this.bound.end);
		event.stop();
	},

	drag: function(event){
		var axis = this.horz?'x':'y';
		this.mouse.now = event.page[axis];
		this.position.now = (this.position.start + (this.mouse.now - this.mouse.start)).limit(0, (this.trackSize - this.knobSize));
		this.updateContentFromThumbPosition();
		this.updateThumbFromContentScroll();
		event.stop();
	}

});
