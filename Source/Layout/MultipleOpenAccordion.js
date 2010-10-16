/*
---
script: MultipleOpenAccordion.js

description: Creates a Mootools Fx.Accordion that allows the user to open more than one element.

license: MIT-Style License

requires:
- Core/Element.Event
- More/Fx.Reveal

provides:
- MultipleOpenAccordion

...
*/
var MultipleOpenAccordion = new Class({
	Implements: [Options, Events, Chain],
	options: {
		togglers: [],
		elements: [],
		openAll: false,
		firstElementsOpen: [0],
		fixedHeight: null,
		fixedWidth: null,
		height: true,
		opacity: true,
		width: false
		//onActive: function(){},
		//onBackground: function(){}
	},
	togglers: [],
	elements: [],
	initialize: function(options){
		var args = Array.link(arguments, {options: Type.isObject, elements: Type.isElements});
		this.setOptions(args.options);
		elements = $$(this.options.elements);
		$$(this.options.togglers).each(function(toggler, idx){
			this.addSection(toggler, elements[idx], idx);
		}, this);
		if (this.togglers.length) {
			if (this.options.openAll) this.showAll();
			else this.toggleSections(this.options.firstElementsOpen, false, true);
		}
		this.openSections = this.showSections.bind(this);
		this.closeSections = this.hideSections.bind(this);
	},
	addSection: function(toggler, element){
		toggler = document.id(toggler);
		element = document.id(element);
		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		this.togglers.include(toggler);
		this.elements.include(element);
		var idx = this.togglers.indexOf(toggler);
		var displayer = this.toggleSection.bind(this, idx);
		toggler.addEvent('click', displayer).store('multipleOpenAccordion:display', displayer);
		var mode;
		if (this.options.height && this.options.width) mode = "both";
		else mode = (this.options.height)?"vertical":"horizontal";
		element.store('moa:reveal', new Fx.Reveal(element, {
			transitionOpacity: this.options.opacity,
			mode: mode,
			heightOverride: this.options.fixedHeight,
			widthOverride: this.options.fixedWidth
		}));
		return this;
	},
	removeSection: function(toggler) {
		var idx = this.togglers.indexOf(toggler);
		var element = this.elements[idx];
		element.dissolve();
		this.togglers.erase(toggler);
		this.elements.erase(element);
		this.detach(toggler);
		return this;
	},
	detach: function(toggler){
		var remove = function(toggler) {
			toggler.removeEvent(this.options.trigger, toggler.retrieve('multipleOpenAccordion:display'));
		}.bind(this);
		if (!toggler) this.togglers.each(remove);
		else remove(toggler);
		return this;
	},
	onComplete: function(idx, callChain){
		this.fireEvent(this.elements[idx].isDisplayed()?'onActive':'onBackground', [this.togglers[idx], this.elements[idx]]);
		this.callChain();
		return this;
	},
	showSection: function(idx, useFx){
		this.toggleSection(idx, useFx, true);
	},
	hideSection: function(idx, useFx){
		this.toggleSection(idx, useFx, false);
	},
	toggleSection: function(idx, useFx, show, callChain){
		var method = show?'reveal':show != null?'dissolve':'toggle';
		callChain = [callChain, true].pick();
		var el = this.elements[idx];
		if (useFx != null ? useFx : true) {
			el.retrieve('moa:reveal')[method]().chain(
				this.onComplete.bind(this, idx, callChain)
			);
		} else {
				if (method == "toggle") el.toggle();
				else el[method == "reveal"?'show':'hide']();
				this.onComplete(idx, callChain);
		}
		return this;
	},
	toggleAll: function(useFx, show){
		var method = show?'reveal':(show!=null)?'disolve':'toggle';
		var last = this.elements.getLast();
		this.elements.each(function(el, idx){
			this.toggleSection(idx, useFx, show, el == last);
		}, this);
		return this;
	},
	toggleSections: function(sections, useFx, show) {
		last = sections.getLast();
		this.elements.each(function(el,idx){
			this.toggleSection(idx, useFx, sections.contains(idx)?show:!show, idx == last);
		}, this);
		return this;
	},
	showSections: function(sections, useFx){
		sections.each(function(i){
			this.showSection(i, useFx);
		}, this);
	},
	hideSections: function(sections, useFx){
		sections.each(function(i){
			this.hideSection(i, useFx);
		}, this);
	},
	showAll: function(useFx){
		return this.toggleAll(useFx, true);
	},
	hideAll: function(useFx){
		return this.toggleAll(useFx, false);
	}
});
