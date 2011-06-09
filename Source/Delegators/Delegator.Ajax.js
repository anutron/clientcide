/*
---
description: Provides functionality for links that load content into a target element via ajax.
provides: [Delegator.Ajax]
requires: [Behavior/Delegator, Core/Request.HTML, More/Spinner]
script: Delegator.Ajax.js
...
*/

(function(){

	Delegator.register('click', 'Ajax', {
		defaults: {
			action: 'injectBottom'
		},
		handler: function(event, link, api){
			var target,
				action = api.get('action'),
				selector = api.get('target');
			if (selector) {
				if (selector == "self") {
					target = element;
				} else {
					target = link.getElement(selector);
				}
			}

			if (!target) api.fail('ajax trigger error: element matching selector %s was not found', selector);

			var requestTarget = new Element('div');

			var spinnerTarget = api.get('spinner-target');
			if (spinnerTarget) spinnerTarget = link.getElement(spinnerTarget);

			event.preventDefault();
			new Request.HTML({
				method: 'get',
				url: api.get('href') || link.get('href'),
				spinnerTarget: spinnerTarget || target,
				filter: api.get('filter'),
				update: requestTarget,
				onSuccess: function(){
					//reverse the elements and inject them
					//reversal is required since it injects each after the target
					//pushing down the previously added element
					var elements = requestTarget.getChildren().reverse();
					switch(action){
						case 'replace':
							elements.injectAfter(target);
							target.destroy();
							break;
						case 'update':
							target.empty();
							elements.inject(target);
							break;
						default:
							//injectTop, injectBottom, injectBefore, injectAfter
							elements[action](target);
					}
					this.fireEvent('ammendDom', [elements]);
				}.bind(this)
			}).send();
		}
	});

})();


