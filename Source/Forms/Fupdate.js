/*
Script: Fupdate.js
	Handles the basic functionality of submitting a form and updating a dom element with the result.

License:
	MIT-style license
*/

var Fupdate;

(function(){

	Fupdate = new Class({

		Implements: [Options, Events, Class.Occlude, Class.ToElement],

		options: {
			//onFailure: $empty,
			//onSuccess: #empty, //aliased to onComplete,
			//onSend: $empty
			requestOptions: {
				evalScripts: true,
				useWaiter: true,
				link: 'ignore'
			},
			extraData: {},
			resetForm: true
		},

		property: 'fupdate',

		initialize: function(form, update, options) {
			this.element = $(form);
			if (this.occlude()) return this.occluded;
			this.update = $(update);
			this.setOptions(options);
			this.makeRequest();
			if (this.options.resetForm) {
				this.request.addEvent('success', function(){
					$try(function(){ $(this).reset(); }.bind(this));
					if (window.OverText) OverText.update();
				}.bind(this));
			}
			this.addFormEvent();
		},

		makeRequest: function(){
			this.request = new Request.HTML($merge({
					url: $(this).get('action'),
					update: this.update,
					emulation: false,
					waiterTarget: $(this),
					method: $(this).get('method') || 'post'
			}, this.options.requestOptions)).addEvents({
				success: function(text, xml){
					['success', 'complete'].each(function(evt){
						this.fireEvent(evt, [this.update, text, xml]);
					}, this);
				}.bind(this),
				failure: function(xhr){
					this.fireEvent('failure', xhr);
				}.bind(this),
				exception: function(){
					this.fireEvent('failure', xhr);
				}.bind(this)
			});
		},

		addFormEvent: function(){
			var fv = $(this).retrieve('validator');
			if (fv) {
				fv.addEvent('onFormValidate', function(valid, form, e) {
					if (valid || !fv.options.stopOnFailure) {
						if (e && e.stop) e.stop();
						this.send();
					}
				}.bind(this));
			} else {
				$(this).addEvent('submit', function(e){
					e.stop();
					this.send();
				}.bind(this));
			}
		},

		send: function(){
			var formData = dedupeQs($(this).toQueryString()).parseQueryString(false, false);
			var data = $H(this.options.extraData).combine(formData);
			this.fireEvent('send', [$(this), data]);
			this.request.send(unescape(data.toQueryString()));
			return this;
		}

	});

	Element.Properties.fupdate = {

		set: function(){
			var opt = Array.link(arguments, {options: Object.type, update: Element.type, updateId: String.type});
			var update = opt.update || opt.updateId;
			var fupdate = this.retrieve('fupdate');
			if (update) {
				if (fupdate) fupdate.update = $(update);
				this.store('fupdate:update', update);
			}
			if (opt.options) {
				if (fupdate) fupdate.setOptions(opt.options);
				this.store('fupdate:options', opt.options)
			}
			return this;
		},

		get: function(){
			var opt = Array.link(arguments, {options: Object.type, update: Element.type, updateId: String.type});
			var update = opt.update || opt.updateId;
			if (opt.options || update || !this.retrieve('fupdate')){
				if (opt.options || !this.retrieve('fupdate:options')) this.set('fupdate', opt.options);
				if (update) this.set('fupdate', update);
				this.store('fupdate', new Fupdate(this, this.retrieve('fupdate:update'), this.retrieve('fupdate:options')));
			}
			return this.retrieve('fupdate');
		}

	};

	Element.implement({

		fupdate: function(update, options){
			this.get('fupdate', update, options).send();
			return this;
		}

	});

	var dedupeQs = function(str){
		var result = $H({});
		str.split("&").each(function(pair){
			var n = pair.indexOf("=");
			result.include(unescape(pair.substring(0, n)), unescape(pair.substring(n+1, pair.length)));
		});
		return result.toQueryString();
	};

})();