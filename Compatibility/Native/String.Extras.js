String.implement({
	evalScripts: function() {
		this.stripScripts(true);
	},
	urlEncode: function() {
		return (this.test('%'))?this:escape(this);
	},
	replaceAll: function(searchValue, replaceValue, regExOptions) {
		return this.replace(new RegExp(searchValue, $pick(regExOptions,'gi')), replaceValue);
	}
});

Hash.alias('expand', 'substitute');
var simpleTemplateParser = {
		STP: {},
		parseTemplate: function(template, object, regexOptions, wrappers) {
			var STP = this.STP;
			STP.template = template;
			STP.object = object;
			STP.regexOptions = $pick(regexOptions, 'ig');
			STP.wrappers = $pick(wrappers, {before:'%', after:'%'});
			return STP.result = this.runParser(STP.object, STP.template, STP.regexOptions);
		},
		runParser: function(object, string, regexOptions){
			for(value in object){
				switch($type(object[value])){
					case 'string':
						string = this.tmplSubst(value, object[value], string, regexOptions);
						break;
					case 'number':
						string = this.tmplSubst(value, object[value], string, regexOptions);
						break;
					case 'object':
						string = this.runParser(object[value]);
						break;
					case 'array':
						string = this.tmplSubst(value, object[value].toString(), string, regexOptions);
						break;
				}
			}
			return string;
		},
		tmplSubst: function(key, value, string, regexOptions){
			return string.replace(new RegExp(this.STP.wrappers.before+key+this.STP.wrappers.after, 'gi'), value);
		}
	};
