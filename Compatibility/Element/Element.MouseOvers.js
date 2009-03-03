function imgMouseOverEvents(outString, overString, selector) {
	$$(selector).each(function(el){
		el.autoMouseOvers({
			outString: outString,
			overString: overString
		});
	});
};
window.addEvent('domready', function(){
	imgMouseOverEvents('_off', '_over', 'img.autoMouseOverOff, input.autoMouseOverOff');
	imgMouseOverEvents('_off', '_on', 'img.autoMouseOver, input.autoMouseOver');
});

function tabMouseOvers(cssOn, cssOff, selector, subselector, applyToBoth){
	$$(selector).each(function(el){
		el.autoMouseOvers({
			cssOver: cssOn,
			cssOut: cssOff,
			subSelector: subselector,
			applyToBoth: applyToBoth
		});
	});
};
