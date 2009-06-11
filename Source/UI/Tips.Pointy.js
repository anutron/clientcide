/*
Script: Tips.Pointy.js
	Defines Tips.Pointy, An extension to Tips that adds a pointy style to the tip.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Tips.Pointy = new Class({
	Extends: Tips,
	options: {
		onShow: function(tip, stickyWin){
			stickyWin.show();
		},
		onHide: function(tip, stickyWin){
			stickyWin.hide();
		},
		pointyTipOptions: {
			point: 11,
			width: 150,
			pointyOptions: {
				closeButton: false
			}
		}
	},
	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		this.tip = new StickyWin.PointyTip($extend(this.options.pointyTipOptions, {
			showNow: false
		}));
		if (this.options.className) document.id(this.tip).addClass(this.options.className);
		if (params.elements) this.attach(params.elements);
	},
	elementEnter: function(event, element){

		var title = element.retrieve('tip:title');
		var text = element.retrieve('tip:text');
		this.tip.setContent(title, text);

		this.timer = $clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this);

		this.position(element);
	},

	elementLeave: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this);
	},

	elementMove: function(event){
		return; //always fixed
	},

	position: function(element){
		this.tip.setOptions({
			relativeTo: element
		});
		this.tip.position();
	},

	show: function(){
		this.fireEvent('show', [document.id(this.tip), this.tip]);
	},

	hide: function(){
		this.fireEvent('hide', [document.id(this.tip), this.tip]);
	}

});