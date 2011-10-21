/*
---
name: Behavior.Tips
description: Attaches Tips.Pointy objects to elements with PointyTip in their data-behavior property and turns elements with HelpTip or InfoTip in their data-filters property into elements which show a Tips.Pointy object which contains their content, on rollover.
provides: [Behavior.Tips]
requires: [Behavior/Behavior, /Tips.Pointy]
script: Behavior.Tips.js
...
*/

(function() {

var createLink = function(element) {
	var isHelp = element.hasBehavior('HelpTip');
	var link = new Element('a', {
		'class': element.get('class'),
		'data-behavior': (isHelp ? 'HelpTip' : 'InfoTip'),
		'html': isHelp ? '?' : 'i'
	}).inject(element, 'after').store('tip:text', element.get('html'));
	//see where that text is supposed to have its pointer and group them by point
	var point = element.getData('help-direction', 1);
	return {point: point, link: link};
};

var createTip = function(link, point) {
	var tip = new Tips.Pointy(link, {
		pointyTipOptions: {
			destroyOnClose: false,
			width: 250,
			point: point.toInt()
		}
	});
	return tip;
};

Behavior.addGlobalFilters({

	PointyTip: function(element){
		var point = element.getData('tip-direction', 12);
		var tip = createTip(element, point);
		//destroy the tips on cleanup
		this.markForCleanup(element, function(){
			tip.destroy();
		});
		return tip;
	},

	//display help tips for users
	HelpTip: function(element) {
		var help = element.hide();
		var link = createLink(help);
		//for each point, create a new instance of Tips.Pointy (clientcide plugin)
		var tip = createTip(link.link, link.point);
		//destroy the tips on cleanup
		this.markForCleanup(element, function(){
			tip.destroy();
		});
		return tip;
	},

	InfoTip: function(element) {
		var info = element.hide();
		var link = createLink(info);
		var tip = createTip(link.link, link.point);
		this.markForCleanup(element, function(){
			tip.destroy();
		});
		return tip;
	}

});

})();
