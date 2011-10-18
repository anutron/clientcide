/*
---

name: StickyWin.Fx

description: Extends StickyWin to create popups that fade in and out.

license: MIT-style license.

requires: [More/Class.Refactor, Core/Fx.Tween, StickyWin]

provides: StickyWin.Fx

...
*/
if (!Browser.Engine.trident){
	StickyWin = Class.refactor(StickyWin, {
		options: {
			//fadeTransition: 'sine:in:out',
			fade: true,
			fadeDuration: 150
		},
		hideWin: function(){
			if (this.options.fade) this.fade(0);
			else this.previous();
		},
		showWin: function(){
			if (this.options.fade) this.fade(1);
			else this.previous();
		},
		hide: function(){
			this.previous(this.options.fade);
		},
		show: function(){
			this.previous(this.options.fade);
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
				if (to == 0) {
					this.win.setStyle('display', 'none');
					this.fireEvent('onClose');
				} else {
					this.fireEvent('onDisplay');
				}
			}.bind(this));
			return this;
		}
	});
}
StickyWin.Fx = StickyWin;
