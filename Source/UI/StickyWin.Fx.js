/*
Script: StickyWin.Fx.js

	Extends StickyWin to create popups that fade in and out.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

StickyWin.implement({

	options: {
		//fadeTransition: 'sine:in:out',
		fade: true,
		fadeDuration: 150
	},

	initialize: function(){
		this.parentShow = this.show;
		this.show = this.showWin;
		this.parentHide = this.hide;
		this.hide = this.hideWin;
		this.previous.apply(this, arguments);
	},

	hideWin: function(){
		if (this.options.fade) this.fade(0);
		else this.parentHide();
	},

	showWin: function(){
		if (this.options.fade) this.fade(1);
		else this.parentShow();
	},

	fade: function(to){
		if (!this.fadeFx) {
			this.win.setStyles({
				opacity: 0,
				display: 'block'
			});
			var opts = {
				property: 'opacity',
				duration: this.options.fadeDuration
			};
			if (this.options.fadeTransition) opts.transition = this.options.fadeTransition;
			this.fadeFx = new Fx.Tween(this.win, opts);
		}
		if (to > 0) {
			this.win.setStyle('display','block');
			this.position();
		}
		this.fadeFx.clearChain();
		this.fadeFx.start(to).chain(function (){
			if (to == 0) this.parentHide();
			else this.parentShow();
		}.bind(this));
		return this;
	}

});