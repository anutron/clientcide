PopupDetail = Class.refactor(PopupDetail, {
	initialize: function(html, options){
		this.previous(html, options.observer, options);
	},
	parseTemplate: function(string, values){
		return string.substitute(values, new RegExp(/\\?%([^%]+)%/g));
	}
});
PopupDetailCollection = new Class({
	Extends: PopupDetailCollection,
	initialize: function(options){
		this.previous(options.observers, options.details, options);
	}
});
var popupDetails = new Class({
	initialize: function(options){
		var pdcOptions = $extend(options,{
				popupDetailOptions: {
					stickyWinOptions: {
						position: $pick(options.observeCorner, 'upperLeft'),
						offset: {
							x: options.offsetx || 0,
							y: options.offsety || 0
						},
						useIframeShim: (options.iframeShimSelector)?true:false
					}
				},
				delayOn: $pick(options.effectDelayOn, 0),
				delayOff: $pick(options.effectDelayOff, 0)
			});
		var pdc = new PopupDetailCollection(pdcOptions);
		return pdc;
	}
});
var popDetailsList = popupDetails;