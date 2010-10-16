/*
---
script: Form.Validator.Tips

description: Form.Validator using StickyWin.PointyTip.

license: MIT-Style License

requires:
- More/Form.Validator.Inline
- /StickyWin.PointyTip

provides:
- Form.Validator.Tips
...
*/
Form.Validator.Tips = new Class({
	Extends: Form.Validator.Inline,
	options: {
		pointyTipOptions: {
			point: "left",
			width: 250
		},
		tipCaption: ''
	},
	showAdvice: function(className, field){
		var advice = this.getAdvice(field);
		if (advice && !advice.visible){
			advice.show();
			advice.position();
			advice.pointy.positionPointer();
		}
	},
	hideAdvice: function(className, field){
		var advice = this.getAdvice(field);
		if (advice && advice.visible) advice.hide();
	},
	getAdvice: function(className, field) {
		var params = Array.link(arguments, {field: Element.type});
		return params.field.retrieve('PointyTip');
	},
	advices: [],
	makeAdvice: function(className, field, error, warn){
		if (!error && !warn) return;
		var advice = field.retrieve('PointyTip');
		if (!advice){
			var cssClass = warn?'warning-advice':'validation-advice';
			var msg = new Element('ul', {
				styles: {
					margin: 0,
					padding: 0,
					listStyle: 'none'
				}
			});
			var li = this.makeAdviceItem(className, field);
			if (li) msg.adopt(li);
			field.store('validationMsgs', msg);
			advice = new StickyWin.PointyTip(this.options.tipCaption, msg, $merge(this.options.pointyTipOptions, {
				showNow: false,
				relativeTo: field,
				inject: {
					target: this.element
				}
			}));
			this.advices.push(advice);
			advice.msgs = {};
			field.store('PointyTip', advice);
			document.id(advice).addClass(cssClass).set('id', 'advice-'+className+'-'+this.getFieldId(field));			
		}
		field.store('advice-'+className, advice);
		this.appendAdvice(className, field, error, warn);
		advice.pointy.positionPointer();
		return advice;
	},
	validateField: function(field, force){
		var advice = this.getAdvice(field);
		var anyVis = this.advices.some(function(a){ return a.visible; });
		if (anyVis && this.options.serial) {
			if (advice && advice.visible) {
				var passed = this.parent(field, force);
				if (!field.hasClass('validation-failed')) advice.hide();
			}
			return passed;
		}
		var msgs = field.retrieve('validationMsgs');
		if (msgs) msgs.getChildren().hide();
		if ((field.hasClass('validation-failed') || field.hasClass('warning')) && advice) advice.show();
		if (this.options.serial) {
			var fields = this.element.getElements('.validation-failed, .warning');
			if (fields.length) {
				fields.each(function(f, i) {
					var adv = this.getAdvice(f);
					if (adv) adv.hide();
				}, this);
			}
		}
		return this.parent(field, force);
	},
	makeAdviceItem: function(className, field, error, warn){
		if (!error && !warn) return;
		var advice = this.getAdvice(field);
		var errorMsg = this.makeAdviceMsg(field, error, warn);
		if (advice && advice.msgs[className]) return advice.msgs[className].set('html', errorMsg);
		return new Element('li', {
			html: errorMsg,
			style: {
				display: 'none'
			}
		});
	},
	makeAdviceMsg: function(field, error, warn){
		var errorMsg = (warn)?this.warningPrefix:this.errorPrefix;
			errorMsg += (this.options.useTitles) ? field.title || error:error;
		return errorMsg;
	},
	appendAdvice: function(className, field, error, warn) {
		var advice = this.getAdvice(field);
		if (advice.msgs[className]) return advice.msgs[className].set('html', this.makeAdviceMsg(field, error, warn)).show();
		var li = this.makeAdviceItem(className, field, error, warn);
		if (!li) return;
		li.inject(field.retrieve('validationMsgs')).show();
		advice.msgs[className] = li;
	},
	insertAdvice: function(advice, field){
		//Check for error position prop
		var props = field.get('validatorProps');
		//Build advice
		if (!props.msgPos || !document.id(props.msgPos)) {
			switch (field.type.toLowerCase()) {
				case 'radio':
					var p = field.getParent().adopt(advice);
					break;
				default: 
					document.id(advice).inject(document.id(field), 'after');
			};
		} else {
			document.id(props.msgPos).grab(advice);
		}
		advice.position();
	}
});

if (window.FormValidator) FormValidator.Tips = Form.Validator.Tips;