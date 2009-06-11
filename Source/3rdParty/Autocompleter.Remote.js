/**
 * Autocompleter.Remote
 *
 * @version		1.1.1
 *
 * @todo: Caching, no-result handling!
 *
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */

Autocompleter.Ajax = {};

Autocompleter.Ajax.Base = new Class({

	Extends: Autocompleter.Base,

	options: {
		postVar: 'value',
		postData: {},
		ajaxOptions: {},
		onRequest: $empty,
		onComplete: $empty
	},

	initialize: function(element, options) {
		this.parent(element, options);
		var indicator = document.id(this.options.indicator);
		if (indicator) {
			this.addEvents({
				'onRequest': indicator.show.bind(indicator),
				'onComplete': indicator.hide.bind(indicator)
			}, true);
		}
	},

	query: function(){
		var data = $unlink(this.options.postData);
		data[this.options.postVar] = this.queryValue;
		this.fireEvent('onRequest', [this.element, this.request, data, this.queryValue]);
		this.request.send({'data': data});
	},

	/**
	 * queryResponse - abstract
	 *
	 * Inherated classes have to extend this function and use this.parent(resp)
	 *
	 * @param		{String} Response
	 */
	queryResponse: function() {
		this.fireEvent('onComplete', [this.element, this.request, this.response]);
	}

});

Autocompleter.Ajax.Json = new Class({

	Extends: Autocompleter.Ajax.Base,

	initialize: function(el, url, options) {
		this.parent(el, options);
		this.request = new Request.JSON($merge({
			'url': url,
			'link': 'cancel'
		}, this.options.ajaxOptions)).addEvent('onComplete', this.queryResponse.bind(this));
	},

	queryResponse: function(response) {
		this.parent();
		this.update(response);
	}

});

Autocompleter.Ajax.Xhtml = new Class({

	Extends: Autocompleter.Ajax.Base,

	initialize: function(el, url, options) {
		this.parent(el, options);
		this.request = new Request.HTML($merge({
			'url': url,
			'link': 'cancel',
			'update': this.choices
		}, this.options.ajaxOptions)).addEvent('onComplete', this.queryResponse.bind(this));
	},

	queryResponse: function(tree, elements) {
		this.parent();
		if (!elements || !elements.length) {
			this.hideChoices();
		} else {
			this.choices.getChildren(this.options.choicesMatch).each(this.options.injectChoice || function(choice) {
				var value = choice.innerHTML;
				choice.inputValue = value;
				this.addChoiceEvents(choice.set('html', this.markQueryValue(value)));
			}, this);
			this.showChoices();
		}

	}

});
