/*
Script: MultipleOpenAccordion.js

Creates a Mootools Fx.Accordion that allows the user to open more than one element.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MultipleOpenAccordion = new Class({
	Implements: [Options, Events, Chain],
	options: {
		togglers: [],
		elements: [],
		openAll: false,
		firstElementsOpen: [0],
		fixedHeight: false,
		fixedWidth: false,
		height: true,
		opacity: true,
		width: false
//	onActive: $empty,
//	onBackground: $empty
	},
	togglers: [],
	elements: [],
	initialize: function(options){
		var args = Array.link(arguments, {options: Object.type, elements: Array.type});
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
		toggler.addEvent('click', this.toggleSection.bind(this, idx));
		var mode;
		if (this.options.height && this.options.width) mode = "both";
		else mode = (this.options.height)?"vertical":"horizontal";
		element.store('reveal', new Fx.Reveal(element, {
			transitionOpacity: this.options.opacity,
			mode: mode,
			heightOverride: this.options.fixedHeight,
			widthOverride: this.options.fixedWidth
		}));
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
		var method = show?'reveal':$defined(show)?'dissolve':'toggle';
		callChain = $pick(callChain, true);
		var el = this.elements[idx];
		if ($pick(useFx, true)) {
			el.retrieve('reveal')[method]().chain(
				this.onComplete.bind(this, [idx, callChain])
			);
		} else {
				if (method == "toggle") el.togglek();
				else el[method == "reveal"?'show':'hide']();
				this.onComplete(idx, callChain);
		}
		return this;
	},
	toggleAll: function(useFx, show){
		var method = show?'reveal':$chk(show)?'disolve':'toggle';
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
