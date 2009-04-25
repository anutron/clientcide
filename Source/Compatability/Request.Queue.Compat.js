Request.Queue = Class.refactor(Request.Queue, {
	initialize: function(options) {
		if (options) {
			$each({
				onRequestStart: 'onRequest', 
				onRequestSuccess: 'onSuccess',
				onRequestComplete: 'onComplete',
				onRequestCancel: 'onCancel',
				onRequestException: 'onException',
				onRequestFailure: 'onFailure'
			}, function(value, key) {
				if (options[key]) options[value] = options[key];
			});
		}
		this.previous(options);
	}
});