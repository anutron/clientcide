/*
Script: IconMenu.js
	Defines IconMenu, a simple icon (img) based menu.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var IconMenu = new Class({
	Implements: [Options, Events],
	options: {
		container: document,
		images: ".iconImgs",
		captions: ".iconCaptions",
		removeLinks: false,
		clearLinks: false,
		useAxis: 'x',
		onFocusDelay: 0,
		initialFocusDelay: 250,
		onBlurDelay: 0,
		length: 'auto',
		iconPadding: 1,
		scrollFxOptions: {
			duration: 1800,
			transition: 'cubic:in:out'
		},
		backScrollButtons: '#scrollLeft',
		forwardScrollButtons: '#scrollRight',
		onSelect: function(index, img){
			img.morph({
					'border-top-color': '#00A0C6',
					'border-left-color': '#00A0C6',
					'border-right-color': '#00A0C6',
					'border-bottom-color': '#00A0C6'
			});
		},
		onDeSelect: function(index, img){
			img.morph({
					'border-top-color': '#555',
					'border-left-color': '#555',
					'border-right-color': '#555',
					'border-bottom-color': '#555'
			});
//		onFocus: $empty, //mouseover of target area
//		onBlur: $empty, //mouseout of target area
//		onEmpty: $empty,
//		onRemoveItem: $empty,
//		onRemoveItems: $empty,
//		onScroll: $empty,
//		onPageForward: $empty,
//		onPageBack: $empty,
		}
	},
	imgs: [],
	selected: [],
	initialize: function(options) {
		//set the options
		this.setOptions(options);
		//save a reference to the container
		this.container = document.id(this.options.container);
		//get the captions from the options
		var captions = ($type(this.options.captions) == "string")
			?this.container.getElements(this.options.captions)
			:this.options.captions;
		//get the images from the options
		var imgs = ($type(this.options.images) == "string")
			?this.container.getElements(this.options.images)
			:this.options.images;
		//loop through each one
		imgs.each(function(img, index) {
			//add it to the menu
			this.addItem(img, captions[index], null);
		}, this);
		
		this.fireEvent('onItemsAdded', this.imgs, 50);
		this.side = (this.options.useAxis == 'x')?'left':'top';
		this.container.setStyle(this.side, this.container.getStyle(this.side).toInt()||0);
		this.onFocusDelay = this.options.initialFocusDelay;
		//set up the events
		this.setupEvents();
	},
	toElement: function(){
		return this.container;
	},
	bound: {
			mouseover: {},
			mouseout: {}
	},
	scrollTo: function(index, useFx){
		//set useFx default to true
		useFx = $pick(useFx, true);
		//get the current range in view
		var currentRange = this.calculateRange();
		//if we're there, exit
		if (index == currentRange.start) return this;
		//get the range for the new position
		var newRange = this.calculateRange(index);
		//if this returns no items, exit
		if (!newRange.elements.length) return this; //no next page! >> Ajax here
		//make sure the container has a position set
		if (this.container.getStyle('position') == 'static') this.container.setStyle('position', 'relative');
		//create the scroll effects if not present already
		if (!this.scrollerFx) 
			this.scrollerFx = new Fx.Tween(this.container, $merge(this.options.scrollFxOptions, {property: this.side, wait: false}));
		//scroll to the new location
		if (useFx) {
			this.scrollerFx.start(-newRange.elements[0].offset).chain(function(){
			//set the index to be this new location
				this.fireEvent('onScroll', [index, newRange]);
			}.bind(this));
		} else {
			//we're not using effects, so just jump to the location
			this.scrollerFx.set(-newRange.elements[0].offset);
			this.fireEvent('onScroll', [index, newRange]);
		}
		this.currentOffset = index;
		return this;
	},
	pageForward: function(howMany){
		var range = this.calculateRange();
		return this.scrollTo(($type(howMany) == "number")?range.start+howMany:range.end);
	},
	pageBack: function(howMany) {
		return this.scrollTo(($type(howMany) == "number")?this.currentOffset-howMany:this.calculateRange(this.currentOffset, true).start);
	},
	addItem: function(img, caption, where) {
		if (caption) {
			img.store('caption', caption);
			caption.store('image', img);
		}
		//figure out where to put it
		where = ($defined(where))?where:this.imgs.length;
		//if we've already got this image in there, remove it before putting it in the right place
		if (this.imgs.contains(img)) this.removeItems([img], true);
		//insert the image and caption into the array of these things
		this.imgs.splice(where, 0, document.id(img));

		//set up the events for the element
		this.setupIconEvents(img, caption);
		this.fireEvent('onAdd', [img, caption]);
		return this;
	},
	removeItems: function(imgs, useFx){
		var range = this.calculateRange();
		if (!imgs.length) return this;;
		//create a copy; this is because
		//IconMenu.empty passes *this.selected*
		//which we modify in the process of removing things
		//so we must work on a copy of that so we don't change
		//the list as we iterate over it
		imgs = $A(imgs);
		//set the fx default
		useFx = $pick(useFx, true);
		//placeholder for the items we're removing; the effect will
		//only be applied to the dom element that contains the image and the caption
		var fadeItems = [];
		var fadeItemImgs = [];
		//the effect we'll use
		var effect = {
				width: 0,
				'border-width':0
		};
		//an object to store all the copies of the effect; one for each item to be passed
		//to Fx.Elements
		var fadeEffects = {};
		//for items that aren't in the current view, we're not going to use a transition
		var itemsToQuietlyRemove = {
			before: [],
			beforeImgs: [],
			after: [],
			afterImgs: []
		};
				
		//a list of all the icons by index
		var indexes = [];
		//for each image in the set to be removed
		imgs.each(function(image){
			var index = this.imgs.indexOf(image);
			//if the image is visible
			if (index >= range.end) {
				itemsToQuietlyRemove.after.push(image.getParent());
				itemsToQuietlyRemove.afterImgs.push(image);
			} else if (index < range.start) {
				itemsToQuietlyRemove.before.push(image.getParent());
				itemsToQuietlyRemove.beforeImgs.push(image);
			} else {
				//store the parent of the image
				fadeItems.push(image.getParent());
				fadeItemImgs.push(image);
				//copy the effect value for this item
				fadeEffects[fadeItems.length-1] = $unlink(effect);
			}
			//remove the reference in the selected array
			//because when it's gone, it won't be selected anymore
			this.selected.erase(image);
			//store the index of where this image was in the menu
			indexes.push(index);
		}, this);
		//for the list of images in the menu that were selected, remove them
		//we didn't do this earlier so we could avoid changing
		//the array while we were working on it
		this.imgs = this.imgs.filter(function(img, index){
			return !indexes.contains(index);
		});
		var removed = [];
		//items page left, remove them, but then we have to update the scroll offset to account
		//for their departure
		if (itemsToQuietlyRemove.before.length) {
			var scrollTo = this.imgs.indexOf(range.elements[0].image);
			itemsToQuietlyRemove.before.each(function(el, index){
				this.fireEvent('onRemoveItem', [el]);
				var img = itemsToQuietlyRemove.beforeImgs[index];
				removed.push(img);
				try {
					el.dispose();
					//scroll to the current offset again quickly
				}catch(e){ dbug.log('before: error removing element %o, %o', el, e); }
			}, this);
			this.scrollTo(scrollTo, false);
		}
		//for items page right, just remove them quickly and quietly
		itemsToQuietlyRemove.after.each(function(el, index){
			this.fireEvent('onRemoveItem', [el]);
			removed.push(itemsToQuietlyRemove.afterImgs[index]);
			try {
				el.dispose(); 
			}catch(e){ dbug.log('after: error removing element %o, %o', el, e); }
		});

		//define a function that removes all the items from the dom
		function clean(range, additionalItems){
			var items = [];
			//then fade out the items that are currently visible
			fadeItems.each(function(el, index){
				this.fireEvent('onRemoveItem', [el]);
				items.push(fadeItemImgs[index]);
				try {
					el.dispose(); 
				}catch(e){ dbug.log('fade: error removing element %o, %o', el, e); }
			}, this);
			items.combine(additionalItems);
			this.fireEvent('onRemoveItems', [items]);
			range = this.calculateRange();
			if (range.elements == 0 && range.start > 0) this.pageBack();
			//if there aren't any items left, fire the onEmpty event
			if (!this.imgs.length) this.fireEvent('onEmpty');
		}
		//if we're using effects, do the transition then call clean()
		if (useFx) new Fx.Elements(fadeItems).start(fadeEffects).chain(clean.bind(this, [range, removed]));
		//else just clean
		else clean.apply(this, [range, removed]);
		return this;
	},
	removeSelected: function(useFx){
		this.removeItems(this.selected, useFx);
		return this;
	},
	empty: function(suppressEvent){
		//placeholder for the effects and items
		var effect = {};
		var items = [];
		//loop through all the images in the icon menu
		this.imgs.each(function(img, index){
			//add the icon container to the list of items to remove
			items.push(img.getParent());
			//create a reference for each one to pass to Fx.Elements
			effect[index] = {opacity: 0};
		});
		//create an instance of Fx.Elements and fade them all out
		new Fx.Elements(items).start(effect).chain(function(){
			//then remove them all instantly
			this.removeItems(this.imgs, false);
			//and fire the onEmpty event
			if (!suppressEvent) this.fireEvent('onEmpty');
		}.bind(this));
		return this;
	},
	selectItem: function(index, select){
		//get the image to select
		var img = this.imgs[index];
		//add or remove the "selected" class
		if ($defined(select)) {
			if (select) img.addClass('selected');
			else img.removeClass('selected');
		} else {
			img.toggleClass('selected');
		}
		//if it has the class, then fade the border blue
		if (img.hasClass('selected')){
			//store this image in the index of selected images
			this.selected.push(img);
			this.fireEvent('select', [index, img]);
		} else {
			//else we're deselecting; remove the image from the index of selected images
			this.selected.erase(img);
			this.fireEvent('onDeSelect', [index, img]);
		}
		return this;
	},
	getDefaultWidth: function(){
		//if the user specified a width, just return it
		if ($type(this.options.length) == "number") return this.options.length;
		//if, on the other hand, they specified another element than the container
		//to calculate the width, use it
		var container = document.id(this.options.length);
		//otherwise, use the container
		if (!container) container = this.container.getParent();
		//return the width or height of that element, depending on the axis chosen in the options
		return container.getSize()[this.options.useAxis];
	},
	getIconPositions: function(){
		var offsets = [];
		var cumulative = 0;
		var prev;
		//loop through all the items
		this.imgs.each(function(img, index){
			//we're measuring the element that contains the image
			var parent = img.getParent();
			//get the width or height of that parent using the appropriate axis
			cumulative += (prev)?img['offset'+this.side.capitalize()] - prev['offset'+this.side.capitalize()]:0;
			prev = img;
			//var size = parent.getSize().size[this.options.useAxis]
			//store the data
			offsets.push({
				image: img,
				size: parent.getSize()[this.options.useAxis],
				offset: cumulative,
				container: parent
			});
		}, this);
		return offsets;
	},
	calculateRange: function(index, fromEnd){
		if (!this.imgs.length) return {start: 0, end: 0, elements: []};
		index = $pick(index, this.currentOffset||0);
		if (index < 0) index = 0;
		//dbug.trace();
		//get the width of space that icons are visible
		var length = this.getDefaultWidth();
		//get the positions of all the icons
		var positions = this.getIconPositions();
		var referencePoint;
		//if we're paginating forward the reference point is the left edge 
		//of the range is the left edge of the first icon
		//but if we're going backwards, the referencePoint is the left edge of the first icon currently in range
		//the problem is if the user removes the entire last page of icons, then this
		//item no longer exists, so...
		if (positions[index]) {
			//if the item exists, use it
			referencePoint = positions[index].offset;
		} else {
			//else the right edge of the last icon is the reference point
			//the last icon is the container of the last image
			var lastIcon = this.imgs.getLast().getParent();
			var coords = lastIcon.getCoordinates();
			//and the reference point is that icon's width plus it's left offset minus the offset 
			//of the parent (which gets offset negatively and positively for scrolling
			referencePoint = coords.width + coords.left - lastIcon.getParent().getPosition().x;
		}
		//figure out which ones are in range
		var range = positions.filter(function(position, i){
			//if the index supplied is the endpoint
			//then it's in range if the index of the icon is less than the index,
			//and the left side is less than that of the one at the end point
			//and if the left side is greater than or equal to the end point's position minus the length
			if (fromEnd) return i < index && 
				position.offset < referencePoint &&
				position.offset >= referencePoint-length;
			
			//else we go forward...
			//if the item is after the index start and the posision is 
			//less than or equal to the max width defined, include it
			else return i >= index && position.offset+position.size <= length+positions[index].offset;
		});
		//return the data
		return (fromEnd)?{start: index-range.length, end: index, elements: range}
					 :{start: index, end: range.length+index, elements: range};
	},
	inRange: function(index) {
		//calculate the range
		var range = this.calculateRange();
		//return the result
		return index < range.end && index >= range.start;
	},
	setupEvents: function(){
		document.id(this.options.container).addEvents({
			"mouseleave": function() {
				if (this.inFocus) this.inFocus = null;
				this.imgOut(null, true);
			}.bind(this)
		});
		
		$$(this.options.backScrollButtons).each(function(el){
			el.addEvents({
				click: this.pageBack.bind(this),
				mouseover: function(){ this.addClass('hover'); },
				mouseout: function(){ this.removeClass('hover'); }
			});
		}, this);
		$$(this.options.forwardScrollButtons).each(function(el){
			el.addEvents({
				click: this.pageForward.bind(this),
				mouseover: function(){ this.addClass('hover'); },
				mouseout: function(){ this.removeClass('hover'); }
			});
		}, this);

		$$(this.options.clearLinks).each(function(el){
			el.addEvent('click', this.empty.bind(this));
		}, this);
		$$(this.options.removeLinks).each(function(el){
			el.addEvent('click', this.removeSelected.bind(this));
		}, this);
	},
	imgOver: function(img){
		//set the value of what's in focus to be this image
		this.inFocus = img;
		//clear the overTimeout
		$clear(this.overTimeout);
		//delay for the duration of the onFocusDelay option
		this.overTimeout = (function(){
			this.onFocusDelay = this.options.onFocusDelay;
			//if the user is still focused on the image, fire the onFocus event
			if (this.inFocus == img) this.fireEvent("onFocus", [img, this.imgs.indexOf(img)]);
		}).delay(this.onFocusDelay, this);
	},
	imgOut: function(img, force){
		if (!$defined(img) && force) img = this.prevFocus||this.imgs[0];
		//if the focused image is this one
		if (this.inFocus == img && img) {
			//set it to null
			this.inFocus = null;
			//clear the delay timeout
			$clear(this.outTimeout);
			//wait the duration of the onBlurDelay
			this.outTimeout = (function(){
				this.prevFocus = img;
				//if we're not still focused on this image, fire onBlur
				if (this.inFocus != img || (img == null && force)) this.fireEvent("onBlur", [img, this.imgs.indexOf(img)]);
				if (!this.inFocus) this.onFocusDelay = this.options.initialFocusDelay;
			}).delay(this.options.onBlurDelay, this);
		}
	},
	setupIconEvents: function(img, caption){
		//add the click event
		img.addEvents({
			click: function(e){
				//if the user is holding down control, select the image
				if (e.control||e.meta) {
					this.selectItem(this.imgs.indexOf(img));
					e.stop();
				}
			}.bind(this)
		});
		img.getParent().addEvents({
			mouseover: this.imgOver.bind(this, img),
			mouseout: this.imgOver.bind(this, img)
		});
	}
});