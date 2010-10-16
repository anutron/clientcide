/*
---

scirpt: HoverGroup

description: Manages mousing in and out of multiple objects (think drop-down menus).

license: MIT-Style License

requires:
- Core/Class.Extras
- Core/Element.Event
- More/Class.Binds

provides:
- HoverGroup

...
*/

var HoverGroup = new Class({
	Implements: [Options, Events],
	Binds: ['enter', 'leave', 'remain'],
	options: {
		//onEnter: function(){},
		//onLeave: function(){},
		elements: [],
		delay: 300,
		start: ['mouseenter'],
		remain: [],
		end: ['mouseleave']
	},
	initialize: function(options) {
		this.setOptions(options);
		this.attachTo(this.options.elements);
		this.addEvents({
			leave: function(){
				this.active = false;
			},
			enter: function(){
				this.active = true;
			}
		});
	},
	elements: [],
	attachTo: function(elements, detach){
		var starters = {}, remainers = {}, enders = {};
		elements = Array.from(document.id(elements)||$$(elements));
		this.options.start.each(function(start) {
			starters[start] = this.enter;
		}, this);
		this.options.end.each(function(end) {
			enders[end] = this.leave;
		}, this);
		this.options.remain.each(function(remain){
			remainers[remain] = this.remain;
		}, this);
		if (detach) {
			elements.each(function(el) {
				el.removeEvents(starters).removeEvents(enders).removeEvents(remainers);
				this.elements.erase(el);
			}, this);
		} else {
			elements.each(function(el){
				el.addEvents(starters).addEvents(enders).addEvents(remainers);
			});
			this.elements.combine(elements);
		}
		return this;
	},
	detachFrom: function(elements){
		this.attachTo(elements, true);
	},
	enter: function(e){
		this.isMoused = true;
		this.assert(e);
	},
	leave: function(e){
		this.isMoused = false;
		this.assert(e);
	},
	remain: function(e){
		if (this.active) this.enter(e);
	},
	assert: function(e){
		clearTimeout(this.assertion);
		this.assertion = (function(){
			if (!this.isMoused && this.active) this.fireEvent('leave', e);
			else if (this.isMoused && !this.active) this.fireEvent('enter', e);
		}).delay(this.options.delay, this);
	}
});