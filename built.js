/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2008 [Valerio Proietti](http://mad4milk.net/).

Code & Documentation:
	[The MooTools production team](http://mootools.net/developers/).

Inspiration:
	- Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
	- Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)
*/

var MooTools = {
	'version': '1.2.1',
	'build': 'b81c3f0f58663da610272be48424395bede981fe'
};

var Native = function(options){
	options = options || {};
	var name = options.name;
	var legacy = options.legacy;
	var protect = options.protect;
	var methods = options.implement;
	var generics = options.generics;
	var initialize = options.initialize;
	var afterImplement = options.afterImplement || function(){};
	var object = initialize || legacy;
	generics = generics !== false;

	object.constructor = Native;
	object.$family = {name: 'native'};
	if (legacy && initialize) object.prototype = legacy.prototype;
	object.prototype.constructor = object;

	if (name){
		var family = name.toLowerCase();
		object.prototype.$family = {name: family};
		Native.typize(object, family);
	}

	var add = function(obj, name, method, force){
		if (!protect || force || !obj.prototype[name]) obj.prototype[name] = method;
		if (generics) Native.genericize(obj, name, protect);
		afterImplement.call(obj, name, method);
		return obj;
	};

	object.alias = function(a1, a2, a3){
		if (typeof a1 == 'string'){
			if ((a1 = this.prototype[a1])) return add(this, a2, a1, a3);
		}
		for (var a in a1) this.alias(a, a1[a], a2);
		return this;
	};

	object.implement = function(a1, a2, a3){
		if (typeof a1 == 'string') return add(this, a1, a2, a3);
		for (var p in a1) add(this, p, a1[p], a2);
		return this;
	};

	if (methods) object.implement(methods);

	return object;
};

Native.genericize = function(object, property, check){
	if ((!check || !object[property]) && typeof object.prototype[property] == 'function') object[property] = function(){
		var args = Array.prototype.slice.call(arguments);
		return object.prototype[property].apply(args.shift(), args);
	};
};

Native.implement = function(objects, properties){
	for (var i = 0, l = objects.length; i < l; i++) objects[i].implement(properties);
};

Native.typize = function(object, family){
	if (!object.type) object.type = function(item){
		return ($type(item) === family);
	};
};

(function(){
	var natives = {'Array': Array, 'Date': Date, 'Function': Function, 'Number': Number, 'RegExp': RegExp, 'String': String};
	for (var n in natives) new Native({name: n, initialize: natives[n], protect: true});

	var types = {'boolean': Boolean, 'native': Native, 'object': Object};
	for (var t in types) Native.typize(types[t], t);

	var generics = {
		'Array': ["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"],
		'String': ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"]
	};
	for (var g in generics){
		for (var i = generics[g].length; i--;) Native.genericize(window[g], generics[g][i], true);
	}
})();

var Hash = new Native({

	name: 'Hash',

	initialize: function(object){
		if ($type(object) == 'hash') object = $unlink(object.getClean());
		for (var key in object) this[key] = object[key];
		return this;
	}

});

Hash.implement({

	forEach: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key)) fn.call(bind, this[key], key, this);
		}
	},

	getClean: function(){
		var clean = {};
		for (var key in this){
			if (this.hasOwnProperty(key)) clean[key] = this[key];
		}
		return clean;
	},

	getLength: function(){
		var length = 0;
		for (var key in this){
			if (this.hasOwnProperty(key)) length++;
		}
		return length;
	}

});

Hash.alias('forEach', 'each');

Array.implement({

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
	}

});

Array.alias('forEach', 'each');

function $A(iterable){
	if (iterable.item){
		var l = iterable.length, array = new Array(l);
		while (l--) array[l] = iterable[l];
		return array;
	}
	return Array.prototype.slice.call(iterable);
};

function $arguments(i){
	return function(){
		return arguments[i];
	};
};

function $chk(obj){
	return !!(obj || obj === 0);
};

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

function $defined(obj){
	return (obj != undefined);
};

function $each(iterable, fn, bind){
	var type = $type(iterable);
	((type == 'arguments' || type == 'collection' || type == 'array') ? Array : Hash).each(iterable, fn, bind);
};

function $empty(){};

function $extend(original, extended){
	for (var key in (extended || {})) original[key] = extended[key];
	return original;
};

function $H(object){
	return new Hash(object);
};

function $lambda(value){
	return (typeof value == 'function') ? value : function(){
		return value;
	};
};

function $merge(){
	var args = Array.slice(arguments);
	args.unshift({});
	return $mixin.apply(null, args);
};

function $mixin(mix){
	for (var i = 1, l = arguments.length; i < l; i++){
		var object = arguments[i];
		if ($type(object) != 'object') continue;
		for (var key in object){
			var op = object[key], mp = mix[key];
			mix[key] = (mp && $type(op) == 'object' && $type(mp) == 'object') ? $mixin(mp, op) : $unlink(op);
		}
	}
	return mix;
};

function $pick(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != undefined) return arguments[i];
	}
	return null;
};

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function $splat(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};

var $time = Date.now || function(){
	return +new Date;
};

function $try(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return null;
};

function $type(obj){
	if (obj == undefined) return false;
	if (obj.$family) return (obj.$family.name == 'number' && !isFinite(obj)) ? false : obj.$family.name;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		if (obj.callee) return 'arguments';
		else if (obj.item) return 'collection';
	}
	return typeof obj;
};

function $unlink(object){
	var unlinked;
	switch ($type(object)){
		case 'object':
			unlinked = {};
			for (var p in object) unlinked[p] = $unlink(object[p]);
		break;
		case 'hash':
			unlinked = new Hash(object);
		break;
		case 'array':
			unlinked = [];
			for (var i = 0, l = object.length; i < l; i++) unlinked[i] = $unlink(object[i]);
		break;
		default: return object;
	}
	return unlinked;
};

/*
Script: Number.js
	Contains Number Prototypes like limit, round, times, and ceil.

License:
	MIT-style license.
*/

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('times', 'each');

(function(math){
	var methods = {};
	math.each(function(name){
		if (!Number[name]) methods[name] = function(){
			return Math[name].apply(null, [this].concat($A(arguments)));
		};
	});
	Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);

/*
Script: Hash.js
	Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.

License:
	MIT-style license.
*/

Hash.implement({

	has: Object.prototype.hasOwnProperty,

	keyOf: function(value){
		for (var key in this){
			if (this.hasOwnProperty(key) && this[key] === value) return key;
		}
		return null;
	},

	hasValue: function(value){
		return (Hash.keyOf(this, value) !== null);
	},

	extend: function(properties){
		Hash.each(properties, function(value, key){
			Hash.set(this, key, value);
		}, this);
		return this;
	},

	combine: function(properties){
		Hash.each(properties, function(value, key){
			Hash.include(this, key, value);
		}, this);
		return this;
	},

	erase: function(key){
		if (this.hasOwnProperty(key)) delete this[key];
		return this;
	},

	get: function(key){
		return (this.hasOwnProperty(key)) ? this[key] : null;
	},

	set: function(key, value){
		if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
		return this;
	},

	empty: function(){
		Hash.each(this, function(value, key){
			delete this[key];
		}, this);
		return this;
	},

	include: function(key, value){
		if (this[key] == undefined) this[key] = value;
		return this;
	},

	map: function(fn, bind){
		var results = new Hash;
		Hash.each(this, function(value, key){
			results.set(key, fn.call(bind, value, key, this));
		}, this);
		return results;
	},

	filter: function(fn, bind){
		var results = new Hash;
		Hash.each(this, function(value, key){
			if (fn.call(bind, value, key, this)) results.set(key, value);
		}, this);
		return results;
	},

	every: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key) && !fn.call(bind, this[key], key)) return false;
		}
		return true;
	},

	some: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key) && fn.call(bind, this[key], key)) return true;
		}
		return false;
	},

	getKeys: function(){
		var keys = [];
		Hash.each(this, function(value, key){
			keys.push(key);
		});
		return keys;
	},

	getValues: function(){
		var values = [];
		Hash.each(this, function(value){
			values.push(value);
		});
		return values;
	},

	toQueryString: function(base){
		var queryString = [];
		Hash.each(this, function(value, key){
			if (base) key = base + '[' + key + ']';
			var result;
			switch ($type(value)){
				case 'object': result = Hash.toQueryString(value, key); break;
				case 'array':
					var qs = {};
					value.each(function(val, i){
						qs[i] = val;
					});
					result = Hash.toQueryString(qs, key);
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value != undefined) queryString.push(result);
		});

		return queryString.join('&');
	}

});

Hash.alias({keyOf: 'indexOf', hasValue: 'contains'});

/*
Script: Array.js
	Contains Array Prototypes like each, contains, and erase.

License:
	MIT-style license.
*/

Array.implement({

	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	clean: function() {
		return this.filter($defined);
	},

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	extend: function(array){
		for (var i = 0, j = array.length; i < j; i++) this.push(array[i]);
		return this;
	},
	
	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[$random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--; i){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = $type(this[i]);
			if (!type) continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments') ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return value.toInt(16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});

/*
Script: Function.js
	Contains Function Prototypes like create, bind, pass, and delay.

License:
	MIT-style license.
*/

Function.implement({

	extend: function(properties){
		for (var property in properties) this[property] = properties[property];
		return this;
	},

	create: function(options){
		var self = this;
		options = options || {};
		return function(event){
			var args = options.arguments;
			args = (args != undefined) ? $splat(args) : Array.slice(arguments, (options.event) ? 1 : 0);
			if (options.event) args = [event || window.event].extend(args);
			var returns = function(){
				return self.apply(options.bind || null, args);
			};
			if (options.delay) return setTimeout(returns, options.delay);
			if (options.periodical) return setInterval(returns, options.periodical);
			if (options.attempt) return $try(returns);
			return returns();
		};
	},

	run: function(args, bind){
		return this.apply(bind, $splat(args));
	},

	pass: function(args, bind){
		return this.create({bind: bind, arguments: args});
	},

	bind: function(bind, args){
		return this.create({bind: bind, arguments: args});
	},

	bindWithEvent: function(bind, args){
		return this.create({bind: bind, arguments: args, event: true});
	},

	attempt: function(args, bind){
		return this.create({bind: bind, arguments: args, attempt: true})();
	},

	delay: function(delay, bind, args){
		return this.create({bind: bind, arguments: args, delay: delay})();
	},

	periodical: function(periodical, bind, args){
		return this.create({bind: bind, arguments: args, periodical: periodical})();
	}

});

/*
Script: Browser.js
	The Browser Core. Contains Browser initialization, Window and Document, and the Browser Hash.

License:
	MIT-style license.
*/

var Browser = $merge({

	Engine: {name: 'unknown', version: 0},

	Platform: {name: (window.orientation != undefined) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()},

	Features: {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)},

	Plugins: {},

	Engines: {

		presto: function(){
			return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
		},

		trident: function(){
			return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? 5 : 4);
		},

		webkit: function(){
			return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
		},

		gecko: function(){
			return (document.getBoxObjectFor == undefined) ? false : ((document.getElementsByClassName) ? 19 : 18);
		}

	}

}, Browser || {});

Browser.Platform[Browser.Platform.name] = true;

Browser.detect = function(){

	for (var engine in this.Engines){
		var version = this.Engines[engine]();
		if (version){
			this.Engine = {name: engine, version: version};
			this.Engine[engine] = this.Engine[engine + version] = true;
			break;
		}
	}

	return {name: engine, version: version};

};

Browser.detect();

Browser.Request = function(){
	return $try(function(){
		return new XMLHttpRequest();
	}, function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	});
};

Browser.Features.xhr = !!(Browser.Request());

Browser.Plugins.Flash = (function(){
	var version = ($try(function(){
		return navigator.plugins['Shockwave Flash'].description;
	}, function(){
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	}) || '0 r0').match(/\d+/g);
	return {version: parseInt(version[0] || 0 + '.' + version[1], 10) || 0, build: parseInt(version[2], 10) || 0};
})();

function $exec(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script[(Browser.Engine.webkit && Browser.Engine.version < 420) ? 'innerText' : 'text'] = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;
};

Native.UID = 1;

var $uid = (Browser.Engine.trident) ? function(item){
	return (item.uid || (item.uid = [Native.UID++]))[0];
} : function(item){
	return item.uid || (item.uid = Native.UID++);
};

var Window = new Native({

	name: 'Window',

	legacy: (Browser.Engine.trident) ? null: window.Window,

	initialize: function(win){
		$uid(win);
		if (!win.Element){
			win.Element = $empty;
			if (Browser.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
			win.Element.prototype = (Browser.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
		}
		win.document.window = win;
		return $extend(win, Window.Prototype);
	},

	afterImplement: function(property, value){
		window[property] = Window.Prototype[property] = value;
	}

});

Window.Prototype = {$family: {name: 'window'}};

new Window(window);

var Document = new Native({

	name: 'Document',

	legacy: (Browser.Engine.trident) ? null: window.Document,

	initialize: function(doc){
		$uid(doc);
		doc.head = doc.getElementsByTagName('head')[0];
		doc.html = doc.getElementsByTagName('html')[0];
		if (Browser.Engine.trident && Browser.Engine.version <= 4) $try(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		if (Browser.Engine.trident) doc.window.attachEvent('onunload', function() {
			doc.window.detachEvent('onunload', arguments.callee);
			doc.head = doc.html = doc.window = null;
		});
		return $extend(doc, Document.Prototype);
	},

	afterImplement: function(property, value){
		document[property] = Document.Prototype[property] = value;
	}

});

Document.Prototype = {$family: {name: 'document'}};

new Document(document);

/*
Script: String.js
	Contains String Prototypes like camelCase, capitalize, test, and toInt.

License:
	MIT-style license.
*/

String.implement({

	test: function(regex, params){
		return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(this);
	},

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	stripScripts: function(option){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
			scripts += arguments[1] + '\n';
			return '';
		});
		if (option === true) $exec(scripts);
		else if ($type(option) == 'function') option(scripts, text);
		return text;
	},

	substitute: function(object, regexp){
		return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ? object[name] : '';
		});
	}

});

/*
Script: Event.js
	Contains the Event Native, to make the event object completely crossbrowser.

License:
	MIT-style license.
*/

var Event = new Native({

	name: 'Event',

	initialize: function(event, win){
		win = win || window;
		var doc = win.document;
		event = event || win.event;
		if (event.$extended) return event;
		this.$extended = true;
		var type = event.type;
		var target = event.target || event.srcElement;
		while (target && target.nodeType == 3) target = target.parentNode;

		if (type.test(/key/)){
			var code = event.which || event.keyCode;
			var key = Event.Keys.keyOf(code);
			if (type == 'keydown'){
				var fKey = code - 111;
				if (fKey > 0 && fKey < 13) key = 'f' + fKey;
			}
			key = key || String.fromCharCode(code).toLowerCase();
		} else if (type.match(/(click|mouse|menu)/i)){
			doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
			var page = {
				x: event.pageX || event.clientX + doc.scrollLeft,
				y: event.pageY || event.clientY + doc.scrollTop
			};
			var client = {
				x: (event.pageX) ? event.pageX - win.pageXOffset : event.clientX,
				y: (event.pageY) ? event.pageY - win.pageYOffset : event.clientY
			};
			if (type.match(/DOMMouseScroll|mousewheel/)){
				var wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
			}
			var rightClick = (event.which == 3) || (event.button == 2);
			var related = null;
			if (type.match(/over|out/)){
				switch (type){
					case 'mouseover': related = event.relatedTarget || event.fromElement; break;
					case 'mouseout': related = event.relatedTarget || event.toElement;
				}
				if (!(function(){
					while (related && related.nodeType == 3) related = related.parentNode;
					return true;
				}).create({attempt: Browser.Engine.gecko})()) related = false;
			}
		}

		return $extend(this, {
			event: event,
			type: type,

			page: page,
			client: client,
			rightClick: rightClick,

			wheel: wheel,

			relatedTarget: related,
			target: target,

			code: code,
			key: key,

			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey
		});
	}

});

Event.Keys = new Hash({
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
});

Event.implement({

	stop: function(){
		return this.stopPropagation().preventDefault();
	},

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	}

});

/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

function Class(params){
	
	if (params instanceof Function) params = {initialize: params};
	
	var newClass = function(){
		Object.reset(this);
		if (newClass._prototyping) return this;
		this._current = $empty;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		delete this._current; delete this.caller;
		return value;
	}.extend(this);
	
	newClass.implement(params);
	
	newClass.constructor = Class;
	newClass.prototype.constructor = newClass;

	return newClass;

};

Function.prototype.protect = function(){
	this._protected = true;
	return this;
};

Object.reset = function(object, key){
		
	if (key == null){
		for (var p in object) Object.reset(object, p);
		return object;
	}
	
	delete object[key];
	
	switch ($type(object[key])){
		case 'object':
			var F = function(){};
			F.prototype = object[key];
			var i = new F;
			object[key] = Object.reset(i);
		break;
		case 'array': object[key] = $unlink(object[key]); break;
	}
	
	return object;
	
};

new Native({name: 'Class', initialize: Class}).extend({

	instantiate: function(F){
		F._prototyping = true;
		var proto = new F;
		delete F._prototyping;
		return proto;
	},
	
	wrap: function(self, key, method){
		method = method._origin || method;
		
		return function(){
			if (method._protected && this._current == null) throw new Error('The method "' + key + '" cannot be called.');
			var caller = this.caller, current = this._current;
			this.caller = current; this._current = arguments.callee;
			var result = method.apply(this, arguments);
			this._current = current; this.caller = caller;
			return result;
		}.extend({_owner: self, _origin: method, _name: key});

	}
	
});

Class.implement({
	
	implement: function(key, value){
		
		if ($type(key) == 'object'){
			for (var p in key) this.implement(p, key[p]);
			return this;
		}
		
		var mutator = Class.Mutators[key];
		
		if (mutator){
			value = mutator.call(this, value);
			if (value == null) return this;
		}
		
		var proto = this.prototype;

		switch ($type(value)){
			
			case 'function':
				if (value._hidden) return this;
				proto[key] = Class.wrap(this, key, value);
			break;
			
			case 'object':
				var previous = proto[key];
				if ($type(previous) == 'object') $mixin(previous, value);
				else proto[key] = $unlink(value);
			break;
			
			case 'array':
				proto[key] = $unlink(value);
			break;
			
			default: proto[key] = value;

		}
		
		return this;

	}
	
});

Class.Mutators = {
	
	Extends: function(parent){

		this.parent = parent;
		this.prototype = Class.instantiate(parent);

		this.implement('parent', function(){
			var name = this.caller._name, previous = this.caller._owner.parent.prototype[name];
			if (!previous) throw new Error('The method "' + name + '" has no parent.');
			return previous.apply(this, arguments);
		}.protect());

	},

	Implements: function(items){
		$splat(items).each(function(item){
			if (item instanceof Function) item = Class.instantiate(item);
			this.implement(item);
		}, this);

	}
	
};

/*
Script: Class.Extras.js
	Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

License:
	MIT-style license.
*/

var Chain = new Class({

	$chain: [],

	chain: function(){
		this.$chain.extend(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this.$chain.empty();
		return this;
	}

});

var Events = new Class({

	$events: {},

	addEvent: function(type, fn, internal){
		type = Events.removeOn(type);
		if (fn != $empty){
			this.$events[type] = this.$events[type] || [];
			this.$events[type].include(fn);
			if (internal) fn.internal = true;
		}
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = Events.removeOn(type);
		if (!this.$events || !this.$events[type]) return this;
		this.$events[type].each(function(fn){
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = Events.removeOn(type);
		if (!this.$events[type]) return this;
		if (!fn.internal) this.$events[type].erase(fn);
		return this;
	},

	removeEvents: function(events){
		if ($type(events) == 'object'){
			for (var type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = Events.removeOn(events);
		for (var type in this.$events){
			if (events && events != type) continue;
			var fns = this.$events[type];
			for (var i = fns.length; i--; i) this.removeEvent(type, fns[i]);
		}
		return this;
	}

});

Events.removeOn = function(string){
	return string.replace(/^on([A-Z])/, function(full, first) {
		return first.toLowerCase();
	});
};

var Options = new Class({

	setOptions: function(){
		this.options = $merge.run([this.options].extend(arguments));
		if (!this.addEvent) return this;
		for (var option in this.options){
			if ($type(this.options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, this.options[option]);
			delete this.options[option];
		}
		return this;
	}

});

/*
Script: Fx.js
	Contains the basic animation logic to be extended by all other Fx Classes.

License:
	MIT-style license.
*/

var Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onStart: $empty,
		onCancel: $empty,
		onComplete: $empty,
		*/
		fps: 50,
		unit: false,
		duration: 500,
		link: 'ignore'
	},

	initialize: function(options){
		this.subject = this.subject || this;
		this.setOptions(options);
		this.options.duration = Fx.Durations[this.options.duration] || this.options.duration.toInt();
		var wait = this.options.wait;
		if (wait === false) this.options.link = 'cancel';
	},

	getTransition: function(){
		return function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function(){
		var time = $time();
		if (time < this.time + this.options.duration){
			var delta = this.transition((time - this.time) / this.options.duration);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},

	set: function(now){
		return now;
	},

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	check: function(){
		if (!this.timer) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.transition = this.getTransition();
		this.startTimer();
		this.onStart();
		return this;
	},

	complete: function(){
		if (this.stopTimer()) this.onComplete();
		return this;
	},

	cancel: function(){
		if (this.stopTimer()) this.onCancel();
		return this;
	},

	onStart: function(){
		this.fireEvent('start', this.subject);
	},

	onComplete: function(){
		this.fireEvent('complete', this.subject);
		if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
	},

	onCancel: function(){
		this.fireEvent('cancel', this.subject).clearChain();
	},

	pause: function(){
		this.stopTimer();
		return this;
	},

	resume: function(){
		this.startTimer();
		return this;
	},

	stopTimer: function(){
		if (!this.timer) return false;
		this.time = $time() - this.time;
		this.timer = $clear(this.timer);
		return true;
	},

	startTimer: function(){
		if (this.timer) return false;
		this.time = $time() - this.time;
		this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
		return true;
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

/*
Script: Element.js
	One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser,
	time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
*/

var Element = new Native({

	name: 'Element',

	legacy: window.Element,

	initialize: function(tag, props){
		var konstructor = Element.Constructors.get(tag);
		if (konstructor) return konstructor(props);
		if (typeof tag == 'string') return document.newElement(tag, props);
		return $(tag).set(props);
	},

	afterImplement: function(key, value){
		Element.Prototype[key] = value;
		if (Array[key]) return;
		Elements.implement(key, function(){
			var items = [], elements = true;
			for (var i = 0, j = this.length; i < j; i++){
				var returns = this[i][key].apply(this[i], arguments);
				items.push(returns);
				if (elements) elements = ($type(returns) == 'element');
			}
			return (elements) ? new Elements(items) : items;
		});
	}

});

Element.Prototype = {$family: {name: 'element'}};

Element.Constructors = new Hash;

var IFrame = new Native({

	name: 'IFrame',

	generics: false,

	initialize: function(){
		var params = Array.link(arguments, {properties: Object.type, iframe: $defined});
		var props = params.properties || {};
		var iframe = $(params.iframe) || false;
		var onload = props.onload || $empty;
		delete props.onload;
		props.id = props.name = $pick(props.id, props.name, iframe.id, iframe.name, 'IFrame_' + $time());
		iframe = new Element(iframe || 'iframe', props);
		var onFrameLoad = function(){
			var host = $try(function(){
				return iframe.contentWindow.location.host;
			});
			if (host && host == window.location.host){
				var win = new Window(iframe.contentWindow);
				new Document(iframe.contentWindow.document);
				$extend(win.Element.prototype, Element.Prototype);
			}
			onload.call(iframe.contentWindow, iframe.contentWindow.document);
		};
		(window.frames[props.id]) ? onFrameLoad() : iframe.addListener('load', onFrameLoad);
		return iframe;
	}

});

var Elements = new Native({

	initialize: function(elements, options){
		options = $extend({ddup: true, cash: true}, options);
		elements = elements || [];
		if (options.ddup || options.cash){
			var uniques = {}, returned = [];
			for (var i = 0, l = elements.length; i < l; i++){
				var el = $.element(elements[i], !options.cash);
				if (options.ddup){
					if (uniques[el.uid]) continue;
					uniques[el.uid] = true;
				}
				returned.push(el);
			}
			elements = returned;
		}
		return (options.cash) ? $extend(elements, this) : elements;
	}

});

Elements.implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeof filter == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}

});

Document.implement({

	newElement: function(tag, props){
		if (Browser.Engine.trident && props){
			['name', 'type', 'checked'].each(function(attribute){
				if (!props[attribute]) return;
				tag += ' ' + attribute + '="' + props[attribute] + '"';
				if (attribute != 'checked') delete props[attribute];
			});
			tag = '<' + tag + '>';
		}
		return $.element(this.createElement(tag)).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
	},

	getDocument: function(){
		return this;
	},

	getWindow: function(){
		return this.window;
	}

});

Window.implement({

	$: function(el, nocash){
		if (el && el.$family && el.uid) return el;
		var type = $type(el);
		return ($[type]) ? $[type](el, nocash, this.document) : null;
	},

	$$: function(selector){
		if (arguments.length == 1 && typeof selector == 'string') return this.document.getElements(selector);
		var elements = [];
		var args = Array.flatten(arguments);
		for (var i = 0, l = args.length; i < l; i++){
			var item = args[i];
			switch ($type(item)){
				case 'element': elements.push(item); break;
				case 'string': elements.extend(this.document.getElements(item, true));
			}
		}
		return new Elements(elements);
	},

	getDocument: function(){
		return this.document;
	},

	getWindow: function(){
		return this;
	}

});

$.string = function(id, nocash, doc){
	id = doc.getElementById(id);
	return (id) ? $.element(id, nocash) : null;
};

$.element = function(el, nocash){
	$uid(el);
	if (!nocash && !el.$family && !(/^object|embed$/i).test(el.tagName)){
		var proto = Element.Prototype;
		for (var p in proto) el[p] = proto[p];
	};
	return el;
};

$.object = function(obj, nocash, doc){
	if (obj.toElement) return $.element(obj.toElement(doc), nocash);
	return null;
};

$.textnode = $.whitespace = $.window = $.document = $arguments(0);

Native.implement([Element, Document], {

	getElement: function(selector, nocash){
		return $(this.getElements(selector, true)[0] || null, nocash);
	},

	getElements: function(tags, nocash){
		tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag){
			var partial = this.getElementsByTagName(tag.trim());
			(ddup) ? elements.extend(partial) : elements = partial;
		}, this);
		return new Elements(elements, {ddup: ddup, cash: !nocash});
	}

});

(function(){

var collected = {}, storage = {};
var props = {input: 'checked', option: 'selected', textarea: (Browser.Engine.webkit && Browser.Engine.version < 420) ? 'innerHTML' : 'value'};

var get = function(uid){
	return (storage[uid] || (storage[uid] = {}));
};

var clean = function(item, retain){
	if (!item) return;
	var uid = item.uid;
	if (Browser.Engine.trident){
		if (item.clearAttributes){
			var clone = retain && item.cloneNode(false);
			item.clearAttributes();
			if (clone) item.mergeAttributes(clone);
		} else if (item.removeEvents){
			item.removeEvents();
		}
		if ((/object/i).test(item.tagName)){
			for (var p in item){
				if (typeof item[p] == 'function') item[p] = $empty;
			}
			Element.dispose(item);
		}
	}	
	if (!uid) return;
	collected[uid] = storage[uid] = null;
};

var purge = function(){
	Hash.each(collected, clean);
	if (Browser.Engine.trident) $A(document.getElementsByTagName('object')).each(clean);
	if (window.CollectGarbage) CollectGarbage();
	collected = storage = null;
};

var walk = function(element, walk, start, match, all, nocash){
	var el = element[start || walk];
	var elements = [];
	while (el){
		if (el.nodeType == 1 && (!match || Element.match(el, match))){
			if (!all) return $(el, nocash);
			elements.push(el);
		}
		el = el[walk];
	}
	return (all) ? new Elements(elements, {ddup: false, cash: !nocash}) : null;
};

var attributes = {
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor',
	'text': (Browser.Engine.trident || (Browser.Engine.webkit && Browser.Engine.version < 420)) ? 'innerText' : 'textContent'
};
var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'];
var camels = ['value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'];

bools = bools.associate(bools);

Hash.extend(attributes, bools);
Hash.extend(attributes, camels.associate(camels.map(String.toLowerCase)));

var inserters = {

	before: function(context, element){
		if (element.parentNode) element.parentNode.insertBefore(context, element);
	},

	after: function(context, element){
		if (!element.parentNode) return;
		var next = element.nextSibling;
		(next) ? element.parentNode.insertBefore(context, next) : element.parentNode.appendChild(context);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		var first = element.firstChild;
		(first) ? element.insertBefore(context, first) : element.appendChild(context);
	}

};

inserters.inside = inserters.bottom;

Hash.each(inserters, function(inserter, where){

	where = where.capitalize();

	Element.implement('inject' + where, function(el){
		inserter(this, $(el, true));
		return this;
	});

	Element.implement('grab' + where, function(el){
		inserter($(el, true), this);
		return this;
	});

});

Element.implement({

	set: function(prop, value){
		switch ($type(prop)){
			case 'object':
				for (var p in prop) this.set(p, prop[p]);
				break;
			case 'string':
				var property = Element.Properties.get(prop);
				(property && property.set) ? property.set.apply(this, Array.slice(arguments, 1)) : this.setProperty(prop, value);
		}
		return this;
	},

	get: function(prop){
		var property = Element.Properties.get(prop);
		return (property && property.get) ? property.get.apply(this, Array.slice(arguments, 1)) : this.getProperty(prop);
	},

	erase: function(prop){
		var property = Element.Properties.get(prop);
		(property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
		return this;
	},

	setProperty: function(attribute, value){
		var key = attributes[attribute];
		if (value == undefined) return this.removeProperty(attribute);
		if (key && bools[attribute]) value = !!value;
		(key) ? this[key] = value : this.setAttribute(attribute, '' + value);
		return this;
	},

	setProperties: function(attributes){
		for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
		return this;
	},

	getProperty: function(attribute){
		var key = attributes[attribute];
		var value = (key) ? this[key] : this.getAttribute(attribute, 2);
		return (bools[attribute]) ? !!value : (key) ? value : value || null;
	},

	getProperties: function(){
		var args = $A(arguments);
		return args.map(this.getProperty, this).associate(args);
	},

	removeProperty: function(attribute){
		var key = attributes[attribute];
		(key) ? this[key] = (key && bools[attribute]) ? false : '' : this.removeAttribute(attribute);
		return this;
	},

	removeProperties: function(){
		Array.each(arguments, this.removeProperty, this);
		return this;
	},

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	},

	toggleClass: function(className){
		return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	},

	adopt: function(){
		Array.flatten(arguments).each(function(element){
			element = $(element, true);
			if (element) this.appendChild(element);
		}, this);
		return this;
	},

	appendText: function(text, where){
		return this.grab(this.getDocument().newTextNode(text), where);
	},

	grab: function(el, where){
		inserters[where || 'bottom']($(el, true), this);
		return this;
	},

	inject: function(el, where){
		inserters[where || 'bottom'](this, $(el, true));
		return this;
	},

	replaces: function(el){
		el = $(el, true);
		el.parentNode.replaceChild(this, el);
		return this;
	},

	wraps: function(el, where){
		el = $(el, true);
		return this.replaces(el).grab(el, where);
	},

	getPrevious: function(match, nocash){
		return walk(this, 'previousSibling', null, match, false, nocash);
	},

	getAllPrevious: function(match, nocash){
		return walk(this, 'previousSibling', null, match, true, nocash);
	},

	getNext: function(match, nocash){
		return walk(this, 'nextSibling', null, match, false, nocash);
	},

	getAllNext: function(match, nocash){
		return walk(this, 'nextSibling', null, match, true, nocash);
	},

	getFirst: function(match, nocash){
		return walk(this, 'nextSibling', 'firstChild', match, false, nocash);
	},

	getLast: function(match, nocash){
		return walk(this, 'previousSibling', 'lastChild', match, false, nocash);
	},

	getParent: function(match, nocash){
		return walk(this, 'parentNode', null, match, false, nocash);
	},

	getParents: function(match, nocash){
		return walk(this, 'parentNode', null, match, true, nocash);
	},
	
	getSiblings: function(match, nocash) {
		return this.getParent().getChildren(match, nocash).erase(this);
	},

	getChildren: function(match, nocash){
		return walk(this, 'nextSibling', 'firstChild', match, true, nocash);
	},

	getWindow: function(){
		return this.ownerDocument.window;
	},

	getDocument: function(){
		return this.ownerDocument;
	},

	getElementById: function(id, nocash){
		var el = this.ownerDocument.getElementById(id);
		if (!el) return null;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return null;
		}
		return $.element(el, nocash);
	},

	getSelected: function(){
		return new Elements($A(this.options).filter(function(option){
			return option.selected;
		}));
	},

	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var computed = this.getDocument().defaultView.getComputedStyle(this, null);
		return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea', true).each(function(el){
			if (!el.name || el.disabled) return;
			var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
				return opt.value;
			}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
			$splat(value).each(function(val){
				if (typeof val != 'undefined') queryString.push(el.name + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	clone: function(contents, keepid){
		contents = contents !== false;
		var clone = this.cloneNode(contents);
		var clean = function(node, element){
			if (!keepid) node.removeAttribute('id');
			if (Browser.Engine.trident){
				node.clearAttributes();
				node.mergeAttributes(element);
				node.removeAttribute('uid');
				if (node.options){
					var no = node.options, eo = element.options;
					for (var j = no.length; j--;) no[j].selected = eo[j].selected;
				}
			}
			var prop = props[element.tagName.toLowerCase()];
			if (prop && element[prop]) node[prop] = element[prop];
		};

		if (contents){
			var ce = clone.getElementsByTagName('*'), te = this.getElementsByTagName('*');
			for (var i = ce.length; i--;) clean(ce[i], te[i]);
		}

		clean(clone, this);
		return $(clone);
	},

	destroy: function(){
		Element.empty(this);
		Element.dispose(this);
		clean(this, true);
		return null;
	},

	empty: function(){
		$A(this.childNodes).each(function(node){
			Element.destroy(node);
		});
		return this;
	},

	dispose: function(){
		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
	},

	hasChild: function(el){
		el = $(el, true);
		if (!el) return false;
		if (Browser.Engine.webkit && Browser.Engine.version < 420) return $A(this.getElementsByTagName(el.tagName)).contains(el);
		return (this.contains) ? (this != el && this.contains(el)) : !!(this.compareDocumentPosition(el) & 16);
	},

	match: function(tag){
		return (!tag || (tag == this) || (Element.get(this, 'tag') == tag));
	}

});

Native.implement([Element, Window, Document], {

	addListener: function(type, fn){
		if (type == 'unload'){
			var old = fn, self = this;
			fn = function(){
				self.removeListener('unload', fn);
				old();
			};
		} else {
			collected[this.uid] = this;
		}
		if (this.addEventListener) this.addEventListener(type, fn, false);
		else this.attachEvent('on' + type, fn);
		return this;
	},

	removeListener: function(type, fn){
		if (this.removeEventListener) this.removeEventListener(type, fn, false);
		else this.detachEvent('on' + type, fn);
		return this;
	},

	retrieve: function(property, dflt){
		var storage = get(this.uid), prop = storage[property];
		if (dflt != undefined && prop == undefined) prop = storage[property] = dflt;
		return $pick(prop);
	},

	store: function(property, value){
		var storage = get(this.uid);
		storage[property] = value;
		return this;
	},

	eliminate: function(property){
		var storage = get(this.uid);
		delete storage[property];
		return this;
	}

});

window.addListener('unload', purge);

})();

Element.Properties = new Hash;

Element.Properties.style = {

	set: function(style){
		this.style.cssText = style;
	},

	get: function(){
		return this.style.cssText;
	},

	erase: function(){
		this.style.cssText = '';
	}

};

Element.Properties.tag = {

	get: function(){
		return this.tagName.toLowerCase();
	}

};

Element.Properties.html = (function(){
	var wrapper = document.createElement('div');

	var translations = {
		table: [1, '<table>', '</table>'],
		select: [1, '<select>', '</select>'],
		tbody: [2, '<table><tbody>', '</tbody></table>'],
		tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
	};
	translations.thead = translations.tfoot = translations.tbody;

	var html = {
		set: function(){
			var html = Array.flatten(arguments).join('');
			var wrap = Browser.Engine.trident && translations[this.get('tag')];
			if (wrap){
				var first = wrapper;
				first.innerHTML = wrap[1] + html + wrap[2];
				for (var i = wrap[0]; i--;) first = first.firstChild;
				this.empty().adopt(first.childNodes);
			} else {
				this.innerHTML = html;
			}
		}
	};

	html.erase = html.set;

	return html;
})();

if (Browser.Engine.webkit && Browser.Engine.version < 420) Element.Properties.text = {
	get: function(){
		if (this.innerText) return this.innerText;
		var temp = this.ownerDocument.newElement('div', {html: this.innerHTML}).inject(this.ownerDocument.body);
		var text = temp.innerText;
		temp.destroy();
		return text;
	}
};

/*
Script: Element.Style.js
	Contains methods for interacting with the styles of Elements in a fashionable way.

License:
	MIT-style license.
*/

Element.Properties.styles = {set: function(styles){
	this.setStyles(styles);
}};

Element.Properties.opacity = {

	set: function(opacity, novisibility){
		if (!novisibility){
			if (opacity == 0){
				if (this.style.visibility != 'hidden') this.style.visibility = 'hidden';
			} else {
				if (this.style.visibility != 'visible') this.style.visibility = 'visible';
			}
		}
		if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
		if (Browser.Engine.trident) this.style.filter = (opacity == 1) ? '' : 'alpha(opacity=' + opacity * 100 + ')';
		this.style.opacity = opacity;
		this.store('opacity', opacity);
	},

	get: function(){
		return this.retrieve('opacity', 1);
	}

};

Element.implement({

	setOpacity: function(value){
		return this.set('opacity', value, true);
	},

	getOpacity: function(){
		return this.get('opacity');
	},

	setStyle: function(property, value){
		switch (property){
			case 'opacity': return this.set('opacity', parseFloat(value));
			case 'float': property = (Browser.Engine.trident) ? 'styleFloat' : 'cssFloat';
		}
		property = property.camelCase();
		if ($type(value) != 'string'){
			var map = (Element.Styles.get(property) || '@').split(' ');
			value = $splat(value).map(function(val, i){
				if (!map[i]) return '';
				return ($type(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
			}).join(' ');
		} else if (value == String(Number(value))){
			value = Math.round(value);
		}
		this.style[property] = value;
		return this;
	},

	getStyle: function(property){
		switch (property){
			case 'opacity': return this.get('opacity');
			case 'float': property = (Browser.Engine.trident) ? 'styleFloat' : 'cssFloat';
		}
		property = property.camelCase();
		var result = this.style[property];
		if (!$chk(result)){
			result = [];
			for (var style in Element.ShortStyles){
				if (property != style) continue;
				for (var s in Element.ShortStyles[style]) result.push(this.getStyle(s));
				return result.join(' ');
			}
			result = this.getComputedStyle(property);
		}
		if (result){
			result = String(result);
			var color = result.match(/rgba?\([\d\s,]+\)/);
			if (color) result = result.replace(color[0], color[0].rgbToHex());
		}
		if (Browser.Engine.presto || (Browser.Engine.trident && !$chk(parseInt(result, 10)))){
			if (property.test(/^(height|width)$/)){
				var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
				values.each(function(value){
					size += this.getStyle('border-' + value + '-width').toInt() + this.getStyle('padding-' + value).toInt();
				}, this);
				return this['offset' + property.capitalize()] - size + 'px';
			}
			if ((Browser.Engine.presto) && String(result).test('px')) return result;
			if (property.test(/(border(.+)Width|margin|padding)/)) return '0px';
		}
		return result;
	},

	setStyles: function(styles){
		for (var style in styles) this.setStyle(style, styles[style]);
		return this;
	},

	getStyles: function(){
		var result = {};
		Array.each(arguments, function(key){
			result[key] = this.getStyle(key);
		}, this);
		return result;
	}

});

Element.Styles = new Hash({
	left: '@px', top: '@px', bottom: '@px', right: '@px',
	width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
	backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
	fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
	margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
	borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
	zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
});

Element.ShortStyles = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};

['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
	var Short = Element.ShortStyles;
	var All = Element.Styles;
	['margin', 'padding'].each(function(style){
		var sd = style + direction;
		Short[style][sd] = All[sd] = '@px';
	});
	var bd = 'border' + direction;
	Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
	var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
	Short[bd] = {};
	Short.borderWidth[bdw] = Short[bd][bdw] = All[bdw] = '@px';
	Short.borderStyle[bds] = Short[bd][bds] = All[bds] = '@';
	Short.borderColor[bdc] = Short[bd][bdc] = All[bdc] = 'rgb(@, @, @)';
});

/*
Script: Fx.CSS.js
	Contains the CSS animation logic. Used by Fx.Tween, Fx.Morph, Fx.Elements.

License:
	MIT-style license.
*/

Fx.CSS = new Class({

	Extends: Fx,

	//prepares the base from/to object

	prepare: function(element, property, values){
		values = $splat(values);
		var values1 = values[1];
		if (!$chk(values1)){
			values[1] = values[0];
			values[0] = element.getStyle(property);
		}
		var parsed = values.map(this.parse);
		return {from: parsed[0], to: parsed[1]};
	},

	//parses a value into an array

	parse: function(value){
		value = $lambda(value)();
		value = (typeof value == 'string') ? value.split(' ') : $splat(value);
		return value.map(function(val){
			val = String(val);
			var found = false;
			Fx.CSS.Parsers.each(function(parser, key){
				if (found) return;
				var parsed = parser.parse(val);
				if ($chk(parsed)) found = {value: parsed, parser: parser};
			});
			found = found || {value: val, parser: Fx.CSS.Parsers.String};
			return found;
		});
	},

	//computes by a from and to prepared objects, using their parsers.

	compute: function(from, to, delta){
		var computed = [];
		(Math.min(from.length, to.length)).times(function(i){
			computed.push({value: from[i].parser.compute(from[i].value, to[i].value, delta), parser: from[i].parser});
		});
		computed.$family = {name: 'fx:css:value'};
		return computed;
	},

	//serves the value as settable

	serve: function(value, unit){
		if ($type(value) != 'fx:css:value') value = this.parse(value);
		var returned = [];
		value.each(function(bit){
			returned = returned.concat(bit.parser.serve(bit.value, unit));
		});
		return returned;
	},

	//renders the change to an element

	render: function(element, property, value, unit){
		element.setStyle(property, this.serve(value, unit));
	},

	//searches inside the page css to find the values for a selector

	search: function(selector){
		if (Fx.CSS.Cache[selector]) return Fx.CSS.Cache[selector];
		var to = {};
		Array.each(document.styleSheets, function(sheet, j){
			var href = sheet.href;
			if (href && href.contains('://') && !href.contains(document.domain)) return;
			var rules = sheet.rules || sheet.cssRules;
			Array.each(rules, function(rule, i){
				if (!rule.style) return;
				var selectorText = (rule.selectorText) ? rule.selectorText.replace(/^\w+/, function(m){
					return m.toLowerCase();
				}) : null;
				if (!selectorText || !selectorText.test('^' + selector + '$')) return;
				Element.Styles.each(function(value, style){
					if (!rule.style[style] || Element.ShortStyles[style]) return;
					value = String(rule.style[style]);
					to[style] = (value.test(/^rgb/)) ? value.rgbToHex() : value;
				});
			});
		});
		return Fx.CSS.Cache[selector] = to;
	}

});

Fx.CSS.Cache = {};

Fx.CSS.Parsers = new Hash({

	Color: {
		parse: function(value){
			if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},
		compute: function(from, to, delta){
			return from.map(function(value, i){
				return Math.round(Fx.compute(from[i], to[i], delta));
			});
		},
		serve: function(value){
			return value.map(Number);
		}
	},

	Number: {
		parse: parseFloat,
		compute: Fx.compute,
		serve: function(value, unit){
			return (unit) ? value + unit : value;
		}
	},

	String: {
		parse: $lambda(false),
		compute: $arguments(1),
		serve: $arguments(0)
	}

});

/*
Script: Fx.Tween.js
	Formerly Fx.Style, effect to transition any CSS property for an element.

License:
	MIT-style license.
*/

Fx.Tween = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = $(element);
		this.parent(options);
	},

	set: function(property, now){
		if (arguments.length == 1){
			now = property;
			property = this.property || this.options.property;
		}
		this.render(this.element, property, now, this.options.unit);
		return this;
	},

	start: function(property, from, to){
		if (!this.check(property, from, to)) return this;
		var args = Array.flatten(arguments);
		this.property = this.options.property || args.shift();
		var parsed = this.prepare(this.element, this.property, args);
		return this.parent(parsed.from, parsed.to);
	}

});

Element.Properties.tween = {

	set: function(options){
		var tween = this.retrieve('tween');
		if (tween) tween.cancel();
		return this.eliminate('tween').store('tween:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('tween')){
			if (options || !this.retrieve('tween:options')) this.set('tween', options);
			this.store('tween', new Fx.Tween(this, this.retrieve('tween:options')));
		}
		return this.retrieve('tween');
	}

};

Element.implement({

	tween: function(property, from, to){
		this.get('tween').start(arguments);
		return this;
	},

	fade: function(how){
		var fade = this.get('tween'), o = 'opacity', toggle;
		how = $pick(how, 'toggle');
		switch (how){
			case 'in': fade.start(o, 1); break;
			case 'out': fade.start(o, 0); break;
			case 'show': fade.set(o, 1); break;
			case 'hide': fade.set(o, 0); break;
			case 'toggle':
				var flag = this.retrieve('fade:flag', this.get('opacity') == 1);
				fade.start(o, (flag) ? 0 : 1);
				this.store('fade:flag', !flag);
				toggle = true;
			break;
			default: fade.start(o, arguments);
		}
		if (!toggle) this.eliminate('fade:flag');
		return this;
	},

	highlight: function(start, end){
		if (!end){
			end = this.retrieve('highlight:original', this.getStyle('background-color'));
			end = (end == 'transparent') ? '#fff' : end;
		}
		var tween = this.get('tween');
		tween.start('background-color', start || '#ffff88', end).chain(function(){
			this.setStyle('background-color', this.retrieve('highlight:original'));
			tween.callChain();
		}.bind(this));
		return this;
	}

});

/*
Script: Fx.Morph.js
	Formerly Fx.Styles, effect to transition any number of CSS properties for an element using an object of rules, or CSS based selector rules.

License:
	MIT-style license.
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		dbug.log('new MORPH! ', element)
		this.element = this.subject = $(element);
		this.parent(options);
	},

	set: function(now){
		if (typeof now == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.options.unit);
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(properties)) return this;
		if (typeof properties == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return this.parent(from, to);
	}

});

Element.Properties.morph = {

	set: function(options){
		var morph = this.retrieve('morph');
		if (morph) morph.cancel();
		return this.eliminate('morph').store('morph:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('morph')){
			if (options || !this.retrieve('morph:options')) this.set('morph', options);
			this.store('morph', new Fx.Morph(this, this.retrieve('morph:options')));
		}
		return this.retrieve('morph');
	}

};

Element.implement({

	morph: function(props){
		this.get('morph').start(props);
		return this;
	}

});

/*
Script: Fx.Transitions.js
	Contains a set of advanced transitions to be used with any of the Fx Classes.

License:
	MIT-style license.

Credits:
	Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.
*/

Fx.implement({

	getTransition: function(){
		var trans = this.options.transition || Fx.Transitions.Sine.easeInOut;
		if (typeof trans == 'string'){
			var data = trans.split(':');
			trans = Fx.Transitions;
			trans = trans[data[0]] || trans[data[0].capitalize()];
			if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
		}
		return trans;
	}

});

Fx.Transition = function(transition, params){
	params = $splat(params);
	return $extend(transition, {
		easeIn: function(pos){
			return transition(pos, params);
		},
		easeOut: function(pos){
			return 1 - transition(1 - pos, params);
		},
		easeInOut: function(pos){
			return (pos <= 0.5) ? transition(2 * pos, params) / 2 : (2 - transition(2 * (1 - pos), params)) / 2;
		}
	});
};

Fx.Transitions = new Hash({

	linear: $arguments(0)

});

Fx.Transitions.extend = function(transitions){
	for (var transition in transitions) Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
};

Fx.Transitions.extend({

	Pow: function(p, x){
		return Math.pow(p, x[0] || 6);
	},

	Expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	Circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	Sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	Back: function(p, x){
		x = x[0] || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	Bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	Elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x[0] || 1) / 3);
	}

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
	Fx.Transitions[transition] = new Fx.Transition(function(p){
		return Math.pow(p, [i + 2]);
	});
});

/*
Script: Request.js
	Powerful all purpose Request Class. Uses XMLHTTPRequest.

License:
	MIT-style license.
*/

var Request = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: $empty,
		onComplete: $empty,
		onCancel: $empty,
		onSuccess: $empty,
		onFailure: $empty,
		onException: $empty,*/
		url: '',
		data: '',
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		},
		async: true,
		format: false,
		method: 'post',
		link: 'ignore',
		isSuccess: null,
		emulation: true,
		urlEncoded: true,
		encoding: 'utf-8',
		evalScripts: false,
		evalResponse: false,
		noCache: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.setOptions(options);
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = new Hash(this.options.headers);
	},

	onStateChange: function(){
		if (this.xhr.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		$try(function(){
			this.status = this.xhr.status;
		}.bind(this));
		if (this.options.isSuccess.call(this, this.status)){
			this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};
			this.success(this.response.text, this.response.xml);
		} else {
			this.response = {text: null, xml: null};
			this.failure();
		}
		this.xhr.onreadystatechange = $empty;
	},

	isSuccess: function(){
		return ((this.status >= 200) && (this.status < 300));
	},

	processScripts: function(text){
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return $exec(text);
		return text.stripScripts(this.options.evalScripts);
	},

	success: function(text, xml){
		this.onSuccess(this.processScripts(text), xml);
	},

	onSuccess: function(){
		this.fireEvent('complete', arguments).fireEvent('success', arguments).callChain();
	},

	failure: function(){
		this.onFailure();
	},

	onFailure: function(){
		this.fireEvent('complete').fireEvent('failure', this.xhr);
	},

	setHeader: function(name, value){
		this.headers.set(name, value);
		return this;
	},

	getHeader: function(name){
		return $try(function(){
			return this.xhr.getResponseHeader(name);
		}.bind(this));
	},

	check: function(){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	send: function(options){
		if (!this.check(options)) return this;
		this.running = true;

		var type = $type(options);
		if (type == 'string' || type == 'element') options = {data: options};

		var old = this.options;
		options = $extend({data: old.data, url: old.url, method: old.method}, options);
		var data = options.data, url = options.url, method = options.method;

		switch ($type(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': case 'hash': data = Hash.toQueryString(data);
		}

		if (this.options.format){
			var format = 'format=' + this.options.format;
			data = (data) ? format + '&' + data : format;
		}

		if (this.options.emulation && ['put', 'delete'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.options.urlEncoded && method == 'post'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.headers.set('Content-type', 'application/x-www-form-urlencoded' + encoding);
		}

		if(this.options.noCache) {
			var noCache = "noCache=" + new Date().getTime();
			data = (data) ? noCache + '&' + data : noCache;
		}


		if (data && method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}


		this.xhr.open(method.toUpperCase(), url, this.options.async);

		this.xhr.onreadystatechange = this.onStateChange.bind(this);

		this.headers.each(function(value, key){
			try {
				this.xhr.setRequestHeader(key, value);
			} catch (e){
				this.fireEvent('exception', [key, value]);
			}
		}, this);

		this.fireEvent('request');
		this.xhr.send(data);
		if (!this.options.async) this.onStateChange();
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.xhr.abort();
		this.xhr.onreadystatechange = $empty;
		this.xhr = new Browser.Request();
		this.fireEvent('cancel');
		return this;
	}

});

(function(){

var methods = {};
['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
	methods[method] = function(){
		var params = Array.link(arguments, {url: String.type, data: $defined});
		return this.send($extend(params, {method: method.toLowerCase()}));
	};
});

Request.implement(methods);

})();
/*
Script: JSON.js
	JSON encoder and decoder.

License:
	MIT-style license.

See Also:
	<http://www.json.org/>
*/

var JSON = new Hash({

	$specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	$replaceChars: function(chr){
		return JSON.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	encode: function(obj){
		switch ($type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.$replaceChars) + '"';
			case 'array':
				return '[' + String(obj.map(JSON.encode).filter($defined)) + ']';
			case 'object': case 'hash':
				var string = [];
				Hash.each(obj, function(value, key){
					var json = JSON.encode(value);
					if (json) string.push(JSON.encode(key) + ':' + json);
				});
				return '{' + string + '}';
			case 'number': case 'boolean': return String(obj);
			case false: return 'null';
		}
		return null;
	},

	decode: function(string, secure){
		if ($type(string) != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

});

Native.implement([Hash, Array, String, Number], {

	toJSON: function(){
		return JSON.encode(this);
	}

});

/*
Script: Request.JSON.js
	Extends the basic Request Class with additional methods for sending and receiving JSON data.

License:
	MIT-style license.
*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		secure: true
	},

	initialize: function(options){
		this.parent(options);
		this.headers.extend({'Accept': 'application/json', 'X-Request': 'JSON'});
	},

	success: function(text){
		this.response.json = JSON.decode(text, this.options.secure);
		this.onSuccess(this.response.json, text);
	}

});

/*
Script: Request.HTML.js
	Extends the basic Request Class with additional methods for interacting with HTML responses.

License:
	MIT-style license.
*/

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		append: false,
		evalScripts: true,
		filter: false
	},

	processHTML: function(text){
		var match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		text = (match) ? match[1] : text;

		var container = new Element('div');

		return $try(function(){
			var root = '<root>' + text + '</root>', doc;
			if (Browser.Engine.trident){
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = false;
				doc.loadXML(root);
			} else {
				doc = new DOMParser().parseFromString(root, 'text/xml');
			}
			root = doc.getElementsByTagName('root')[0];
			if (!root) return;
			for (var i = 0, k = root.childNodes.length; i < k; i++){
				var child = Element.clone(root.childNodes[i], true, true);
				if (child) container.grab(child);
			}
			return container;
		}) || container.set('html', text);
	},

	success: function(text){
		var options = this.options, response = this.response;

		response.html = text.stripScripts(function(script){
			response.javascript = script;
		});

		var temp = this.processHTML(response.html);

		response.tree = temp.childNodes;
		response.elements = temp.getElements('*');

		if (options.filter) response.tree = response.elements.filter(options.filter);
		if (options.update) $(options.update).empty().set('html', response.html);
		else if (options.append) $(options.append).adopt(temp.getChildren());
		if (options.evalScripts) $exec(response.javascript);

		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}

});

Element.Properties.send = {

	set: function(options){
		var send = this.retrieve('send');
		if (send) send.cancel();
		return this.eliminate('send').store('send:options', $extend({
			data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
		}, options));
	},

	get: function(options){
		if (options || !this.retrieve('send')){
			if (options || !this.retrieve('send:options')) this.set('send', options);
			this.store('send', new Request(this.retrieve('send:options')));
		}
		return this.retrieve('send');
	}

};

Element.Properties.load = {

	set: function(options){
		var load = this.retrieve('load');
		if (load) load.cancel();
		return this.eliminate('load').store('load:options', $extend({data: this, link: 'cancel', update: this, method: 'get'}, options));
	},

	get: function(options){
		if (options || ! this.retrieve('load')){
			if (options || !this.retrieve('load:options')) this.set('load', options);
			this.store('load', new Request.HTML(this.retrieve('load:options')));
		}
		return this.retrieve('load');
	}

};

Element.implement({

	send: function(url){
		var sender = this.get('send');
		sender.send({data: this, url: url || sender.options.url});
		return this;
	},

	load: function(){
		this.get('load').send(Array.link(arguments, {data: Object.type, url: String.type}));
		return this;
	}

});

/*
Script: Element.Event.js
	Contains Element methods for dealing with events, and custom Events.

License:
	MIT-style license.
*/

Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};

Native.implement([Element, Window, Document], {

	addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		events[type] = events[type] || {'keys': [], 'values': []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type, custom = Element.Events.get(type), condition = fn, self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event)) return fn.call(this, event);
					return true;
				};
			}
			realType = custom.base || realType;
		}
		var defn = function(){
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType];
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new Event(event, self.getWindow());
					if (condition.call(self, event) === false) event.stop();
				};
			}
			this.addListener(realType, defn);
		}
		events[type].values.push(defn);
		return this;
	},

	removeEvent: function(type, fn){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		var pos = events[type].keys.indexOf(fn);
		if (pos == -1) return this;
		events[type].keys.splice(pos, 1);
		var value = events[type].values.splice(pos, 1)[0];
		var custom = Element.Events.get(type);
		if (custom){
			if (custom.onRemove) custom.onRemove.call(this, fn);
			type = custom.base || type;
		}
		return (Element.NativeEvents[type]) ? this.removeListener(type, value) : this;
	},

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	removeEvents: function(events){
		if ($type(events) == 'object'){
			for (var type in events) this.removeEvent(type, events[type]);
			return this;
		}
		var attached = this.retrieve('events');
		if (!attached) return this;
		if (!events){
			for (var type in attached) this.removeEvents(type);
			this.eliminate('events');
		} else if (attached[events]){
			while (attached[events].keys[0]) this.removeEvent(events, attached[events].keys[0]);
			attached[events] = null;
		}
		return this;
	},

	fireEvent: function(type, args, delay){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		events[type].keys.each(function(fn){
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		return this;
	},

	cloneEvents: function(from, type){
		from = $(from);
		var fevents = from.retrieve('events');
		if (!fevents) return this;
		if (!type){
			for (var evType in fevents) this.cloneEvents(from, evType);
		} else if (fevents[type]){
			fevents[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.NativeEvents = {
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
	load: 1, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc
};

(function(){

var $check = function(event){
	var related = event.relatedTarget;
	if (related == undefined) return true;
	if (related === false) return false;
	return ($type(this) != 'document' && related != this && related.prefix != 'xul' && !this.hasChild(related));
};

Element.Events = new Hash({

	mouseenter: {
		base: 'mouseover',
		condition: $check
	},

	mouseleave: {
		base: 'mouseout',
		condition: $check
	},

	mousewheel: {
		base: (Browser.Engine.gecko) ? 'DOMMouseScroll' : 'mousewheel'
	}

});

})();

/*
Script: Domready.js
	Contains the domready custom event.

License:
	MIT-style license.
*/

Element.Events.domready = {

	onAdd: function(fn){
		if (Browser.loaded) fn.call(this);
	}

};

(function(){

	var domready = function(){
		if (Browser.loaded) return;
		Browser.loaded = true;
		window.fireEvent('domready');
		document.fireEvent('domready');
	};

	if (Browser.Engine.trident){
		var temp = document.createElement('div');
		(function(){
			($try(function(){
				temp.doScroll('left');
				return $(temp).inject(document.body).set('html', 'temp').dispose();
			})) ? domready() : arguments.callee.delay(50);
		})();
	} else if (Browser.Engine.webkit && Browser.Engine.version < 525){
		(function(){
			(['loaded', 'complete'].contains(document.readyState)) ? domready() : arguments.callee.delay(50);
		})();
	} else {
		window.addEvent('load', domready);
		document.addEvent('DOMContentLoaded', domready);
	}

})();

/*
Script: Cookie.js
	Class for creating, loading, and saving browser Cookies.

License:
	MIT-style license.

Credits:
	Based on the functions by Peter-Paul Koch (http://quirksmode.org).
*/

var Cookie = new Class({

	Implements: Options,

	options: {
		path: false,
		domain: false,
		duration: false,
		secure: false,
		document: document
	},

	initialize: function(key, options){
		this.key = key;
		this.setOptions(options);
	},

	write: function(value){
		value = encodeURIComponent(value);
		if (this.options.domain) value += '; domain=' + this.options.domain;
		if (this.options.path) value += '; path=' + this.options.path;
		if (this.options.duration){
			var date = new Date();
			date.setTime(date.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
			value += '; expires=' + date.toGMTString();
		}
		if (this.options.secure) value += '; secure';
		this.options.document.cookie = this.key + '=' + value;
		return this;
	},

	read: function(){
		var value = this.options.document.cookie.match('(?:^|;)\\s*' + this.key.escapeRegExp() + '=([^;]*)');
		return (value) ? decodeURIComponent(value[1]) : null;
	},

	dispose: function(){
		new Cookie(this.key, $merge(this.options, {duration: -1})).write('');
		return this;
	}

});

Cookie.write = function(key, value, options){
	return new Cookie(key, options).write(value);
};

Cookie.read = function(key){
	return new Cookie(key).read();
};

Cookie.dispose = function(key, options){
	return new Cookie(key, options).dispose();
};

/*
Script: Swiff.js
	Wrapper for embedding SWF movies. Supports (and fixes) External Interface Communication.

License:
	MIT-style license.

Credits:
	Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.
*/

var Swiff = new Class({

	Implements: [Options],

	options: {
		id: null,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			wMode: 'transparent',
			swLiveConnect: true
		},
		callBacks: {},
		vars: {}
	},

	toElement: function(){
		return this.object;
	},

	initialize: function(path, options){
		this.instance = 'Swiff_' + $time();

		this.setOptions(options);
		options = this.options;
		var id = this.id = options.id || this.instance;
		var container = $(options.container);

		Swiff.CallBacks[this.instance] = {};

		var params = options.params, vars = options.vars, callBacks = options.callBacks;
		var properties = $extend({height: options.height, width: options.width}, options.properties);

		var self = this;

		for (var callBack in callBacks){
			Swiff.CallBacks[this.instance][callBack] = (function(option){
				return function(){
					return option.apply(self.object, arguments);
				};
			})(callBacks[callBack]);
			vars[callBack] = 'Swiff.CallBacks.' + this.instance + '.' + callBack;
		}

		params.flashVars = Hash.toQueryString(vars);
		if (Browser.Engine.trident){
			properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			params.movie = path;
		} else {
			properties.type = 'application/x-shockwave-flash';
			properties.data = path;
		}
		var build = '<object id="' + id + '"';
		for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
		build += '>';
		for (var param in params){
			if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
		}
		build += '</object>';
		this.object = ((container) ? container.empty() : new Element('div')).set('html', build).firstChild;
	},

	replaces: function(element){
		element = $(element, true);
		element.parentNode.replaceChild(this.toElement(), element);
		return this;
	},

	inject: function(element){
		$(element, true).appendChild(this.toElement());
		return this;
	},

	remote: function(){
		return Swiff.remote.apply(Swiff, [this.toElement()].extend(arguments));
	}

});

Swiff.CallBacks = {};

Swiff.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};

/*
Script: Selectors.js
	Adds advanced CSS Querying capabilities for targeting elements. Also includes pseudoselectors support.

License:
	MIT-style license.
*/

Native.implement([Document, Element], {

	getElements: function(expression, nocash){
		expression = expression.split(',');
		var items, local = {};
		for (var i = 0, l = expression.length; i < l; i++){
			var selector = expression[i], elements = Selectors.Utils.search(this, selector, local);
			if (i != 0 && elements.item) elements = $A(elements);
			items = (i == 0) ? elements : (items.item) ? $A(items).concat(elements) : items.concat(elements);
		}
		return new Elements(items, {ddup: (expression.length > 1), cash: !nocash});
	}

});

Element.implement({

	match: function(selector){
		if (!selector || (selector == this)) return true;
		var tagid = Selectors.Utils.parseTagAndID(selector);
		var tag = tagid[0], id = tagid[1];
		if (!Selectors.Filters.byID(this, id) || !Selectors.Filters.byTag(this, tag)) return false;
		var parsed = Selectors.Utils.parseSelector(selector);
		return (parsed) ? Selectors.Utils.filter(this, parsed, {}) : true;
	}

});

var Selectors = {Cache: {nth: {}, parsed: {}}};

Selectors.RegExps = {
	id: (/#([\w-]+)/),
	tag: (/^(\w+|\*)/),
	quick: (/^(\w+|\*)$/),
	splitter: (/\s*([+>~\s])\s*([a-zA-Z#.*:\[])/g),
	combined: (/\.([\w-]+)|\[(\w+)(?:([!*^$~|]?=)(["']?)([^\4]*?)\4)?\]|:([\w-]+)(?:\(["']?(.*?)?["']?\)|$)/g)
};

Selectors.Utils = {

	chk: function(item, uniques){
		if (!uniques) return true;
		var uid = $uid(item);
		if (!uniques[uid]) return uniques[uid] = true;
		return false;
	},

	parseNthArgument: function(argument){
		if (Selectors.Cache.nth[argument]) return Selectors.Cache.nth[argument];
		var parsed = argument.match(/^([+-]?\d*)?([a-z]+)?([+-]?\d*)?$/);
		if (!parsed) return false;
		var inta = parseInt(parsed[1], 10);
		var a = (inta || inta === 0) ? inta : 1;
		var special = parsed[2] || false;
		var b = parseInt(parsed[3], 10) || 0;
		if (a != 0){
			b--;
			while (b < 1) b += a;
			while (b >= a) b -= a;
		} else {
			a = b;
			special = 'index';
		}
		switch (special){
			case 'n': parsed = {a: a, b: b, special: 'n'}; break;
			case 'odd': parsed = {a: 2, b: 0, special: 'n'}; break;
			case 'even': parsed = {a: 2, b: 1, special: 'n'}; break;
			case 'first': parsed = {a: 0, special: 'index'}; break;
			case 'last': parsed = {special: 'last-child'}; break;
			case 'only': parsed = {special: 'only-child'}; break;
			default: parsed = {a: (a - 1), special: 'index'};
		}

		return Selectors.Cache.nth[argument] = parsed;
	},

	parseSelector: function(selector){
		if (Selectors.Cache.parsed[selector]) return Selectors.Cache.parsed[selector];
		var m, parsed = {classes: [], pseudos: [], attributes: []};
		while ((m = Selectors.RegExps.combined.exec(selector))){
			var cn = m[1], an = m[2], ao = m[3], av = m[5], pn = m[6], pa = m[7];
			if (cn){
				parsed.classes.push(cn);
			} else if (pn){
				var parser = Selectors.Pseudo.get(pn);
				if (parser) parsed.pseudos.push({parser: parser, argument: pa});
				else parsed.attributes.push({name: pn, operator: '=', value: pa});
			} else if (an){
				parsed.attributes.push({name: an, operator: ao, value: av});
			}
		}
		if (!parsed.classes.length) delete parsed.classes;
		if (!parsed.attributes.length) delete parsed.attributes;
		if (!parsed.pseudos.length) delete parsed.pseudos;
		if (!parsed.classes && !parsed.attributes && !parsed.pseudos) parsed = null;
		return Selectors.Cache.parsed[selector] = parsed;
	},

	parseTagAndID: function(selector){
		var tag = selector.match(Selectors.RegExps.tag);
		var id = selector.match(Selectors.RegExps.id);
		return [(tag) ? tag[1] : '*', (id) ? id[1] : false];
	},

	filter: function(item, parsed, local){
		var i;
		if (parsed.classes){
			for (i = parsed.classes.length; i--; i){
				var cn = parsed.classes[i];
				if (!Selectors.Filters.byClass(item, cn)) return false;
			}
		}
		if (parsed.attributes){
			for (i = parsed.attributes.length; i--; i){
				var att = parsed.attributes[i];
				if (!Selectors.Filters.byAttribute(item, att.name, att.operator, att.value)) return false;
			}
		}
		if (parsed.pseudos){
			for (i = parsed.pseudos.length; i--; i){
				var psd = parsed.pseudos[i];
				if (!Selectors.Filters.byPseudo(item, psd.parser, psd.argument, local)) return false;
			}
		}
		return true;
	},

	getByTagAndID: function(ctx, tag, id){
		if (id){
			var item = (ctx.getElementById) ? ctx.getElementById(id, true) : Element.getElementById(ctx, id, true);
			return (item && Selectors.Filters.byTag(item, tag)) ? [item] : [];
		} else {
			return ctx.getElementsByTagName(tag);
		}
	},

	search: function(self, expression, local){
		var splitters = [];

		var selectors = expression.trim().replace(Selectors.RegExps.splitter, function(m0, m1, m2){
			splitters.push(m1);
			return ':)' + m2;
		}).split(':)');

		var items, filtered, item;

		for (var i = 0, l = selectors.length; i < l; i++){

			var selector = selectors[i];

			if (i == 0 && Selectors.RegExps.quick.test(selector)){
				items = self.getElementsByTagName(selector);
				continue;
			}

			var splitter = splitters[i - 1];

			var tagid = Selectors.Utils.parseTagAndID(selector);
			var tag = tagid[0], id = tagid[1];

			if (i == 0){
				items = Selectors.Utils.getByTagAndID(self, tag, id);
			} else {
				var uniques = {}, found = [];
				for (var j = 0, k = items.length; j < k; j++) found = Selectors.Getters[splitter](found, items[j], tag, id, uniques);
				items = found;
			}

			var parsed = Selectors.Utils.parseSelector(selector);

			if (parsed){
				filtered = [];
				for (var m = 0, n = items.length; m < n; m++){
					item = items[m];
					if (Selectors.Utils.filter(item, parsed, local)) filtered.push(item);
				}
				items = filtered;
			}

		}

		return items;

	}

};

Selectors.Getters = {

	' ': function(found, self, tag, id, uniques){
		var items = Selectors.Utils.getByTagAndID(self, tag, id);
		for (var i = 0, l = items.length; i < l; i++){
			var item = items[i];
			if (Selectors.Utils.chk(item, uniques)) found.push(item);
		}
		return found;
	},

	'>': function(found, self, tag, id, uniques){
		var children = Selectors.Utils.getByTagAndID(self, tag, id);
		for (var i = 0, l = children.length; i < l; i++){
			var child = children[i];
			if (child.parentNode == self && Selectors.Utils.chk(child, uniques)) found.push(child);
		}
		return found;
	},

	'+': function(found, self, tag, id, uniques){
		while ((self = self.nextSibling)){
			if (self.nodeType == 1){
				if (Selectors.Utils.chk(self, uniques) && Selectors.Filters.byTag(self, tag) && Selectors.Filters.byID(self, id)) found.push(self);
				break;
			}
		}
		return found;
	},

	'~': function(found, self, tag, id, uniques){
		while ((self = self.nextSibling)){
			if (self.nodeType == 1){
				if (!Selectors.Utils.chk(self, uniques)) break;
				if (Selectors.Filters.byTag(self, tag) && Selectors.Filters.byID(self, id)) found.push(self);
			}
		}
		return found;
	}

};

Selectors.Filters = {

	byTag: function(self, tag){
		return (tag == '*' || (self.tagName && self.tagName.toLowerCase() == tag));
	},

	byID: function(self, id){
		return (!id || (self.id && self.id == id));
	},

	byClass: function(self, klass){
		return (self.className && self.className.contains(klass, ' '));
	},

	byPseudo: function(self, parser, argument, local){
		return parser.call(self, argument, local);
	},

	byAttribute: function(self, name, operator, value){
		var result = Element.prototype.getProperty.call(self, name);
		if (!result) return (operator == '!=');
		if (!operator || value == undefined) return true;
		switch (operator){
			case '=': return (result == value);
			case '*=': return (result.contains(value));
			case '^=': return (result.substr(0, value.length) == value);
			case '$=': return (result.substr(result.length - value.length) == value);
			case '!=': return (result != value);
			case '~=': return result.contains(value, ' ');
			case '|=': return result.contains(value, '-');
		}
		return false;
	}

};

Selectors.Pseudo = new Hash({

	// w3c pseudo selectors

	checked: function(){
		return this.checked;
	},
	
	empty: function(){
		return !(this.innerText || this.textContent || '').length;
	},

	not: function(selector){
		return !Element.match(this, selector);
	},

	contains: function(text){
		return (this.innerText || this.textContent || '').contains(text);
	},

	'first-child': function(){
		return Selectors.Pseudo.index.call(this, 0);
	},

	'last-child': function(){
		var element = this;
		while ((element = element.nextSibling)){
			if (element.nodeType == 1) return false;
		}
		return true;
	},

	'only-child': function(){
		var prev = this;
		while ((prev = prev.previousSibling)){
			if (prev.nodeType == 1) return false;
		}
		var next = this;
		while ((next = next.nextSibling)){
			if (next.nodeType == 1) return false;
		}
		return true;
	},

	'nth-child': function(argument, local){
		argument = (argument == undefined) ? 'n' : argument;
		var parsed = Selectors.Utils.parseNthArgument(argument);
		if (parsed.special != 'n') return Selectors.Pseudo[parsed.special].call(this, parsed.a, local);
		var count = 0;
		local.positions = local.positions || {};
		var uid = $uid(this);
		if (!local.positions[uid]){
			var self = this;
			while ((self = self.previousSibling)){
				if (self.nodeType != 1) continue;
				count ++;
				var position = local.positions[$uid(self)];
				if (position != undefined){
					count = position + count;
					break;
				}
			}
			local.positions[uid] = count;
		}
		return (local.positions[uid] % parsed.a == parsed.b);
	},

	// custom pseudo selectors

	index: function(index){
		var element = this, count = 0;
		while ((element = element.previousSibling)){
			if (element.nodeType == 1 && ++count > index) return false;
		}
		return (count == index);
	},

	even: function(argument, local){
		return Selectors.Pseudo['nth-child'].call(this, '2n+1', local);
	},

	odd: function(argument, local){
		return Selectors.Pseudo['nth-child'].call(this, '2n', local);
	},
	
	selected: function() {
		return this.selected;
	}

});

/*
Script: Element.Dimensions.js
	Contains methods to work with size, scroll, or positioning of Elements and the window object.

License:
	MIT-style license.

Credits:
	- Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
	- Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).
*/

(function(){

Element.implement({

	scrollTo: function(x, y){
		if (isBody(this)){
			this.getWindow().scrollTo(x, y);
		} else {
			this.scrollLeft = x;
			this.scrollTop = y;
		}
		return this;
	},

	getSize: function(){
		if (isBody(this)) return this.getWindow().getSize();
		return {x: this.offsetWidth, y: this.offsetHeight};
	},

	getScrollSize: function(){
		if (isBody(this)) return this.getWindow().getScrollSize();
		return {x: this.scrollWidth, y: this.scrollHeight};
	},

	getScroll: function(){
		if (isBody(this)) return this.getWindow().getScroll();
		return {x: this.scrollLeft, y: this.scrollTop};
	},

	getScrolls: function(){
		var element = this, position = {x: 0, y: 0};
		while (element && !isBody(element)){
			position.x += element.scrollLeft;
			position.y += element.scrollTop;
			element = element.parentNode;
		}
		return position;
	},

	getOffsetParent: function(){
		var element = this;
		if (isBody(element)) return null;
		if (!Browser.Engine.trident) return element.offsetParent;
		while ((element = element.parentNode) && !isBody(element)){
			if (styleString(element, 'position') != 'static') return element;
		}
		return null;
	},

	getOffsets: function(){
		if (Browser.Engine.trident){
			var bound = this.getBoundingClientRect(), html = this.getDocument().documentElement;
			return {
				x: bound.left + html.scrollLeft - html.clientLeft,
				y: bound.top + html.scrollTop - html.clientTop
			};
		}

		var element = this, position = {x: 0, y: 0};
		if (isBody(this)) return position;

		while (element && !isBody(element)){
			position.x += element.offsetLeft;
			position.y += element.offsetTop;

			if (Browser.Engine.gecko){
				if (!borderBox(element)){
					position.x += leftBorder(element);
					position.y += topBorder(element);
				}
				var parent = element.parentNode;
				if (parent && styleString(parent, 'overflow') != 'visible'){
					position.x += leftBorder(parent);
					position.y += topBorder(parent);
				}
			} else if (element != this && Browser.Engine.webkit){
				position.x += leftBorder(element);
				position.y += topBorder(element);
			}

			element = element.offsetParent;
		}
		if (Browser.Engine.gecko && !borderBox(this)){
			position.x -= leftBorder(this);
			position.y -= topBorder(this);
		}
		return position;
	},

	getPosition: function(relative){
		if (isBody(this)) return {x: 0, y: 0};
		var offset = this.getOffsets(), scroll = this.getScrolls();
		var position = {x: offset.x - scroll.x, y: offset.y - scroll.y};
		var relativePosition = (relative && (relative = $(relative))) ? relative.getPosition() : {x: 0, y: 0};
		return {x: position.x - relativePosition.x, y: position.y - relativePosition.y};
	},

	getCoordinates: function(element){
		if (isBody(this)) return this.getWindow().getCoordinates();
		var position = this.getPosition(element), size = this.getSize();
		var obj = {left: position.x, top: position.y, width: size.x, height: size.y};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	},

	computePosition: function(obj){
		return {left: obj.x - styleNumber(this, 'margin-left'), top: obj.y - styleNumber(this, 'margin-top')};
	},

	position: function(obj){
		return this.setStyles(this.computePosition(obj));
	}

});

Native.implement([Document, Window], {

	getSize: function(){
		if (Browser.Engine.presto || Browser.Engine.webkit) {
			var win = this.getWindow();
			return {x: win.innerWidth, y: win.innerHeight};
		}
		var doc = getCompatElement(this);
		return {x: doc.clientWidth, y: doc.clientHeight};
	},

	getScroll: function(){
		var win = this.getWindow(), doc = getCompatElement(this);
		return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
	},

	getScrollSize: function(){
		var doc = getCompatElement(this), min = this.getSize();
		return {x: Math.max(doc.scrollWidth, min.x), y: Math.max(doc.scrollHeight, min.y)};
	},

	getPosition: function(){
		return {x: 0, y: 0};
	},

	getCoordinates: function(){
		var size = this.getSize();
		return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
	}

});

// private methods

var styleString = Element.getComputedStyle;

function styleNumber(element, style){
	return styleString(element, style).toInt() || 0;
};

function borderBox(element){
	return styleString(element, '-moz-box-sizing') == 'border-box';
};

function topBorder(element){
	return styleNumber(element, 'border-top-width');
};

function leftBorder(element){
	return styleNumber(element, 'border-left-width');
};

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
};

function getCompatElement(element){
	var doc = element.getDocument();
	return (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
};

})();

//aliases

Native.implement([Window, Document, Element], {

	getHeight: function(){
		return this.getSize().y;
	},

	getWidth: function(){
		return this.getSize().x;
	},

	getScrollTop: function(){
		return this.getScroll().y;
	},

	getScrollLeft: function(){
		return this.getScroll().x;
	},

	getScrollHeight: function(){
		return this.getScrollSize().y;
	},

	getScrollWidth: function(){
		return this.getScrollSize().x;
	},

	getTop: function(){
		return this.getPosition().y;
	},

	getLeft: function(){
		return this.getPosition().x;
	}

});

MooTools.More = {
	'version': 'rc01'
};
/*
Script: Drag.js
	The base Drag Class. Can be used to drag and resize Elements using mouse events.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
		Tom Occhinno
		Jan Kassens
*/

var Drag = new Class({

	Implements: [Events, Options],

	options: {/*
		onBeforeStart: $empty(thisElement),
		onStart: $empty(thisElement, event),
		onSnap: $empty(thisElement)
		onDrag: $empty(thisElement, event),
		onCancel: $empty(thisElement),
		onComplete: $empty(thisElement, event),*/
		snap: 6,
		unit: 'px',
		grid: false,
		style: true,
		limit: false,
		handle: false,
		invert: false,
		preventDefault: false,
		modifiers: {x: 'left', y: 'top'}
	},

	initialize: function(){
		var params = Array.link(arguments, {'options': Object.type, 'element': $defined});
		this.element = $(params.element);
		this.document = this.element.getDocument();
		this.setOptions(params.options || {});
		var htype = $type(this.options.handle);
		this.handles = ((htype == 'array' || htype == 'collection') ? $$(this.options.handle) : $(this.options.handle)) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};

		this.selection = (Browser.Engine.trident) ? 'selectstart' : 'mousedown';

		this.bound = {
			start: this.start.bind(this),
			check: this.check.bind(this),
			drag: this.drag.bind(this),
			stop: this.stop.bind(this),
			cancel: this.cancel.bind(this),
			eventStop: $lambda(false)
		};
		this.attach();
	},

	attach: function(){
		this.handles.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach: function(){
		this.handles.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start: function(event){
		if (this.options.preventDefault) event.preventDefault();
		this.mouse.start = event.page;
		this.fireEvent('beforeStart', this.element);
		var limit = this.options.limit;
		this.limit = {x: [], y: []};
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			if (this.options.style) this.value.now[z] = this.element.getStyle(this.options.modifiers[z]).toInt();
			else this.value.now[z] = this.element[this.options.modifiers[z]];
			if (this.options.invert) this.value.now[z] *= -1;
			this.mouse.pos[z] = event.page[z] - this.value.now[z];
			if (limit && limit[z]){
				for (var i = 2; i--; i){
					if ($chk(limit[z][i])) this.limit[z][i] = $lambda(limit[z][i])();
				}
			}
		}
		if ($type(this.options.grid) == 'number') this.options.grid = {x: this.options.grid, y: this.options.grid};
		this.document.addEvents({mousemove: this.bound.check, mouseup: this.bound.cancel});
		this.document.addEvent(this.selection, this.bound.eventStop);
	},

	check: function(event){
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	drag: function(event){
		if (this.options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];
			if (this.options.invert) this.value.now[z] *= -1;
			if (this.options.limit && this.limit[z]){
				if ($chk(this.limit[z][1]) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
				} else if ($chk(this.limit[z][0]) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
				}
			}
			if (this.options.grid[z]) this.value.now[z] -= ((this.value.now[z] - this.limit[z][0]) % this.options.grid[z]);
			if (this.options.style) this.element.setStyle(this.options.modifiers[z], this.value.now[z] + this.options.unit);
			else this.element[this.options.modifiers[z]] = this.value.now[z];
		}
		this.fireEvent('drag', [this.element, event]);
	},

	cancel: function(event){
		this.document.removeEvent('mousemove', this.bound.check);
		this.document.removeEvent('mouseup', this.bound.cancel);
		if (event){
			this.document.removeEvent(this.selection, this.bound.eventStop);
			this.fireEvent('cancel', this.element);
		}
	},

	stop: function(event){
		this.document.removeEvent(this.selection, this.bound.eventStop);
		this.document.removeEvent('mousemove', this.bound.drag);
		this.document.removeEvent('mouseup', this.bound.stop);
		if (event) this.fireEvent('complete', [this.element, event]);
	}

});

Element.implement({

	makeResizable: function(options){
		var drag = new Drag(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
		this.store('resizer', drag);
		return drag.addEvent('drag', function(){
			this.fireEvent('resize', drag);
		}.bind(this))
	}

});

/*
Script: Drag.Move.js
	A Drag extension that provides support for the constraining of draggables to containers and droppables.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
		Tom Occhinno
		Jan Kassens*/

Drag.Move = new Class({

	Extends: Drag,

	options: {/*
		onEnter: $empty(thisElement, overed),
		onLeave: $empty(thisElement, overed),
		onDrop: $empty(thisElement, overed, event),*/
		droppables: [],
		container: false,
		precalculate: false,
		includeMargins: true
	},

	initialize: function(element, options){
		this.parent(element, options);
		this.droppables = $$(this.options.droppables);
		this.container = $(this.options.container);
		if (this.container && $type(this.container) != 'element') this.container = $(this.container.getDocument().body);

		var position = this.element.getStyle('position');
		if (position=='static') position = 'absolute';
		if ([this.element.getStyle('left'), this.element.getStyle('top')].contains('auto')) this.element.position(this.element.getPosition(this.element.offsetParent));
		this.element.setStyle('position', position);

		this.addEvent('start', this.checkDroppables, true);

		this.overed = null;
	},

	start: function(event){
		if (this.container){
			var ccoo = this.container.getCoordinates(this.element.getOffsetParent()), cbs = {}, ems = {};

			['top', 'right', 'bottom', 'left'].each(function(pad){
				cbs[pad] = this.container.getStyle('border-' + pad).toInt();
				ems[pad] = this.element.getStyle('margin-' + pad).toInt();
			}, this);

			var width = this.element.offsetWidth + ems.left + ems.right;
			var height = this.element.offsetHeight + ems.top + ems.bottom;

			if (this.options.includeMargins) {
				$each(ems, function(value, key) {
					ems[key] = 0;
				})
			}
			if (this.container == this.element.getOffsetParent()) {
				this.options.limit = {
					x: [0 - ems.left, ccoo.right - cbs.left - cbs.right - width + ems.right],
					y: [0 - ems.top, ccoo.bottom - cbs.top - cbs.bottom - height + ems.bottom]
				};
			} else {
				this.options.limit = {
					x: [ccoo.left + cbs.left - ems.left, ccoo.right - cbs.right - width + ems.right],
					y: [ccoo.top + cbs.top - ems.top, ccoo.bottom - cbs.bottom - height + ems.bottom]
				};
			}

		}
		if (this.options.precalculate){
			this.positions = this.droppables.map(function(el) {
				return el.getCoordinates();
			});
		}
		this.parent(event);
	},

	checkAgainst: function(el, i){
		el = (this.positions) ? this.positions[i] : el.getCoordinates();
		var now = this.mouse.now;
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},

	checkDroppables: function(){
		var overed = this.droppables.filter(this.checkAgainst, this).getLast();
		if (this.overed != overed){
			if (this.overed) this.fireEvent('leave', [this.element, this.overed]);
			if (overed) this.fireEvent('enter', [this.element, overed]);
			this.overed = overed;
		}
	},

	drag: function(event){
		this.parent(event);
		if (this.droppables.length) this.checkDroppables();
	},

	stop: function(event){
		this.checkDroppables();
		this.fireEvent('drop', [this.element, this.overed, event]);
		this.overed = null;
		return this.parent(event);
	}

});

Element.implement({

	makeDraggable: function(options){
		var drag = new Drag.Move(this, options);
		this.store('dragger', drag);
		return drag;
	}

});

/*
Script: Class.Binds.js
	Automagically binds specified methods in a class to the instance of the class.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

Class.Mutators.Binds = function(binds){
    return binds;
};

Class.Mutators.initialize = function(initialize){
	
	return function(){
		$splat(this.Binds).each(function(name){
			var original = this[name];
			if (original) this[name] = original.bind(this);
		}, this);
		return initialize.apply(this, arguments);
	};

};
/*
Script: Slider.js
	Class for creating horizontal and vertical slider controls.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

var Slider = new Class({

	Implements: [Events, Options],

	Binds: ['clickedElement', 'draggedKnob', 'scrolledElement'],

	options: {/*
		onTick: $empty(intPosition),
		onChange: $empty(intStep),
		onComplete: $empty(strStep),*/
		onTick: function(position){
			if (this.options.snap) position = this.toPosition(this.step);
			this.knob.setStyle(this.property, position);
		},
		snap: false,
		offset: 0,
		range: false,
		wheel: false,
		steps: 100,
		mode: 'horizontal'
	},

	initialize: function(element, knob, options){
		this.setOptions(options);
		this.element = $(element);
		this.knob = $(knob);
		this.previousChange = this.previousEnd = this.step = -1;
		this.element.addEvent('mousedown', this.clickedElement);
		if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement);
		var offset, limit = {}, modifiers = {'x': false, 'y': false};
		switch (this.options.mode){
			case 'vertical':
				this.axis = 'y';
				this.property = 'top';
				offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = 'x';
				this.property = 'left';
				offset = 'offsetWidth';
		}
		this.half = this.knob[offset] / 2;
		this.full = this.element[offset] - this.knob[offset] + (this.options.offset * 2);
		this.min = $chk(this.options.range[0]) ? this.options.range[0] : 0;
		this.max = $chk(this.options.range[1]) ? this.options.range[1] : this.options.steps;
		this.range = this.max - this.min;
		this.steps = this.options.steps || this.full;
		this.stepSize = Math.abs(this.range) / this.steps;
		this.stepWidth = this.stepSize * this.full / Math.abs(this.range) ;

		this.knob.setStyle('position', 'relative').setStyle(this.property, - this.options.offset);
		modifiers[this.axis] = this.property;
		limit[this.axis] = [- this.options.offset, this.full - this.options.offset];

		this.drag = new Drag(this.knob, {
			snap: 0,
			limit: limit,
			modifiers: modifiers,
			onDrag: this.draggedKnob,
			onBeforeStart: (function(){
				this.isDragging = true;
			}).bind(this),
			onStart: this.draggedKnob,
			onComplete: function(){
				this.isDragging = false;
				this.draggedKnob();
				this.end();
			}.bind(this)
		});
		if (this.options.snap){
			this.drag.options.grid = Math.ceil(this.stepWidth);
			this.drag.options.limit[this.axis][1] = this.full;
		}
	},

	set: function(step){
		if (!((this.range > 0) ^ (step < this.min))) step = this.min;
		if (!((this.range > 0) ^ (step > this.max))) step = this.max;

		this.step = Math.round(step);
		this.checkStep();
		this.fireEvent('tick', this.toPosition(this.step));
		this.end();
		return this;
	},

	clickedElement: function(event){
		if (this.isDragging || event.target == this.knob) return;

		var dir = this.range < 0 ? -1 : 1;
		var position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
		position = position.limit(-this.options.offset, this.full -this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
		this.fireEvent('tick', position);
		this.end();
	},

	scrolledElement: function(event){
		var mode = (this.options.mode == 'horizontal') ? (event.wheel < 0) : (event.wheel > 0);
		this.set(mode ? this.step - this.stepSize : this.step + this.stepSize);
		event.stop();
	},

	draggedKnob: function(){
		var dir = this.range < 0 ? -1 : 1;
		var position = this.drag.value.now[this.axis];
		position = position.limit(-this.options.offset, this.full -this.options.offset);
		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
	},

	checkStep: function(){
		if (this.previousChange != this.step){
			this.previousChange = this.step;
			this.fireEvent('change', this.step);
		}
	},

	end: function(){
		if (this.previousEnd !== this.step){
			this.previousEnd = this.step;
			this.fireEvent('complete', this.step + '');
		}
	},

	toStep: function(position){
		var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
		return this.options.steps ? Math.round(step -= step % this.stepSize) : step;
	},

	toPosition: function(step){
		return (this.full * Math.abs(this.min - step)) / (this.steps * this.stepSize) - this.options.offset;
	}

});
/*
Script: Sortables.js
	Class for creating a drag and drop sorting interface for lists of items.

	License:
		MIT-style license.

	Authors:
		Tom Occhino
*/

var Sortables = new Class({

	Implements: [Events, Options],

	options: {/*
		onSort: $empty(element, clone),
		onStart: $empty(element, clone),
		onComplete: $empty(element),*/
		snap: 4,
		opacity: 1,
		clone: false,
		revert: false,
		handle: false,
		constrain: false
	},

	initialize: function(lists, options){
		this.setOptions(options);
		this.elements = [];
		this.lists = [];
		this.idle = true;

		this.addLists($$($(lists) || lists));
		if (!this.options.clone) this.options.revert = false;
		if (this.options.revert) this.effect = new Fx.Morph(null, $merge({duration: 250, link: 'cancel'}, this.options.revert));
	},

	attach: function(){
		this.addLists(this.lists);
		return this;
	},

	detach: function(){
		this.lists = this.removeLists(this.lists);
		return this;
	},

	addItems: function(){
		Array.flatten(arguments).each(function(element){
			this.elements.push(element);
			var start = element.retrieve('sortables:start', this.start.bindWithEvent(this, element));
			(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', start);
		}, this);
		return this;
	},

	addLists: function(){
		Array.flatten(arguments).each(function(list){
			this.lists.push(list);
			this.addItems(list.getChildren());
		}, this);
		return this;
	},

	removeItems: function(){
		return $$(Array.flatten(arguments).map(function(element){
			this.elements.erase(element);
			var start = element.retrieve('sortables:start');
			(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', start);
			
			return element;
		}, this));
	},

	removeLists: function(){
		return $$(Array.flatten(arguments).map(function(list){
			this.lists.erase(list);
			this.removeItems(list.getChildren());
			
			return list;
		}, this));
	},

	getClone: function(event, element){
		if (!this.options.clone) return new Element('div').inject(document.body);
		if ($type(this.options.clone) == 'function') return this.options.clone.call(this, event, element, this.list);
		return element.clone(true).setStyles({
			margin: '0px',
			position: 'absolute',
			visibility: 'hidden',
			'width': element.getStyle('width')
		}).inject(this.list).position(element.getPosition(element.getOffsetParent()));
	},

	getDroppables: function(){
		var droppables = this.list.getChildren();
		if (!this.options.constrain) droppables = this.lists.concat(droppables).erase(this.list);
		return droppables.erase(this.clone).erase(this.element);
	},

	insert: function(dragging, element){
		var where = 'inside';
		if (this.lists.contains(element)){
			this.list = element;
			this.drag.droppables = this.getDroppables();
		} else {
			where = this.element.getAllPrevious().contains(element) ? 'before' : 'after';
		}
		this.element.inject(element, where);
		this.fireEvent('sort', [this.element, this.clone]);
	},

	start: function(event, element){
		if (!this.idle) return;
		this.idle = false;
		this.element = element;
		this.opacity = element.get('opacity');
		this.list = element.getParent();
		this.clone = this.getClone(event, element);

		this.drag = new Drag.Move(this.clone, {
			snap: this.options.snap,
			container: this.options.constrain && this.element.getParent(),
			droppables: this.getDroppables(),
			onSnap: function(){
				event.stop();
				this.clone.setStyle('visibility', 'visible');
				this.element.set('opacity', this.options.opacity || 0);
				this.fireEvent('start', [this.element, this.clone]);
			}.bind(this),
			onEnter: this.insert.bind(this),
			onCancel: this.reset.bind(this),
			onComplete: this.end.bind(this)
		});

		this.clone.inject(this.element, 'before');
		this.drag.start(event);
	},

	end: function(){
		this.drag.detach();
		this.element.set('opacity', this.opacity);
		if (this.effect){
			var dim = this.element.getStyles('width', 'height');
			var pos = this.clone.computePosition(this.element.getPosition(this.clone.offsetParent));
			this.effect.element = this.clone;
			this.effect.start({
				top: pos.top,
				left: pos.left,
				width: dim.width,
				height: dim.height,
				opacity: 0.25
			}).chain(this.reset.bind(this));
		} else {
			this.reset();
		}
	},

	reset: function(){
		this.idle = true;
		this.clone.destroy();
		this.fireEvent('complete', this.element);
	},

	serialize: function(){
		var params = Array.link(arguments, {modifier: Function.type, index: $defined});
		var serial = this.lists.map(function(list){
			return list.getChildren().map(params.modifier || function(element){
				return element.get('id');
			}, this);
		}, this);

		var index = params.index;
		if (this.lists.length == 1) index = 0;
		return $chk(index) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});

/*
Script: MooTools.Lang.js
	Provides methods for localization.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

(function(){

	var data = {
		language: 'en-US',
		languages: {
			'en-US': {}
		},
		cascades: ['en-US']
	};
	
	var cascaded;

	MooTools.lang = new Events();

	$extend(MooTools.lang, {

		setLanguage: function(lang){
			if (!data.languages[lang]) return;
			data.language = lang;
			this.load();
			this.fireEvent('langChange', lang);
			return this;
		},

		load: function() {
			var langs = this.cascade(this.getCurrentLanguage());
			cascaded = {};
			$each(langs, function(set, setName){
				cascaded[setName] = this.lambda(set);
			}, this);
		},

		getCurrentLanguage: function(){
			return data.language;
		},

		addLanguage: function(lang){
			data.languages[lang] = data.languages[lang] || {};
			return this;
		},

		cascade: function(lang){
			var cascades = (data.languages[lang] || {}).cascades || [];
			cascades.combine(data.cascades);
			cascades.erase(lang).push(lang);
			var langs = cascades.map(function(lng){
				return data.languages[lng];
			}, this);
			return $merge.apply(this, langs);
		},

		lambda: function(set) {
			(set||{}).get = function(key, args) {
				var key = arguments[0];
				return $lambda(set[key]).apply(this, $splat(args));
			};
			return set;
		},

		get: function(set, key, args){
			if (cascaded && cascaded[set]) return (key ? cascaded[set].get(key, args) : cascaded[set]);
		},

		set: function(lang, set, members){
			this.addLanguage(lang);
			langData = data.languages[lang];
			if (!langData[set]) langData[set] = {};
			$extend(langData[set], members);
			if (lang == this.getCurrentLanguage()) {
				this.load();
				this.fireEvent('langChange', lang);
			}
			return this;
		},

		list: function(){
			return $A(data.languages);
		}

	});

})();
/*
Script: Date.English.US.js
	Date messages for US English.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

MooTools.lang.set('en-US', 'Date', {

	months: function(i){
		return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i]
	},
	days: function(i) {
		return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
	},
	//culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year', '/'],
	AM: 'AM',
	PM: 'PM',

	/* Date.Extras */
	ordinal: function(dayOfMonth){
		//1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now'

});
/*
Script: FormValidator.English.js
	Date messages for English.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

MooTools.lang.set('en-US', 'FormValidator', {

	required:'This field is required.',
	minLength:'Please enter at least {minLength} characters (you entered {length} characters).',
	maxLength:'Please enter no more than {maxLength} characters (you entered {length} characters).',
	integer:'Please enter an integer in this field. Numbers with decimals (e.g. 1.25) are not permitted.',
	numeric:'Please enter only numeric values in this field (i.e. "1" or "1.1" or "-1" or "-1.1").',
	digits:'Please use numbers and punctuation only in this field (for example, a phone number with dashes or dots is permitted).',
	alpha:'Please use letters only (a-z) with in this field. No spaces or other characters are allowed.',
	alphanum:'Please use only letters (a-z) or numbers (0-9) only in this field. No spaces or other characters are allowed.',
	dateSuchAs:'Please enter a valid date such as {date}',
	dateInFormatMDY:'Please enter a valid date such as MM/DD/YYYY (i.e. "12/31/1999")',
	email:'Please enter a valid email address. For example "fred@domain.com".',
	url:'Please enter a valid URL such as http://www.google.com.',
	currencyDollar:'Please enter a valid $ amount. For example $100.00 .',
	oneRequired:'Please enter something for at least one of these inputs.',
	errorPrefix: 'Error: ',
	warningPrefix: 'Warning: ',

	//FormValidator.Extras

	noSpace: 'There can be no spaces in this input.',
	reqChkByNode: 'No items are selected.',
	requiredChk: 'This field is required.',
	reqChkByName: 'Please select a {label}.',
	match: 'This field needs to match the {matchName} field',
	startDate: 'the start date',
	endDate: 'the end date',
	currendDate: 'the current date',
	afterDate: 'The date should be the same or after {label}.',
	beforeDate: 'The date should be the same or before {label}.',
	startMonth: 'Please select a start month',
	sameMonth: 'These two dates must be in the same month - you must change one or the other.'

});
/*
Script: Element.Measure.js
	Extends the Element native object to include methods useful in measuring dimensions.

	Element.measure / .expose methods by Daniel Steigerwald
	License: MIT-style license.
	Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

Element.implement({

	measure: function(fn){
		var vis = function(el) {
			return !!(!el || el.offsetHeight || el.offsetWidth);
		};
		if (vis(this)) return fn.apply(this);
		var parent = this.getParent(),
			toMeasure = [], 
			restorers = [];
		while (!vis(parent) && parent != document.body) {
			toMeasure.push(parent.expose());
			parent = parent.getParent();
		}
		var restore = this.expose();
		var result = fn.apply(this);
		restore();
		toMeasure.each(function(restore){
			restore();
		});
		return result;
	},

	expose: function(){
		if (this.getStyle('display') != 'none') return $empty;
		var before = this.getStyles('display', 'position', 'visibility');
		return this.setStyles({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		}).setStyles.pass(before, this);
	},

	getDimensions: function(options){
		options = $merge({computeSize: false},options);
		var dim = {};
		var getSize = function(el, options){
			return (options.computeSize)?el.getComputedSize(options):el.getSize();
		};
		if (this.getStyle('display') == 'none'){
			dim = this.measure(function(){
				return getSize(this, options);
			});
		} else {
			try { //safari sometimes crashes here, so catch it
				dim = getSize(this, options);
			}catch(e){}
		}
		return $chk(dim.x) ? $extend(dim, {width: dim.x, height: dim.y}) : $extend(dim, {x: dim.width, y: dim.height});
	},

	getComputedSize: function(options){
		options = $merge({
			styles: ['padding','border'],
			plains: {
				height: ['top','bottom'],
				width: ['left','right']
			},
			mode: 'both'
		}, options);
		var size = {width: 0,height: 0};
		switch (options.mode){
			case 'vertical':
				delete size.width;
				delete options.plains.width;
				break;
			case 'horizontal':
				delete size.height;
				delete options.plains.height;
				break;
		};
		var getStyles = [];
		//this function might be useful in other places; perhaps it should be outside this function?
		$each(options.plains, function(plain, key){
			plain.each(function(edge){
				options.styles.each(function(style){
					getStyles.push((style == "border") ? style + '-' + edge + '-' + 'width' : style + '-' + edge);
				});
			});
		});
		var styles = {};
		getStyles.each(function(style){ styles[style] = this.getComputedStyle(style); }, this);
		var subtracted = [];
		$each(options.plains, function(plain, key){ //keys: width, height, plains: ['left', 'right'], ['top','bottom']
			size['total' + key.capitalize()] = 0;
			size['computed' + key.capitalize()] = 0;
			plain.each(function(edge){ //top, left, right, bottom
				size['computed' + edge.capitalize()] = 0;
				getStyles.each(function(style, i){ //padding, border, etc.
					//'padding-left'.test('left') size['totalWidth'] = size['width'] + [padding-left]
					if (style.test(edge)){
						styles[style] = styles[style].toInt(); //styles['padding-left'] = 5;
						if (isNaN(styles[style]))styles[style] = 0;
						size['total' + key.capitalize()] = size['total' + key.capitalize()] + styles[style];
						size['computed' + edge.capitalize()] = size['computed' + edge.capitalize()] + styles[style];
					}
					//if width != width (so, padding-left, for instance), then subtract that from the total
					if (style.test(edge) && key != style &&
						(style.test('border') || style.test('padding')) && !subtracted.contains(style)){
						subtracted.push(style);
						size['computed' + key.capitalize()] = size['computed' + key.capitalize()]-styles[style];
					}
				});
			});
		});

		['Width', 'Height'].each(function(value){
			var lower = value.toLowerCase();
			if(!$chk(size[lower])) return;

			size[lower] = size[lower] + this['offset' + value] + size['computed' + value];
			size['total' + value] = size[lower] + size['total' + value];
			delete size['computed' + value];
		}, this);

		return $extend(styles, size);
	}

});
/*
Script: Tips.js
	Class for creating nice tips that follow the mouse cursor when hovering an element.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
		Christoph Pojer
*/

var Tips = new Class({

	Implements: [Events, Options],

	options: {
		onShow: function(tip){
			tip.setStyle('visibility', 'visible');
		},
		onHide: function(tip){
			tip.setStyle('visibility', 'hidden');
		},
		title: 'title',
		text: function(el){
			return el.get('rel') || el.get('href');
		},
		showDelay: 100,
		hideDelay: 100,
		className: null,
		offset: {x: 16, y: 16},
		fixed: false
	},

	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		this.container = new Element('div', {'class': 'tip'});
		this.tip = this.getTip();
		
		this.restore = false;
		if ($type(this.options.title)=='string'){
			var title = this.options.title;
			if (title=='title') this.restore = title;
			this.options.title = function(el){
				return el.get(title);
			};
		}
		if ($type(this.options.text)=='string'){
			var text = this.options.text;
			this.options.text = function(el){
				return el.get(text);
			};
		}
		
		if (params.elements) this.attach(params.elements);
	},
	
	getTip: function(){
		return new Element('div', {
			'class': this.options.className,
			styles: {
				visibility: 'hidden',
				display: 'none',
				position: 'absolute',
				top: 0,
				left: 0
			}
		}).adopt(
			new Element('div', {'class': 'tip-top'}),
			this.container,
			new Element('div', {'class': 'tip-bottom'})
		).inject(document.body)
	},
	
	attach: function(elements){
		$$(elements).each(function(element){
			var read = function(option) {
				return $type(option) == "function" ? option(element) : element.get(option);
			}
			var title = read(this.options.title);
			element.erase('title').store('tip:native', title).retrieve('tip:title', title);
			element.retrieve('tip:text', read(this.options.text));
			
			var events = ['enter', 'leave'];
			if (!this.options.fixed) events.push('move');
			
			events.each(function(value){
				element.addEvent('mouse' + value, element.retrieve('tip:' + value, this['element' + value.capitalize()].bindWithEvent(this, element)));
			}, this);
		}, this);
		
		return this;
	},
	
	detach: function(elements){
		$$(elements).each(function(element){
			['enter', 'leave', 'move'].each(function(value){
				element.removeEvent('mouse' + value, element.retrieve('tip:' + value) || $empty);
			});
			
			element.eliminate('tip:enter').eliminate('tip:leave').eliminate('tip:move');
			
			if (!this.restore) return;
			
			var original = element.retrieve('tip:native');
			if (original) element.set(this.restore, original);
		}, this);
		
		return this;
	},
	
	elementEnter: function(event, element){
		$A(this.container.childNodes).each(Element.dispose);
		
		['title', 'text'].each(function(value){
			var content = element.retrieve('tip:' + value);
			if (!content) return;
			
			this[value + 'Element'] = new Element('div', {'class': 'tip-' + value}).inject(this.container);
			this.fill(this[value + 'Element'], content);
		}, this);
		
		this.timer = $clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this, element);
		this.tip.setStyle('display', 'block');
		this.position((!this.options.fixed) ? event : {page: element.getPosition()});
	},
	
	elementLeave: function(event, element){
		$clear(this.timer);
		this.tip.setStyle('display', 'none');
		this.timer = this.hide.delay(this.options.hideDelay, this, element);
	},
	
	elementMove: function(event){
		this.position(event);
	},
	
	position: function(event){
		var size = window.getSize(), scroll = window.getScroll(),
			tip = {x: this.tip.offsetWidth, y: this.tip.offsetHeight},
			props = {x: 'left', y: 'top'},
			obj = {};
		
		for (var z in props){
			obj[props[z]] = event.page[z] + this.options.offset[z];
			if ((obj[props[z]] + tip[z] - scroll[z]) > size[z]) obj[props[z]] = event.page[z] - this.options.offset[z] - tip[z];
		}
		
		this.tip.setStyles(obj);
	},
	
	fill: function(element, contents){
		if(typeof contents == 'string') element.set('html', contents);
		else element.adopt(contents);
	},

	show: function(el){
		this.fireEvent('show', [this.tip, el]);
	},

	hide: function(el){
		this.fireEvent('hide', [this.tip, el]);
	}

});
/*
Script: Scroller.js
	Class which scrolls the contents of any Element (including the window) when the mouse reaches the Element's boundaries.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

var Scroller = new Class({

	Implements: [Events, Options],

	options: {
		area: 20,
		velocity: 1,
		onChange: function(x, y){
			this.element.scrollTo(x, y);
		},
		fps: 50
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = $(element);
		this.listener = ($type(this.element) != 'element') ? $(this.element.getDocument().body) : this.element;
		this.timer = null;
		
		this.bound = {
			attach: this.attach.bind(this),
			detach: this.detach.bind(this),
			getCoords: this.getCoords.bind(this)
		};
	},

	start: function(){
		this.listener.addEvents({
			mouseenter: this.bound.attach,
			mouseleave: this.bound.detach
		});
	},

	stop: function(){
		this.listener.removeEvents({
			mouseenter: this.bound.attach,
			mouseleave: this.bound.detach
		});
		this.timer = $clear(this.timer);
	},
	
	attach: function(){
		this.listener.addEvent('mousemove', this.bound.getCoords);
	},
	
	detach: function(){
		this.listener.removeEvent('mousemove', this.bound.getCoords);
		this.timer = $clear(this.timer);
	},

	getCoords: function(event){
		this.page = (this.listener.get('tag') == 'body') ? event.client : event.page;
		if (!this.timer) this.timer = this.scroll.periodical(Math.round(1000 / this.options.fps), this);
	},

	scroll: function(){
		var size = this.element.getSize(), 
			scroll = this.element.getScroll(), 
			pos = this.element.getOffsets(), 
			scrollSize = this.element.getScrollSize(), 
			change = {x: 0, y: 0};
		
		for (var z in this.page){
			if (this.page[z] < (this.options.area + pos[z]) && scroll[z] != 0)
				change[z] = (this.page[z] - this.options.area - pos[z]) * this.options.velocity;
			else if (this.page[z] + this.options.area > (size[z] + pos[z]) && scroll[z] + size[z] != scrollSize[z])
				change[z] = (this.page[z] - size[z] + this.options.area - pos[z]) * this.options.velocity;
		}
		if (change.y || change.x) this.fireEvent('change', [scroll.x + change.x, scroll.y + change.y]);
	}

});
/*
Script: URI.js
	Provides methods useful in managing the window location and uris.

	License:
		MIT-style license.

	String subclass based on:
		http://webreflection.blogspot.com/2008/10/subclassing-javascript-native-string.html

	Authors:
		Aaron Newton, Lennart Pilon, Valerio Proietti
*/

String.implement({
	
	parseQueryString: function(encodeKeys, encodeValues){
		encodeKeys = $pick(encodeKeys, true);
		encodeValues = $pick(encodeValues, true);
		var vars = this.split(/[&;]/), rs = {};
		if (vars.length) vars.each(function(val){
			var keys = val.split('=');
			if (keys.length && keys.length == 2){
				rs[(encodeKeys) ? encodeURIComponent(keys[0]):keys[0]] = (encodeValues) ? encodeURIComponent(keys[1]) : keys[1];
			}
		});
		return rs;
	},

	cleanQueryString: function(method){
		return this.split('&').filter(method || function(set){
			return $chk(set.split('=')[1]);
		}).join('&');
	}

});

var URI = new Class({

	Implements: Options,

	options: {
		regex: /^(?:(\w+):\/\/)?(?:(?:(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]+)?(?::(\d*))?)?([^#?]*)(?:\?([^#]*))?(?:#(.*))?$/,
		parts: ['full', 'scheme', 'user', 'password', 'host', 'port', 'path', 'query', 'fragment'],
		schemes: ['https','ftp','file','rtsp','mms'],
		required: ['scheme', 'host'],
		wrappers: {
			scheme: function(s) { return s ? s += '://' : '' },
			password: function(s) { return s ? ':' + s : '' },
			port: function(s) { return s ? ':' + s : ''},
			query: function(s) { return s ? '?' + s : ''},
			fragment: function(s) { return s ? '#' + s : ''}
		}
	},

	initialize: function(uri, options){
		this.setOptions(options);
		this.value = uri || document.location.href || '';
		this.parsed = this.parse(this.value);
	},

	valueOf: function(){
		return this.combine();
	},

	validate: function(parts, regex){
		parts = parts || this.options.parts;
		var valid = parts.every(function(part) {
			return !!this.parsed[part];
		}, this);
		return valid && (this.schemes.contains(bits.scheme) || !bits.scheme);
	},

	parse: function(value, regex, parts) {
		value = value || this.value;
		regex = regex || this.options.regex;
		parts = parts || this.options.parts;
		var match = this.value.match(regex);
		if (!match) return {};
		var bits = match.associate(parts);
		delete bits.full;
		return bits;
	},

	set: function(part, value){
		switch(part){
			case "data": return this.setData(value);
			case "value": 
				this.value = value;
				this.parse();
				return this;
		}
		var bits = this.parse();
		bits[part] = value;
		this.combine(bits);
		return this;
	},

	get: function(part){
		switch(part) {
			case "data": return this.getData();
			case "value": return this.toString();
		}
		return this.parse()[part];
	},

	getData: function(key){
		var qs = this.get('query');
		if (!$chk(qs)) return key ? null : {};
		var obj = decodeURI(qs).parseQueryString(false, false); 
		return key ? obj[key] : obj;
	},

	setData: function(values, merge){
		var merged = merge ? $merge(this.getData(), values) : values;
		var newQuery = '';
		for (key in merged) newQuery += encodeURIComponent(key) + '=' + encodeURIComponent(merged[key]) + '&';
		return this.set('query', newQuery.substring(0, newQuery.length-1));
	},

	clearData: function(){
		this.set('query', '');
	},

	combine: function(bits){
		bits = bits || this.parse();
		var result = '';
		$each(bits, function(value, key) {
			var wrapped = this.options.wrappers[key] ? this.options.wrappers[key](value) : value;
			result += wrapped ? wrapped : '';
		}, this);
		this.value = result;
		return this.value;
	},

	go: function(){
		document.location.href = this.value;
	}

});

URI.prototype.toString = function(){
	return this.combine();
};
/*
Script: Hash.Extras.js
	Extends the Hash native object to include getFromPath which allows a path notation to child elements.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

Hash.implement({

	getFromPath: function(notation){
		var source = this.getClean();
		notation.replace(/\[([^\]]+)\]|\.([^.[]+)|[^[.]+/g, function(match){
			if (!source) return;
			var prop = arguments[2] || arguments[1] || arguments[0];
			source = (prop in source) ? source[prop] : null;
			return match;
		});
		return source;
	},

	cleanValues: function(method){
		method = method || $defined;
		this.each(function(v, k){
			if (!method(v)) this.erase(k);
		}, this);
		return this;
	},

	run: function(){
		var args = arguments;
		this.each(function(v, k){
			if ($type(v) == 'function') v.run(args);
		});
	}

});
/*
Script: String.Extras.js
	Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

	License:
		MIT-style license.

	Authors:
		Aaron Newton
		Guillermo Rauch

*/

(function(){
  
var special = ['À','à','Á','á','Â','â','Ã','ã','Ä','ä','Å','å','Ă','ă','Ą','ą','Ć','ć','Č','č','Ç','ç', 'Ď','ď','Đ','đ', 'È','è','É','é','Ê','ê','Ë','ë','Ě','ě','Ę','ę', 'Ğ','ğ','Ì','ì','Í','í','Î','î','Ï','ï', 'Ĺ','ĺ','Ľ','ľ','Ł','ł', 'Ñ','ñ','Ň','ň','Ń','ń','Ò','ò','Ó','ó','Ô','ô','Õ','õ','Ö','ö','Ø','ø','ő','Ř','ř','Ŕ','ŕ','Š','š','Ş','ş','Ś','ś', 'Ť','ť','Ť','ť','Ţ','ţ','Ù','ù','Ú','ú','Û','û','Ü','ü','Ů','ů', 'Ÿ','ÿ','ý','Ý','Ž','ž','Ź','ź','Ż','ż', 'Þ','þ','Ð','ð','ß','Œ','œ','Æ','æ','µ'];

var standard = ['A','a','A','a','A','a','A','a','Ae','ae','A','a','A','a','A','a','C','c','C','c','C','c','D','d','D','d', 'E','e','E','e','E','e','E','e','E','e','E','e','G','g','I','i','I','i','I','i','I','i','L','l','L','l','L','l', 'N','n','N','n','N','n', 'O','o','O','o','O','o','O','o','Oe','oe','O','o','o', 'R','r','R','r', 'S','s','S','s','S','s','T','t','T','t','T','t', 'U','u','U','u','U','u','Ue','ue','U','u','Y','y','Y','y','Z','z','Z','z','Z','z','TH','th','DH','dh','ss','OE','oe','AE','ae','u'];

var tidymap = {
	"[\xa0\u2002\u2003\u2009]": " ",
	"\xb7": "*",
	"[\u2018\u2019]": "'",
	"[\u201c\u201d]": '"',
	"\u2026": "...",
	"\u2013": "-",
	"\u2014": "--",
	"\uFFFD": "&raquo;"
};

String.implement({
	
	standardize: function(){
		var text = this;
		special.each(function(ch, i){
			text = text.replace(new RegExp(ch, 'g'), standard[i]);
		});
		return text;
	},

	repeat: function(times){
		return new Array(times + 1).join(this);
	},

	pad: function(length, str, dir){
		if (this.length >= length) return this;
		str = str || ' ';
		var pad = str.repeat(length - this.length).substr(0, length - this.length);
		if (!dir || dir == 'right') return this + pad;
		if (dir == 'left') return pad + this;
		return pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
	},

	stripTags: function(){
		return this.replace(/<\/?[^>]+>/gi, '');
	},

	tidy: function(){
		var txt = this.toString();
		$each(tidymap, function(value, key){
			txt = txt.replace(new RegExp(key, 'g'), value);
		});
		return txt;
	}

});

})();
/*
Script: Date.js
	Extends the Date native object to include methods useful in managing dates.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
		Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
		Harald Kirshner - mail [at] digitarald.de; http://digitarald.de

*/

(function(){

new Native({name: 'Date', initialize: Date, protect: true});

['now','parse','UTC'].each(function(method){
	Native.genericize(Date, method, true);
});

Date.Methods = new Hash();

["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds", "Time", "TimezoneOffset",
	"Week", "Timezone", "GMTOffset", "DayOfYear", "LastMonth", "UTCDate", "UTCDay", "UTCFullYear",
	"AMPM", "UTCHours", "UTCMilliseconds", "UTCMinutes", "UTCMonth", "UTCSeconds"].each(function(method){
	Date.Methods.set(method.toLowerCase(), method);
});

$each({
	ms: "Milliseconds",
	year: "FullYear",
	min: "Minutes",
	mo: "Month",
	sec: "Seconds",
	hr: "Hours"
}, function(value, key){
	Date.Methods.set(key, value);
});

var zeroize = function(what, length){
	return '0'.repeat(length - what.toString().length) + what;
};

Date.implement({

	set: function(key, value){
		key = key.toLowerCase();
		var m = Date.Methods;
		if (m.has(key)) this['set'+m.get(key)](value);
		return this;
	},

	get: function(key){
		key = key.toLowerCase();
		var m = Date.Methods;
		if (m.has(key)) return this['get'+m.get(key)]();
		return null;
	},

	clone: function(){
		return new Date(this.get('time'));
	},

	increment: function(interval, times){
		return this.multiply(interval, times);
	},

	decrement: function(interval, times){
		return this.multiply(interval, times, false);
	},

	multiply: function(interval, times, increment){
		interval = interval || 'day';
		times = $pick(times, 1);
		increment = $pick(increment, true);
		var multiplier = increment?1:-1;
		var month = this.format("%m").toInt()-1;
		var year = this.format("%Y").toInt();
		var time = this.get('time');
		var offset = 0;
		switch (interval) {
				case 'year':
					times.times(function(val) {
						if (Date.isLeapYear(year+val) && month > 1 && multiplier > 0) val++;
						if (Date.isLeapYear(year+val) && month <= 1 && multiplier < 0) val--;
						offset += Date.units.year(year+val);
					});
					break;
				case 'month':
					times.times(function(val){
						if (multiplier < 0) val++;
						var mo = month+(val*multiplier);
						var year = year;
						if (mo < 0) {
							year--;
							mo = 12+mo;
						}
						if (mo > 11 || mo < 0) {
							year += (mo/12).toInt()*multiplier;
							mo = mo%12;
						}
						offset += Date.units.month(mo, year);
					});
					break;
				case 'day':
					return this.set('date', this.get('date')+(multiplier*times));
				default:
					offset = Date.units[interval]()*times;
					break;
		}
		this.set('time', time+(offset*multiplier));
		return this;
	},

	isLeapYear: function(){
		return Date.isLeapYear(this.get('year'));
	},

	clearTime: function(){
		['hr', 'min', 'sec', 'ms'].each(function(t){
			this.set(t, 0);
		}, this);
		return this;
	},

	diff: function(d, resolution){
		resolution = resolution || 'day';
		if ($type(d) == 'string') d = Date.parse(d);
		switch (resolution){
			case 'year':
				return d.format("%Y").toInt() - this.format("%Y").toInt();
				break;
			case 'month':
				var months = (d.format("%Y").toInt() - this.format("%Y").toInt())*12;
				return months + d.format("%m").toInt() - this.format("%m").toInt();
				break;
			default:
				var diff = d.get('time') - this.get('time');
				if (diff < 0 && Date.units[resolution]() > (-1*(diff))) return 0;
				else if (diff >= 0 && diff < Date.units[resolution]()) return 0;
				return ((d.get('time') - this.get('time')) / Date.units[resolution]()).round();
		}
	},

	getWeek: function(){
		var day = (new Date(this.get('year'), 0, 1)).get('date');
		return Math.round((this.get('dayofyear') + (day > 3 ? day - 4 : day + 3)) / 7);
	},

	getTimezone: function(){
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},

	getGMTOffset: function(){
		var off = this.get('timezoneOffset');
		return ((off > 0) ? '-' : '+')
			+ zeroize(Math.floor(Math.abs(off) / 60), 2)
			+ zeroize(off % 60, 2);
	},

	parse: function(str){
		this.set('time', Date.parse(str));
		return this;
	},

	isValid: function(date) {
		return !!(date || this).valueOf();
	},

	format: function(f){
		if (!this.isValid()) return 'invalid date';
		f = f || "%x %X";
		//replace short-hand with actual format
		f = ({
			db: '%Y-%m-%d %H:%M:%S',
			compact: '%Y%m%dT%H%M%S',
			iso8601: '%Y-%m-%dT%H:%M:%S%T',
			rfc822: '%a, %d %b %Y %H:%M:%S %Z',
			'short': '%d %b %H:%M',
			'long': '%B %d, %Y %H:%M'
		})[f.toLowerCase()] || f;
		var d = this;
		return f.replace(/\%([aAbBcdHIjmMpSUWwxXyYTZ])/g,
			function($1, $2){
				switch ($2){
					case 'a': return Date.getMsg('days', d.get('day')).substr(0, 3);
					case 'A': return Date.getMsg('days', d.get('day'));
					case 'b': return Date.getMsg('months', d.get('month')).substr(0, 3);
					case 'B': return Date.getMsg('months', d.get('month'));
					case 'c': return d.toString();
					case 'd': return zeroize(d.get('date'), 2);
					case 'H': return zeroize(d.get('hr'), 2);
					case 'I': return ((d.get('hr') % 12) || 12);
					case 'j': return zeroize(d.get('dayofyear'), 3);
					case 'm': return zeroize((d.get('mo') + 1), 2);
					case 'M': return zeroize(d.get('min'), 2);
					case 'p': return d.get('hr') < 12 ? 'AM' : 'PM';
					case 'S': return zeroize(d.get('seconds'), 2);
					case 'U': return zeroize(d.get('week'), 2);
					case 'W': throw new Error('%W is not supported yet');
					case 'w': return d.get('day');
					case 'x':
						var c = Date.getMsg('dateOrder');
						//return d.format("%{0}{3}%{1}{3}%{2}".substitute(c.map(function(s){return s.substr(0,1)}))); //grr!
						return d.format('%' + c[0].substr(0,1) +
							c[3] + '%' + c[1].substr(0,1) +
							c[3] + '%' + c[2].substr(0,1).toUpperCase());
					case 'X': return d.format('%I:%M%p');
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');
					case 'T': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
					case '%': return '%';
				}
				return $2;
			}
		);
	},

	setAMPM: function(ampm){
		ampm = ampm.toUpperCase();
		if (this.format("%H").toInt() > 11 && ampm == Date.getMsg('AM'))
			return this.decrement('hour', 12);
		else if (this.format("%H").toInt() < 12 && ampm == Date.getMsg('PM'))
			return this.increment('hour', 12);
		return this;
	}

});

Date.alias('diff', 'compare');
Date.alias('format', 'strftime');

var nativeParse = Date.parse;

var daysInMonth = function(monthIndex, year){
	if (Date.isLeapYear(year.toInt()) && monthIndex === 1) return 29;
	return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex];
};


$extend(Date, {

	getMsg: function(key, args) {
		return MooTools.lang.get('Date', key, args);
	},

	units: {
		ms: $lambda(1),
		second: $lambda(1000),
		minute: $lambda(60000),
		hour: $lambda(3600000),
		day: $lambda(86400000),
		week: $lambda(608400000),
		month: function(monthIndex, year){
			var d = new Date();
			return daysInMonth($pick(monthIndex,d.format("%m").toInt()), $pick(year,d.format("%Y").toInt())) * 86400000;
		},
		year: function(year){
			year = year || new Date().format("%Y").toInt();
			return Date.isLeapYear(year.toInt())?31622400000:31536000000;
		}
	},

	isLeapYear: function(yr){
		return new Date(yr,1,29).getDate() == 29;
	},

	fixY2K: function(d){
		if (!isNaN(d)){
			var newDate = new Date(d);
			if (newDate.get('year') < 2000 && d.toString().indexOf(newDate.get('year')) < 0) newDate.increment('year', 100);
			return newDate;
		} else {
			return d;
		}
	},

	parse: function(from){
		var t = $type(from);
		if (t == 'number') return new Date(from);
		if (t != 'string') return from;
		if (!from.length) return null;
		var parsed;
		Date.parsePatterns.each(function(pattern){
			if (parsed) return;
			var r = Date.parsePatterns[i].re.exec(from);
			if (r) parsed = Date.parsePatterns[i].handler(r);
		});
		return parsed || new Date(nativeParse(from));
	},

	parseDay: function(day, num){
		var ret = -1;
		switch ($type(day)){
			case 'number':
				ret = Date.getMsg('days', day - 1) || false;
				if (!ret) throw new Error('Invalid day index value must be between 1 and 7');
				break;
			case 'string':
				var match = Date.getMsg('days').filter(function(name){
					return this.test(name);
				}, new RegExp('^' + day, 'i'));
				if (!match.length) throw new Error('Invalid day string');
				if (match.length > 1) throw new Error('Ambiguous day');
				ret = match[0];
		}
		return (num) ? Date.getMsg('days').indexOf(ret) : ret;
	},

	parseMonth: function(month, num){
		var ret = -1;
		switch ($type(month)){
			case 'object':
				ret = Date.getMsg('months')[month.get('mo')];
				break;
			case 'number':
				ret = Date.getMsg('months')[month - 1] || false;
				if (!ret) throw new Error('Invalid month index value must be between 1 and 12:' + index);
				break;
			case 'string':
				var match = Date.getMsg('months').filter(function(name){
					return this.test(name);
				}, new RegExp('^' + month, 'i'));
				if (!match.length) throw new Error('Invalid month string');
				if (match.length > 1) throw new Error('Ambiguous month');
				ret = match[0];
		}
		return (num) ? Date.getMsg('months').indexOf(ret) : ret;
	},

	parseUTC: function(value){
		var localDate = new Date(value);
		var utcSeconds = Date.UTC(localDate.get('year'), localDate.get('mo'),
		localDate.get('date'), localDate.get('hr'), localDate.get('min'), localDate.get('sec'));
		return new Date(utcSeconds);
	},

	orderIndex: function(unit){
		return Date.getMsg('dateOrder').indexOf(unit)+1;
	},

	parsePatterns: [
		{
			//"12.31.08", "12-31-08", "12/31/08", "12.31.2008", "12-31-2008", "12/31/2008"
			re: /^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})$/,
			handler: function(bits){
				var d = new Date(bits[Date.orderIndex('year')],
								 bits[Date.orderIndex('month')] - 1,
								 bits[Date.orderIndex('date')]);
				return Date.fixY2K(d);
			}
		},
		//"12.31.08", "12-31-08", "12/31/08", "12.31.2008", "12-31-2008", "12/31/2008"
		//above plus "10:45pm" ex: 12.31.08 10:45pm
		{
			re: /^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})\s(\d{1,2}):(\d{1,2})(\w{2})$/,
			handler: function(bits){
				var d = new Date(bits[Date.orderIndex('year')],
								 bits[Date.orderIndex('month')] - 1,
								 bits[Date.orderIndex('date')]);
				d.set('hr', bits[4]);
				d.set('min', bits[5]);
				d.set('ampm', bits[6]);
				return Date.fixY2K(d);
			}
		},
		{
			//"12.31.08 11:59:59", "12-31-08 11:59:59", "12/31/08 11:59:59", "12.31.2008 11:59:59", "12-31-2008 11:59:59", "12/31/2008 11:59:59"
			re: /^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/,
			handler: function(bits){
				var d = new Date(bits[Date.orderIndex('year')],
								 bits[Date.orderIndex('month')] - 1,
								 bits[Date.orderIndex('date')]);
				d.set('hr', bits[4]);
				d.set('min', bits[5]);
				d.set('sec', bits[6]);
				return Date.fixY2K(d);
			}
		}
	]

});

})();
/*
Script: Date.Extras.js
	Extends the Date native object to include extra methods (on top of those in Date.js).

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

["LastDayOfMonth", "Ordinal"].each(function(method){
	Date.Methods.set(method.toLowerCase(), method);
});


Date.implement({

	timeDiffInWords: function(relative_to){
		return Date.distanceOfTimeInWords(this, relative_to || new Date);
	},

	getOrdinal: function(dayOfMonth){
		return Date.getMsg('ordinal', dayOfMonth || this.get('date'));
	},

	getDayOfYear: function(){
		return ((Date.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 1, 0, 0, 0)
			- Date.UTC(this.getFullYear(), 0, 1, 0, 0, 0) ) / Date.units.day());
	},

	getLastDayOfMonth: function(){
		var ret = this.clone();
		ret.setMonth(ret.getMonth() + 1, 0);
		return ret.getDate();
	}

});

Date.alias('timeDiffInWords', 'timeAgoInWords');

$extend(Date, {

	distanceOfTimeInWords: function(fromTime, toTime){
		return this.getTimePhrase(((toTime.getTime() - fromTime.getTime()) / 1000).toInt(), fromTime, toTime);
	},

	getTimePhrase: function(delta, fromTime, toTime){
		var getPhrase = function(){
			var suffix;
			if (delta >= 0){
				suffix = 'Ago';
			} else {
				delta = delta * -1;
				suffix = 'Until';
			}
			if (delta < 60){
				return Date.getMsg('lessThanMinute' + suffix, delta);
			} else if (delta < 120){
				return Date.getMsg('minute' + suffix, delta);
			} else if (delta < (45*60)){
				delta = (delta / 60).round();
				return Date.getMsg('minutes' + suffix, delta);
			} else if (delta < (90*60)){
				return Date.getMsg('hour' + suffix, delta);
			} else if (delta < (24*60*60)){
				delta = (delta / 3600).round();
				return Date.getMsg('hours' + suffix, delta);
			} else if (delta < (48*60*60)){
				return Date.getMsg('day' + suffix, delta);
			} else {
				delta = (delta / 86400).round();
				return Date.getMsg('days' + suffix, delta);
			}
		};
		return getPhrase().substitute({delta: delta});
	}

});


Date.parsePatterns.extend([

	{
		//"1999-12-31 23:59:59"
		re: /^(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/,
		handler: function(bits){
			var d = new Date();
			d.set('yr', bits[1]);
			d.set('date', bits[3]);
			d.set('mo', bits[2] - 1);
			d.set('hr', bits[4]);
			d.set('min', bits[5]);
			d.set('sec', bits[6]);
			return d;
		}
	},

	{
		// yyyy-mm-ddTHH:MM:SS-0500 (ISO8601) i.e.2007-04-17T23:15:22Z
		// inspired by: http://delete.me.uk/2005/03/iso8601.html
		re: /^(\d{4})(?:-?(\d{2})(?:-?(\d{2})(?:[T ](\d{2})(?::?(\d{2})(?::?(\d{2})(?:\.(\d+))?)?)?(?:Z|(?:([-+])(\d{2})(?::?(\d{2}))?)?)?)?)?)?$/,
		handler: function(bits){
			var offset = 0;
			var d = new Date(bits[1], 0, 1);
			if (bits[3]) d.set('date', bits[3]);
			if (bits[2]) d.set('mo', bits[2] - 1);
			if (bits[4]) d.set('hr', bits[4]);
			if (bits[5]) d.set('min', bits[5]);
			if (bits[6]) d.set('sec', bits[6]);
			if (bits[7]) d.set('ms', ('0.' + bits[7]).toInt() * 1000);
			if (bits[9]){
				offset = (bits[9].toInt() * 60) + bits[10].toInt();
				offset *= ((bits[8] == '-') ? 1 : -1);
			}
			//offset -= d.getTimezoneOffset();
			d.setTime((d * 1) + (offset * 60 * 1000).toInt());
			return d;
		}
	},

	{
		//"today"
		re: /^tod/i,
		handler: function(){
			return new Date();
		}
	},

	{
		//"tomorow"
		re: /^tom/i,
		handler: function(){
			return new Date().increment();
		}
	},

	{
		//"yesterday"
		re: /^yes/i,
		handler: function(){
			return new Date().decrement();
		}
	},

	{
		//4th, 23rd
		re: /^(\d{1,2})(st|nd|rd|th)?$/i,
		handler: function(bits){
			var d = new Date();
			d.set('date', bits[1].toInt());
			return d;
		}
	},

	{
		//4th Jan, 23rd May
		re: /^(\d{1,2})(?:st|nd|rd|th)? (\w+)$/i,
		handler: function(bits){
			var d = new Date();
			d.set('mo', Date.parseMonth(bits[2], true), bits[1].toInt());
			return d;
		}
	},

	{
		//4th Jan 2000, 23rd May 2004
		re: /^(\d{1,2})(?:st|nd|rd|th)? (\w+),? (\d{4})$/i,
		handler: function(bits){
			var d = new Date();
			d.set('mo', Date.parseMonth(bits[2], true), bits[1].toInt());
			d.setYear(bits[3]);
			return d;
		}
	},

	{
		//Jan 4th
		re: /^(\w+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})$/i,
		handler: function(bits){
			var d = new Date();
			d.set('mo', Date.parseMonth(bits[1], true), bits[2].toInt());
			d.setYear(bits[3]);
			return d;
		}
	},

	{
		//Jan 4th 2003
		re: /^next (\w+)$/i,
		handler: function(bits){
			var d = new Date();
			var day = d.getDay();
			var newDay = Date.parseDay(bits[1], true);
			var addDays = newDay - day;
			if (newDay <= day){
				addDays += 7;
			}
			d.set('date', d.getDate() + addDays);
			return d;
		}
	},

	{
		//4 May 08:12
		re: /^\d+\s[a-zA-z]..\s\d.\:\d.$/,
		handler: function(bits){
			var d = new Date();
			bits = bits[0].split(" ");
			d.set('date', bits[0]);
			var m;
			Date.getMsg('months').each(function(mo, i){
				if (new RegExp("^"+bits[1]).test(mo)) m = i;
			});
			d.set('mo', m);
			d.set('hr', bits[2].split(":")[0]);
			d.set('min', bits[2].split(":")[1]);
			d.set('ms', 0);
			return d;
		}
	},

	{
		re: /^last (\w+)$/i,
		handler: function(bits){
			return Date.parse('next ' + bits[0]).decrement('day', 7);
		}
	}

]);
/*
Script: Array.Extras.js
	Extends the Array native object to include useful methods to work with arrays.

	License:
		MIT-style license.

	Authors:
		Christoph Pojer

*/
Array.implement({

	min: function(){
		return Math.min.apply(null, this);
	},

	max: function(){
		return Math.max.apply(null, this);
	},

	average: function(){
		return this.length ? this.sum() / this.length : 0;
	},

	sum: function(){
		var result = 0, l = this.length;
		if (l) do { result += this[--l]; } while (l);
		return result;
	},

	unique: function(){
		return [].combine(this);
	}

});
/*
Script: Class.Refactor.js
	Extends a class onto itself with new property, preserving any items attached to the class's namespace.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

Class.refactor = function(original, refactors){

	$each(refactors, function(item, name){
		var origin = original.prototype[name];
		if (origin && (origin = origin._origin) && typeof item == 'function') original.implement(name, function(){
			var old = this.previous;
			this.previous = origin;
			var value = item.apply(this, arguments);
			this.previous = old;
			return value;
		}); else original.implement(name, item);
	});

	return original;

};
/*
Script: Chain.Wait.js
	Adds a method to inject pauses between chained events.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

(function(){

	var wait = {
		wait: function(duration){
			return this.chain(function(){
				this.callChain.delay($pick(duration, 500), this);
			}.bind(this));
		}
	};

	Chain.implement(wait);

	if (window.Fx){
		Fx.implement(wait);
		['Css', 'Tween', 'Elements'].each(function(cls){
			if (Fx[cls]) Fx[cls].implement(wait);
		});
	}

	try {
		Element.implement({
			chains: function(effects){
				$splat($pick(effects, ['tween', 'morph', 'reveal'])).each(function(effect){
					var effect = this.get(effect);
					if (!effect) return;
					effect.setOptions({
						link:'chain'
					});
				}, this);
				return this;
			},
			pauseFx: function(duration, effect){
				this.chains(effect).get($pick(effect, 'tween')).wait(duration);
				return this;
			}
		});
	} catch(e){}

})();
/*
Script: Class.Occlude.js
	Prevents a class from being applied to a DOM element twice.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

Class.Occlude = new Class({

	occlude: function(property, element){
		element = $(element || this.element);
		var instance = element.retrieve(property || this.property);
		if (instance && !$defined(this.occluded)){
			this.occluded = instance;
		} else {
			this.occluded = false;
			element.store(property || this.property, this);
		}
		return this.occluded;
	}

});
/*
Script: Fx.Scroll.js
	Effect to smoothly scroll any element, including the window.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {x: 0, y: 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = this.subject = $(element);
		this.parent(options);
		var cancel = this.cancel.bind(this, false);

		if ($type(this.element) != 'element') this.element = $(this.element.getDocument().body);

		var stopper = this.element;

		if (this.options.wheelStops){
			this.addEvent('start', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('complete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	set: function(){
		var now = Array.flatten(arguments);
		this.element.scrollTo(now[0], now[1]);
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(x, y){
		if (!this.check(arguments.callee, x, y)) return this;
		var offsetSize = this.element.getSize(), scrollSize = this.element.getScrollSize();
		var scroll = this.element.getScroll(), values = {x: x, y: y};
		for (var z in values){
			var max = scrollSize[z] - offsetSize[z];
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z].limit(0, max) : max;
			else values[z] = scroll[z];
			values[z] += this.options.offset[z];
		}
		return this.parent([scroll.x, scroll.y], [values.x, values.y]);
	},

	toTop: function(){
		return this.start(false, 0);
	},

	toLeft: function(){
		return this.start(0, false);
	},

	toRight: function(){
		return this.start('right', false);
	},

	toBottom: function(){
		return this.start(false, 'bottom');
	},

	toElement: function(el){
		var position = $(el).getPosition(this.element);
		return this.start(position.x, position.y);
	}

});

/*
Script: Fx.SmoothScroll.js
	Class for creating a smooth scrolling effect to all internal links on the page.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

Fx.SmoothScroll = new Class({

	Extends: Fx.Scroll,

	initialize: function(options, context){
		context = context || document;
		this.doc = context.getDocument();
		var win = context.getWindow();
		this.parent(this.doc, options);
		this.links = this.options.links ? $$(this.options.links) : $$(this.doc.links);
		var location = win.location.href.match(/^[^#]*/)[0] + '#';
		this.links.each(function(link){
			if (link.href.indexOf(location) != 0) {return;}
			var anchor = link.href.substr(location.length);
			if (anchor) this.useLink(link, anchor);
		}, this);
		if (!Browser.Engine.webkit419) {
			this.addEvent('complete', function(){
				win.location.hash = this.anchor;
			}, true);
		}
	},

	useLink: function(link, anchor){
		var el;
		link.addEvent('click', function(event){
			if (el !== false && !el) el = this.doc.getElement("a[name=" + anchor + "]");
			if (el) {
				event.preventDefault();
				this.anchor = anchor;
				this.toElement(el);
				link.blur();
			}
		}.bind(this));
	}

});
/*
Script: Fx.Elements.js
	Effect to change any number of CSS properties of any number of Elements.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

Fx.Elements = new Class({

	Extends: Fx.CSS,

	initialize: function(elements, options){
		this.elements = this.subject = $$(elements);
		this.parent(options);
	},

	compute: function(from, to, delta){
		var now = {};
		for (var i in from){
			var iFrom = from[i], iTo = to[i], iNow = now[i] = {};
			for (var p in iFrom) iNow[p] = this.parent(iFrom[p], iTo[p], delta);
		}
		return now;
	},

	set: function(now){
		for (var i in now){
			var iNow = now[i];
			for (var p in iNow) this.render(this.elements[i], p, iNow[p], this.options.unit);
		}
		return this;
	},

	start: function(obj){
		if (!this.check(arguments.callee, obj)) return this;
		var from = {}, to = {};
		for (var i in obj){
			var iProps = obj[i], iFrom = from[i] = {}, iTo = to[i] = {};
			for (var p in iProps){
				var parsed = this.prepare(this.elements[i], p, iProps[p]);
				iFrom[p] = parsed.from;
				iTo[p] = parsed.to;
			}
		}
		return this.parent(from, to);
	}

});
/*
Script: Fx.Accordion.js
	An Fx.Elements extension which allows you to easily create accordion type controls.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

Fx.Accordion = new Class({

	Extends: Fx.Elements,

	options: {/*
		onActive: $empty(toggler, section),
		onBackground: $empty(toggler, section),*/
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		fixedHeight: false,
		fixedWidth: false,
		wait: false,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true
	},

	initialize: function(){
		var params = Array.link(arguments, {'container': Element.type, 'options': Object.type, 'togglers': $defined, 'elements': $defined});
		this.parent(params.elements, params.options);
		this.togglers = $$(params.togglers);
		this.container = $(params.container);
		this.previous = -1;
		if (this.options.alwaysHide) this.options.wait = true;
		if ($chk(this.options.show)){
			this.options.display = false;
			this.previous = this.options.show;
		}
		if (this.options.start){
			this.options.display = false;
			this.options.show = false;
		}
		this.effects = {};
		if (this.options.opacity) this.effects.opacity = 'fullOpacity';
		if (this.options.width) this.effects.width = this.options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (this.options.height) this.effects.height = this.options.fixedHeight ? 'fullHeight' : 'scrollHeight';
		for (var i = 0, l = this.togglers.length; i < l; i++) this.addSection(this.togglers[i], this.elements[i]);
		this.elements.each(function(el, i){
			if (this.options.show === i){
				this.fireEvent('active', [this.togglers[i], el]);
			} else {
				for (var fx in this.effects) el.setStyle(fx, 0);
			}
		}, this);
		if ($chk(this.options.display)) this.display(this.options.display, this.options.initialDisplayFx);
	},

	addSection: function(toggler, element){
		toggler = $(toggler);
		element = $(element);
		var test = this.togglers.contains(toggler);
		this.togglers.include(toggler);
		this.elements.include(element);
		var idx = this.togglers.indexOf(toggler);
		toggler.addEvent(this.options.trigger, this.display.bind(this, idx));
		if (this.options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (this.options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});
		element.fullOpacity = 1;
		if (this.options.fixedWidth) element.fullWidth = this.options.fixedWidth;
		if (this.options.fixedHeight) element.fullHeight = this.options.fixedHeight;
		element.setStyle('overflow', 'hidden');
		if (!test) for (var fx in this.effects) element.setStyle(fx, 0);
		return this;
	},

	display: function(index, useFx){
		useFx = $pick(useFx, true);
		index = ($type(index) == 'element') ? this.elements.indexOf(index) : index;
		if ((this.timer && this.options.wait) || (index === this.previous && !this.options.alwaysHide)) return this;
		this.previous = index;
		var obj = {};
		this.elements.each(function(el, i){
			obj[i] = {};
			var hide = (i != index) || (this.options.alwaysHide && (el.offsetHeight > 0));
			this.fireEvent(hide ? 'background' : 'active', [this.togglers[i], el]);
			for (var fx in this.effects) obj[i][fx] = hide ? 0 : el[this.effects[fx]];
		}, this);
		return useFx ? this.start(obj) : this.set(obj);
	}

});
/*
Script: Element.Position.js
	Extends the Element native object to include methods useful positioning elements relative to others.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

(function(){

//Tom wants to rename the old .position to .setPosition; until he does, we need this.
var oldPosition = Element.prototype.position;

Element.implement({

	position: function(options){
		if (options && ($defined(options.x) || $defined(options.y))) return oldPosition ? oldPosition.apply(this, arguments) : this;
		$each(options||{}, function(v, k){ if (!$defined(v)) delete options[k]; });
		options = $merge({
			relativeTo: document.body,
			position: {
				x: 'center', //left, center, right
				y: 'center' //top, center, bottom
			},
			edge: false,
			offset: {x: 0, y: 0},
			returnPos: false,
			relFixedPosition: false,
			ignoreMargins: false,
			allowNegative: false
		}, options);
		//compute the offset of the parent positioned element if this element is in one
		var parentOffset = {x: 0, y: 0};
		var parentPositioned = false;
		/* dollar around getOffsetParent should not be necessary, but as it does not return
		 * a mootools extended element in IE, an error occurs on the call to expose. See:
		 * http://mootools.lighthouseapp.com/projects/2706/tickets/333-element-getoffsetparent-inconsistency-between-ie-and-other-browsers */
		var offsetParent = this.measure(function(){
			return $(this.getOffsetParent());
		});
		if (offsetParent && offsetParent != this.getDocument().body){
			parentOffset = offsetParent.measure(function(){
				return this.getPosition();
			});
			parentPositioned = true;
			options.offset.x = options.offset.x - parentOffset.x;
			options.offset.y = options.offset.y - parentOffset.y;
		}
		//upperRight, bottomRight, centerRight, upperLeft, bottomLeft, centerLeft
		//topRight, topLeft, centerTop, centerBottom, center
		var fixValue = function(option){
			if ($type(option) != "string") return option;
			option = option.toLowerCase();
			var val = {};
			if (option.test('left')) val.x = 'left';
			else if (option.test('right')) val.x = 'right';
			else val.x = 'center';
			if (option.test('upper') || option.test('top')) val.y = 'top';
			else if (option.test('bottom')) val.y = 'bottom';
			else val.y = 'center';
			return val;
		};
		options.edge = fixValue(options.edge);
		options.position = fixValue(options.position);
		if (!options.edge){
			if (options.position.x == 'center' && options.position.y == 'center') options.edge = {x:'center', y:'center'};
			else options.edge = {x:'left', y:'top'};
		}

		this.setStyle('position', 'absolute');
		var rel = $(options.relativeTo) || document.body;
		var calc = rel == document.body ? window.getScroll() : rel.getPosition();
		var top = calc.y;
		var left = calc.x;

		if (Browser.Engine.trident){
			var scrolls = rel.getScrolls();
			top += scrolls.y;
			left += scrolls.x;
		}

		var dim = this.getDimensions({computeSize: true, styles:['padding', 'border','margin']});
		if (options.ignoreMargins){
			options.offset.x = options.offset.x - dim['margin-left'];
			options.offset.y = options.offset.y - dim['margin-top'];
		}
		var pos = {};
		var prefY = options.offset.y;
		var prefX = options.offset.x;
		var winSize = window.getSize();
		switch(options.position.x){
			case 'left':
				pos.x = left + prefX;
				break;
			case 'right':
				pos.x = left + prefX + rel.offsetWidth;
				break;
			default: //center
				pos.x = left + ((rel == document.body ? winSize.x : rel.offsetWidth)/2) + prefX;
				break;
		};
		switch(options.position.y){
			case 'top':
				pos.y = top + prefY;
				break;
			case 'bottom':
				pos.y = top + prefY + rel.offsetHeight;
				break;
			default: //center
				pos.y = top + ((rel == document.body ? winSize.y : rel.offsetHeight)/2) + prefY;
				break;
		};

		if (options.edge){
			var edgeOffset = {};

			switch(options.edge.x){
				case 'left':
					edgeOffset.x = 0;
					break;
				case 'right':
					edgeOffset.x = -dim.x-dim.computedRight-dim.computedLeft;
					break;
				default: //center
					edgeOffset.x = -(dim.x/2);
					break;
			};
			switch(options.edge.y){
				case 'top':
					edgeOffset.y = 0;
					break;
				case 'bottom':
					edgeOffset.y = -dim.y-dim.computedTop-dim.computedBottom;
					break;
				default: //center
					edgeOffset.y = -(dim.y/2);
					break;
			};
			pos.x = pos.x + edgeOffset.x;
			pos.y = pos.y + edgeOffset.y;
		}
		pos = {
			left: ((pos.x >= 0 || parentPositioned || options.allowNegative) ? pos.x : 0).toInt(),
			top: ((pos.y >= 0 || parentPositioned || options.allowNegative) ? pos.y : 0).toInt()
		};
		if (rel.getStyle('position') == "fixed" || options.relFixedPosition){
			var winScroll = window.getScroll();
			pos.top = pos.top.toInt() + winScroll.y;
			pos.left = pos.left.toInt() + winScroll.x;
		}

		if (options.returnPos) return pos;
		else this.setStyles(pos);
		return this;
	}

});

})();
/*
Script: Fx.Move.js
	Defines Fx.Move, a class that works with Element.Position.js to transition an element from one location to another.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

Fx.Move = new Class({

	Extends: Fx.Morph,

	options: {
		relativeTo: document.body,
		position: 'center',
		edge: false,
		offset: {x: 0, y: 0}
	},

	start: function(destination){
		return this.parent(this.element.position($merge(this.options, destination, {returnPos: true})));
	}

});

Element.Properties.move = {

	set: function(options){
		var morph = this.retrieve('move');
		if (morph) morph.cancel();
		return this.eliminate('move').store('move:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('move')){
			if (options || !this.retrieve('move:options')) this.set('move', options);
			this.store('move', new Fx.Move(this, this.retrieve('move:options')));
		}
		return this.retrieve('move');
	}

};

Element.implement({

	move: function(options){
		this.get('move').start(options);
		return this;
	}

});

/*
Script: Fx.Slide.js
	Effect to slide an element in and out of view.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical'
	},

	initialize: function(element, options){
		this.addEvent('complete', function(){
			this.open = (this.wrapper['offset' + this.layout.capitalize()] != 0);
			if (this.open && Browser.Engine.webkit419) this.element.dispose().inject(this.wrapper);
		}, true);
		this.element = this.subject = $(element);
		this.parent(options);
		var wrapper = this.element.retrieve('wrapper');
		this.wrapper = wrapper || new Element('div', {
			styles: $extend(this.element.getStyles('margin', 'position'), {overflow: 'hidden'})
		}).wraps(this.element);
		this.element.store('wrapper', this.wrapper).setStyle('margin', 0);
		this.now = [];
		this.open = true;
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	set: function(now){
		this.element.setStyle(this.margin, now[0]);
		this.wrapper.setStyle(this.layout, now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(how, mode){
		if (!this.check(arguments.callee, how, mode)) return this;
		this[mode || this.options.mode]();
		var margin = this.element.getStyle(this.margin).toInt();
		var layout = this.wrapper.getStyle(this.layout).toInt();
		var caseIn = [[margin, layout], [0, this.offset]];
		var caseOut = [[margin, layout], [-this.offset, 0]];
		var start;
		switch (how){
			case 'in': start = caseIn; break;
			case 'out': start = caseOut; break;
			case 'toggle': start = (layout == 0) ? caseIn : caseOut;
		}
		return this.parent(start[0], start[1]);
	},

	slideIn: function(mode){
		return this.start('in', mode);
	},

	slideOut: function(mode){
		return this.start('out', mode);
	},

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	toggle: function(mode){
		return this.start('toggle', mode);
	}

});

Element.Properties.slide = {

	set: function(options){
		var slide = this.retrieve('slide');
		if (slide) slide.cancel();
		return this.eliminate('slide').store('slide:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('slide')){
			if (options || !this.retrieve('slide:options')) this.set('slide', options);
			this.store('slide', new Fx.Slide(this, this.retrieve('slide:options')));
		}
		return this.retrieve('slide');
	}

};

Element.implement({

	slide: function(how, mode){
		how = how || 'toggle';
		var slide = this.get('slide'), toggle;
		switch (how){
			case 'hide': slide.hide(mode); break;
			case 'show': slide.show(mode); break;
			case 'toggle':
				var flag = this.retrieve('slide:flag', slide.open);
				slide[flag ? 'slideOut' : 'slideIn'](mode);
				this.store('slide:flag', !flag);
				toggle = true;
			break;
			default: slide.start(how, mode);
		}
		if (!toggle) this.eliminate('slide:flag');
		return this;
	}

});

/*
Script: Fx.Sort.js
	Defines Fx.Sort, a class that reorders lists with a transition.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

Fx.Sort = new Class({

	Extends: Fx.Elements,

	options: {
		mode: 'vertical'
	},

	initialize: function(elements, options){
		this.parent(elements, options);
		this.elements.each(function(el){
			if (el.getStyle('position') == 'static') el.setStyle('position', 'relative');
		});
		this.setDefaultOrder();
	},

	setDefaultOrder: function(){
		this.currentOrder = this.elements.map(function(el, index){
			return index;
		});
	},

	sort: function(newOrder){
		if ($type(newOrder) != 'array') return false;
		var top = 0;
		var left = 0;
		var zero = {};
		var vert = this.options.mode == 'vertical';
		var current = this.elements.map(function(el, index){
			var size = el.getComputedSize({styles: ['border', 'padding', 'margin']});
			var val;
			if (vert){
				val = {
					top: top,
					margin: size['margin-top'],
					height: size.totalHeight
				};
				top += val.height - size['margin-top'];
			} else {
				val = {
					left: left,
					margin: size['margin-left'],
					width: size.totalWidth
				};
				left += val.width;
			}
			var plain = vert ? 'top' : 'left';
			zero[index] = {};
			var start = el.getStyle(plain).toInt();
			zero[index][plain] = start || 0;
			return val;
		}, this);
		this.set(zero);
		newOrder = newOrder.map(function(i){ return i.toInt(); });
		if (newOrder.length != this.elements.length){
			this.currentOrder.each(function(index){
				if (!newOrder.contains(index)) newOrder.push(index);
			});
			if (newOrder.length > this.elements.length)
				newOrder.splice(this.elements.length-1, newOrder.length-this.elements.length);
		}
		var top = 0;
		var left = 0;
		var margin = 0;
		var next = {};
		newOrder.each(function(item, index){
			var newPos = {};
			if (vert){
				newPos.top = top - current[item].top - margin;
				top += current[item].height;
			} else {
				newPos.left = left - current[item].left;
				left += current[item].width;
			}
			margin = margin + current[item].margin;
			next[item]=newPos;
		}, this);
		var mapped = {};
		$A(newOrder).sort().each(function(index){
			mapped[index] = next[index];
		});
		this.start(mapped);
		this.currentOrder = newOrder;
		return this;
	},

	rearrangeDOM: function(newOrder){
		newOrder = newOrder || this.currentOrder;
		var parent = this.elements[0].getParent();
		var rearranged = [];
		this.elements.setStyle('opacity', 0);
		//move each element and store the new default order
		newOrder.each(function(index){
			rearranged.push(this.elements[index].inject(parent).setStyles({
				top: 0,
				left: 0
			}));
		}, this);
		this.elements.setStyle('opacity', 1);
		this.elements = $$(rearranged);
		this.setDefaultOrder();
		return this;
	},

	getDefaultOrder: function(){
		return this.elements.map(function(el, index){
			return index;
		});
	},

	forward: function(){
		return this.sort(this.getDefaultOrder());
	},

	backward: function(){
		return this.sort(this.getDefaultOrder().reverse());
	},

	reverse: function(){
		return this.sort(this.currentOrder.reverse());
	},

	sortByElements: function(elements){
		return this.sort(elements.map(function(el){
			return this.elements.indexOf(el);
		}, this));
	},

	swap: function(one, two){
		if ($type(one) == 'element') one = this.elements.indexOf(one);
		if ($type(two) == 'element') two = this.elements.indexOf(two);
		
		var newOrder = $A(this.currentOrder);
		newOrder[this.currentOrder.indexOf(one)] = two;
		newOrder[this.currentOrder.indexOf(two)] = one;
		this.sort(newOrder);
	}

});
/*
Script: Element.Shortcuts.js
	Extends the Element native object to include some shortcut methods.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

Element.implement({

	isDisplayed: function(){
		return this.getStyle('display') != 'none';
	},

	toggle: function(){
		return this[this.isDisplayed() ? 'hide' : 'show']();
	},

	hide: function(){
		var d;
		try {
			//IE fails here if the element is not in the dom
			if ('none' != this.getStyle('display')) d = this.getStyle('display');
		} catch(e){}

		return this.store('originalDisplay', d || 'block').setStyle('display', 'none');
	},

	show: function(display){
		return this.setStyle('display', display || this.retrieve('originalDisplay') || 'block');
	},

	swapClass: function(remove, add){
		return this.removeClass(remove).addClass(add);
	}

});

/*
Script: Fx.Reveal.js
	Defines Fx.Reveal, a class that shows and hides elements with a transition.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/

Fx.Reveal = new Class({

	Extends: Fx.Morph,

	options: {/*	  
		onShow: $empty(thisElemeng),
		onHide: $empty(thisElemeng),
		onComplete: $empty(thisElemeng),
		heightOverride: null,
		widthOverride: null, */
		styles: ['padding', 'border', 'margin'],
		transitionOpacity: !Browser.Engine.trident4,
		mode: 'vertical',
		display: 'block',
		hideInputs: Browser.Engine.trident ? 'select, input, textarea, object, embed' : false
	},

	dissolve: function(){
		try {
			if (!this.hiding && !this.showing){
				if (this.element.getStyle('display') != 'none'){
					this.hiding = true;
					this.showing = false;
					this.hidden = true;
					var startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
					var setToAuto = (this.element.style.height === ""||this.element.style.height=="auto");
					this.element.setStyle('display', 'block');
					if (this.options.transitionOpacity) startStyles.opacity = 1;
					var zero = {};
					$each(startStyles, function(style, name){
						zero[name] = [style, 0];
					}, this);
					var overflowBefore = this.element.getStyle('overflow');
					this.element.setStyle('overflow', 'hidden');
					var hideThese = this.options.hideInputs ? this.element.getElements(this.options.hideInputs) : null;
					this.$chain.unshift(function(){
						if (this.hidden){
							this.hiding = false;
							$each(startStyles, function(style, name){
								startStyles[name] = style;
							}, this);
							this.element.setStyles($merge({display: 'none', overflow: overflowBefore}, startStyles));
							if (setToAuto){
								if (['vertical', 'both'].contains(this.options.mode)) this.element.style.height = "";
								if (['width', 'both'].contains(this.options.mode)) this.element.style.width = "";
							}
							if (hideThese) hideThese.setStyle('visibility', 'visible');
						}
						this.fireEvent('hide', this.element);
						this.callChain();
					}.bind(this));
					if (hideThese) hideThese.setStyle('visibility', 'hidden');
					this.start(zero);
				} else {
					this.callChain.delay(10, this);
					this.fireEvent('complete', this.element);
					this.fireEvent('hide', this.element);
				}
			} else if (this.options.link == 'chain'){
				this.chain(this.dissolve.bind(this));
			} else if (this.options.link == 'cancel' && !this.hiding){
				this.cancel();
				this.dissolve();
			}
		} catch(e){
			this.hiding = false;
			this.element.setStyle('display', 'none');
			this.callChain.delay(10, this);
			this.fireEvent('complete', this.element);
			this.fireEvent('hide', this.element);
		}
		return this;
	},

	reveal: function(){
		try {
			if (!this.showing && !this.hiding){
				if (this.element.getStyle('display') == 'none' ||
					 this.element.getStyle('visiblity') == 'hidden' ||
					 this.element.getStyle('opacity') == 0){
					this.showing = true;
					this.hiding = false;
					this.hidden = false;
					var setToAuto, startStyles;
					//toggle display, but hide it
					this.element.measure(function(){
						setToAuto = (this.element.style.height === ""||this.element.style.height=="auto");
						//create the styles for the opened/visible state
						startStyles = this.element.getComputedSize({
							styles: this.options.styles,
							mode: this.options.mode
						});
					}.bind(this));
					$each(startStyles, function(style, name){
						startStyles[name] = style;
					});
					//if we're overridding height/width
					if ($chk(this.options.heightOverride)) startStyles.height = this.options.heightOverride.toInt();
					if ($chk(this.options.widthOverride)) startStyles.width = this.options.widthOverride.toInt();
					if (this.options.transitionOpacity) {
						this.element.setStyle('opacity', 0);
						startStyles.opacity = 1;
					}
					//create the zero state for the beginning of the transition
					var zero = {
						height: 0,
						display: this.options.display
					};
					$each(startStyles, function(style, name){ zero[name] = 0; });
					var overflowBefore = this.element.getStyle('overflow');
					//set to zero
					this.element.setStyles($merge(zero, {overflow: 'hidden'}));
					//hide inputs
					var hideThese = this.options.hideInputs ? this.element.getElements(this.options.hideInputs) : null;
					if (hideThese) hideThese.setStyle('visibility', 'hidden');
					//start the effect
					this.start(startStyles);
					this.$chain.unshift(function(){
						this.element.setStyle('overflow', overflowBefore);
						if (!this.options.heightOverride && setToAuto){
							if (['vertical', 'both'].contains(this.options.mode)) this.element.style.height = "";
							if (['width', 'both'].contains(this.options.mode)) this.element.style.width = "";
						}
						if (!this.hidden) this.showing = false;
						if (hideThese) hideThese.setStyle('visibility', 'visible');
						this.callChain();
						this.fireEvent('show', this.element);
					}.bind(this));
				} else {
					this.callChain();
					this.fireEvent('complete', this.element);
					this.fireEvent('show', this.element);
				}
			} else if (this.options.link == 'chain'){
				this.chain(this.reveal.bind(this));
			} else if (this.options.link == 'cancel' && !this.showing){
				this.cancel();
				this.reveal();
			}
		} catch(e){
			this.element.setStyles({
				display: this.options.display,
				visiblity: 'visible',
				opacity: 1
			});
			this.showing = false;
			this.callChain.delay(10, this);
			this.fireEvent('complete', this.element);
			this.fireEvent('show', this.element);
		}
		return this;
	},

	toggle: function(){
		if (this.element.getStyle('display') == 'none' ||
			 this.element.getStyle('visiblity') == 'hidden' ||
			 this.element.getStyle('opacity') == 0){
			this.reveal();
		} else {
			this.dissolve();
		}
		return this;
	}

});

Element.Properties.reveal = {

	set: function(options){
		var reveal = this.retrieve('reveal');
		if (reveal) reveal.cancel();
		return this.eliminate('reveal').store('reveal:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('reveal')){
			if (options || !this.retrieve('reveal:options')) this.set('reveal', options);
			this.store('reveal', new Fx.Reveal(this, this.retrieve('reveal:options')));
		}
		return this.retrieve('reveal');
	}

};

Element.Properties.dissolve = Element.Properties.reveal;

Element.implement({

	reveal: function(options){
		this.get('reveal', options).reveal();
		return this;
	},

	dissolve: function(options){
		this.get('reveal', options).dissolve();
		return this;
	},

	nix: function(){
		var  params = Array.link(arguments, {destroy: Boolean.type, options: Object.type});
		this.get('reveal', params.options).dissolve().chain(function(){
			this[params.destroy ? 'destroy' : 'dispose']();
		}.bind(this));
		return this;
	},

	wink: function(){
		var  params = Array.link(arguments, {duration: Number.type, options: Object.type});
		var reveal = this.get('reveal', params.options);
		reveal.reveal().chain(function(){
			(function(){
				reveal.dissolve();
			}).delay(params.duration || 2000)
		});
	}


});
/*
Script: Request.Queue.js
	Controls several instances of Request and its variants to run only one request at a time.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

Request.Queue = new Class({

	Implements: [Options, Events],

	Binds: ['attach', 'request', 'complete', 'cancel', 'success', 'failure', 'exception'],

	options: {/*
		onRequest: $empty(argsPassedToOnRequest),
		onSuccess: $empty(argsPassedToOnSuccess),
		onComplete: $empty(argsPassedToOnComplete),
		onCancel: $empty(argsPassedToOnCancel),
		onException: $empty(argsPassedToOnException),
		onFailure: $empty(argsPassedToOnFailure),*/
		stopOnFailure: true,
		autoAdvance: true,
		concurrent: 1,
		requests: {}
	},

	initialize: function(options){
		this.setOptions(options);
		this.requests = new Hash;
		this.addRequests(this.options.requests);
		this.queue = [];
		this.reqBinders = {};
	},

	addRequest: function(name, request){
		this.requests.set(name, request);
		this.attach(name, request);
		return this;
	},

	addRequests: function(obj){
		$each(obj, this.addRequest, this);
		return this;
	},

	getName: function(req){
		return this.requests.keyOf(req);
	},

	attach: function(name, req){
		if (req._groupSend) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			if(!this.reqBinders[name]) this.reqBinders[name] = {};
			this.reqBinders[name][evt] = function(){
				this['on' + evt.capitalize()].apply(this, [name, req].extend(arguments));
			}.bind(this);
			req.addEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req._groupSend = req.send;
		req.send = function(options){
			this.send(name, options);
			return req;
		}.bind(this);
		return this;
	},

	removeRequest: function(req){
		var name = $type(req) == 'object' ? this.getName(req) : req;
		if (!name && $type(name) != 'string') return this;
		req = this.requests.get(name);
		if (!req) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			req.removeEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req.send = req._groupSend;
		delete req._groupSend;
		return this;
	},

	getRunning: function(){
		return this.requests.filter(function(r){ return r.running; });
	},

	isRunning: function(){
		return !!this.getRunning().getKeys().length;
	},

	send: function(name, options){
		var q = function(){
			this.requests.get(name)._groupSend(options);
			this.queue.erase(q);
		}.bind(this);
		q.name = name;
		if (this.getRunning().getKeys().length >= this.options.concurrent || (this.error && this.options.stopOnFailure)) this.queue.push(q);
		else q();
		return this;
	},

	hasNext: function(name){
		return (!name) ? !!this.queue.length : !!this.queue.filter(function(q){ return q.name == name; }).length;
	},

	resume: function(){
		this.error = false;
		(this.options.concurrent - this.getRunning().getKeys().length).times(this.runNext, this);
		return this;
	},

	runNext: function(name){
		if (!this.queue.length) return;
		if (!name){
			this.queue[0]();
		} else {
			var found;
			this.queue.each(function(q){
				if (!found && q.name == name){
					found = true;
					q();
				}
			});
		}
		return this;
	},
	
	runAll: function() {
		this.queue.each(function(q) {
			q();
		});
		return this;
	},

	clear: function(name){
		if (!name){
			this.queue.empty();
		} else {
			this.queue = this.queue.map(function(q){
				if (q.name != name) return q;
				else return false;
			}).filter(function(q){ return q; });
		}
		return this;
	},

	cancel: function(name){
		this.requests.get(name).cancel();
		return this;
	},

	onRequest: function(){
		this.fireEvent('request', arguments);
	},

	onComplete: function(){
		this.fireEvent('complete', arguments);
	},

	onCancel: function(){
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('cancel', arguments);
	},

	onSuccess: function(){
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('success', arguments);
	},

	onFailure: function(){
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('failure', arguments);
	},

	onException: function(){
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('exception', arguments);
	}

});

/*
Script: Request.Periodical.js
	Requests the same url at a time interval that increases when no data is returned from the requested server

	License:
		MIT-style license.

	Authors:
		Christoph Pojer

*/

Request.implement({

	options: {
		initialDelay: 5000,
		delay: 5000,
		limit: 60000
	},

	startTimer: function(data){
		var fn = (function(){
			if (!this.running) this.send({data: data});
		});
		this.timer = fn.delay(this.options.initialDelay, this);
		this.lastDelay = this.options.initialDelay;
		this.completeCheck = function(j){
			$clear(this.timer);
			if (j) this.lastDelay = this.options.delay;
			else this.lastDelay = (this.lastDelay+this.options.delay).min(this.options.limit);
			this.timer = fn.delay(this.lastDelay, this);
		};
		this.addEvent('complete', this.completeCheck);
		return this;
	},

	stopTimer: function(){
		$clear(this.timer);
		this.removeEvent('complete', this.completeCheck);
		return this;
	}

});
/*
Script: Log.js
	Provides basic logging functionality for plugins to implement.

	License:
		MIT-style license.

	Authors:
		Guillermo Rauch
*/

var Log = new Class({
	
	log: function(){
		Log.logger.call(this, arguments);
	}
	
});

Log.logged = [];

Log.logger = function(){
	if(window.console && console.log) console.log.apply(console, arguments);
	else Log.logged.push(arguments);
};
/*
Script: Request.JSONP.js
	Defines Request.JSONP, a class for cross domain javascript via script injection.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
		Guillermo Rauch
*/

Request.JSONP = new Class({

	Implements: [Chain, Events, Options, Log],

	options: {/*
		onRetry: $empty(intRetries),
		onRequest: $empty(scriptElement),
		onComplete: $empty(data),
		onSuccess: $empty(data),
		onCancel: $empty(),*/
		url: '',
		data: {},
		retries: 0,
		timeout: 0,
		link: 'ignore',
		callbackKey: 'callback',
		injectScript: document.head
	},

	initialize: function(options){
		this.setOptions(options);
		this.running = false;
		this.requests = 0;
		this.triesRemaining = [];
	},
	
	check: function(caller){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(caller.bind(this, Array.slice(arguments, 1))); return false;
		}
		return false;
	},

	send: function(options){
		if (!$chk(arguments[1]) && !this.check(arguments.callee, options)) return this;
		
		var type = $type(options), old = this.options, index = $chk(arguments[1]) ? arguments[1] : this.requests++;
		if (type == 'string' || type == 'element') options = {data: options};
		
		options = $extend({data: old.data, url: old.url}, options);
		
		if (!$chk(this.triesRemaining[index])) this.triesRemaining[index] = this.options.retries;
		var remaining = this.triesRemaining[index];
				
		(function(){
			var script = this.getScript(options);
			this.log('JSONP retrieving script with url: ' + script.get('src'));
			this.fireEvent('request', script);
			this.running = true;
			
			(function(){
				if (remaining){
					this.triesRemaining[index] = remaining - 1;
					if (script){
						script.destroy();
						this.request(options, index);
						this.fireEvent('retry', this.triesRemaining[index]);
					}
				} else if(script && this.options.timeout){
					script.destroy();
					this.cancel();
					this.fireEvent('failure');
				}					
			}).delay(this.options.timeout, this);
		}).delay(Browser.Engine.trident ? 50 : 0, this);
		return this;
	},
	
	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.fireEvent('cancel');
		return this;
	},
 	
	getScript: function(options){
		var index = Request.JSONP.counter, data;
		Request.JSONP.counter++;
		
		switch ($type(options.data)){
			case 'element': data = $(options.data).toQueryString(); break;
			case 'object': case 'hash': data = Hash.toQueryString(options.data);
		}
		
		var src = options.url + 
			 (options.url.test('\\?') ? '&' :'?') + 
			 (options.callbackKey || this.options.callbackKey) + 
			 "=Request.JSONP.request_map.request_"+ index + 
			 (data ? '&' + data : '');
			
		if (src.length > 2083) this.log('JSONP '+ src +' will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs');
				
		var script = new Element('script', {type: 'text/javascript', src: src});
		
		Request.JSONP.request_map["request_" + index] = function(data){ this.success(data, script); }.bind(this);
				
		return script.inject(this.options.injectScript);
	},
	
	success: function(data, script){
		if (script) script.destroy();
		this.running = false;
		this.log('JSONP successfully retrieved: ', data);
		this.fireEvent('complete', [data]).fireEvent('success', [data]).callChain();
	}

});

Request.JSONP.counter = 0;
Request.JSONP.request_map = {};
/*
Script: OverText.js
	Shows text over an input that disappears when the user clicks into it. The text remains hidden if the user adds a value.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

var OverText = new Class({

	Implements: [Options, Events, Class.Occlude],

	Binds: ['reposition', 'test', 'focus'],

	options: {/*
		textOverride: null,
		onFocus: $empty()
		onTextHide: $empty(textEl, inputEl),
		onTextShow: $empty(textEl, inputEl), */
		positionOptions: {
			position: "upperLeft",
			edge: "upperLeft",
			offset: {
				x: 4,
				y: 2
			}
		},
		poll: false,
		pollInterval: 250
	},

	property: 'OverText',

	initialize: function(element, options){
		this.element = $(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.attach(this.element);
		OverText.instances.push(this);
		if (this.options.poll) this.poll();
	},

	toElement: function(){
		return this.element;
	},

	attach: function(){
		var val = this.options.textOverride || this.element.get('alt') || this.element.get('title');
		if (!val) return;
		this.text = new Element('div', {
			'class': 'overTxtDiv',
			styles: {
				lineHeight: 'normal',
				position: 'absolute'
			},
			html: val,
			events: {
				click: this.hide.pass(true, this)
			}
		}).inject(this.element, 'after');
		this.element.addEvents({
			focus: this.focus,
			blur: this.test,
			change: this.test
		}).store('OverTextDiv', this.text);
		window.addEvent('resize', this.reposition.bind(this));
		this.test();
		this.reposition();
	},

	startPolling: function(){
		this.pollingPaused = false;
		return this.poll();
	},

	poll: function(stop){
		//start immediately
		//pause on focus
		//resumeon blur
		if (this.poller && !stop) return this;
		var test = function(){
			if (!this.pollingPaused) this.test();
		}.bind(this);
		if (stop) $clear(this.poller);
		else this.poller = test.periodical(this.options.pollInterval, this);
		return this;
	},

	stopPolling: function(){
		this.pollingPaused = true;
		return this.poll(true);
	},

	focus: function(){
		if (!this.text.isDisplayed() || this.element.get('disabled')) return;
		this.hide();
	},

	hide: function(){
		if (this.text.isDisplayed() && !this.element.get('disabled')){
			this.text.hide();
			this.fireEvent('textHide', [this.text, this.element]);
			this.pollingPaused = true;
			try {
				this.element.fireEvent('focus').focus();
			} catch(e){} //IE barfs if you call focus on hidden elements
		}
		return this;
	},

	show: function(){
		if (!this.text.isDisplayed()){
			this.text.show();
			this.reposition();
			this.fireEvent('textShow', [this.text, this.element]);
			this.pollingPaused = false;
		}
		return this;
	},

	test: function(){
		var v = this.element.get('value');
		this[v ? 'hide' : 'show']();
		return !v;
	},

	reposition: function(){
		try {
			if (!this.element.getParent() || !this.element.offsetHeight) return this.hide();
			if (this.test()) this.text.position($merge(this.options.positionOptions, {relativeTo: this.element}));
		} catch(e){	}
		return this;
	}

});

OverText.instances = [];

OverText.update = function(){

	return OverText.instances.map(function(ot){
		if (ot.element && ot.text) return ot.reposition();
		return null; //the input or the text was destroyed
	});

};

if (window.Fx && Fx.Reveal) {
	Fx.Reveal.implement({
		hideInputs: Browser.Engine.trident ? 'select, input, textarea, object, embed, .overTxtDiv' : false
	});
}
/*
Script: Element.Forms.js
	Extends the Element native object to include methods useful in managing inputs.

	License:
		MIT-style license.

	Authors:
		Aaron Newton

*/
Element.implement({

	tidy: function(){
		this.set('value', this.get('value').tidy());
	},

	getTextInRange: function(start, end){
		return this.get('value').substring(start, end);
	},

	getSelectedText: function(){
		if (document.selection && document.selection.createRange) return document.selection.createRange().text;
		return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
	},

	getSelectedRange: function() {
		if ($defined(this.selectionStart)) return {start: this.selectionStart, end: this.selectionEnd};
		var pos = {start: 0, end: 0};
		var range = this.getDocument().selection.createRange();
		if (!range || range.parentElement() != this) return pos;
		var dup = range.duplicate();
		if (this.type == 'text') {
			pos.start = 0 - dup.moveStart('character', -100000);
			pos.end = pos.start + range.text.length;
		} else {
			var value = this.get('value');
			var offset = value.length - value.match(/[\n\r]*$/)[0].length;
			dup.moveToElementText(this);
			dup.setEndPoint('StartToEnd', range);
			pos.end = offset - dup.text.length;
			dup.setEndPoint('StartToStart', range);
			pos.start = offset - dup.text.length;
		}
		return pos;
	},

	getSelectionStart: function(){
		return this.getSelectedRange().start;
	},

	getSelectionEnd: function(){
		return this.getSelectedRange().end;
	},

	setCaretPosition: function(pos){
		if (pos == 'end') pos = this.get('value').length;
		this.selectRange(pos, pos);
		return this;
	},

	getCaretPosition: function(){
		return this.getSelectedRange().start;
	},

	selectRange: function(start, end){
		if (this.createTextRange){
			var value = this.get('value');
			var diff = value.substr(start, end - start).replace(/\r/g, '').length;
			start = value.substr(0, start).replace(/\r/g, '').length;
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', start + diff);
			range.moveStart('character', start);
			range.select();
		} else {
			this.focus();
			this.setSelectionRange(start, end);
		}
		return this;
	},

	insertAtCursor: function(value, select){
		var pos = this.getSelectedRange();
		var text = this.get('value');
		this.set('value', text.substring(0, pos.start) + value + text.substring(pos.end, text.length));
		if ($pick(select, true)) this.selectRange(pos.start, pos.start + value.length);
		else this.setCaretPosition(pos.start + value.length);
		return this;
	},

	insertAroundCursor: function(options, select){
		options = $extend({
			before: '',
			defaultMiddle: '',
			after: ''
		}, options);
		var value = this.getSelectedText() || options.defaultMiddle;
		var pos = this.getSelectedRange();
		var text = this.get('value');
		if (pos.start == pos.end){
			this.set('value', text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length));
			this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length);
		} else {
			var current = text.substring(pos.start, pos.end);
			this.set('value', text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
			var selStart = pos.start + options.before.length;
			if ($pick(select, true)) this.selectRange(selStart, selStart + current.length);
			else this.setCaretPosition(selStart + text.length);
		}
		return this;
	}

});
/*
Script: FormValidator.js
	A css-class based form validation system.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/
var InputValidator = new Class({

	Implements: [Options],

	options: {
		errorMsg: 'Validation failed.',
		test: function(field){return true;}
	},

	initialize: function(className, options){
		this.setOptions(options);
		this.className = className;
	},

	test: function(field, props){
		if ($(field)) return this.options.test($(field), props||this.getProps(field));
		else return false;
	},

	getError: function(field, props){
		var err = this.options.errorMsg;
		if ($type(err) == "function") err = err($(field), props||this.getProps(field));
		return err;
	},

	getProps: function(field){
		if (!$(field)) return {};
		return field.get('validatorProps');
	}

});

Element.Properties.validatorProps = {

	set: function(props){
		return this.eliminate('validatorProps').store('validatorProps', props);
	},

	get: function(props){
		if (props) this.set(props);
		if (this.retrieve('validatorProps')) return this.retrieve('validatorProps');
		if (this.getProperty('validatorProps')){
			try {
				this.store('validatorProps', JSON.decode(this.getProperty('validatorProps')));
			}catch(e){
				return {};
			}
		} else {
			var vals = this.get('class').split(' ').filter(function(cls){
				return cls.test(':');
			});
			if (!vals.length){
				this.store('validatorProps', {});
			} else {
				props = {};
				vals.each(function(cls){
					var split = cls.split(':');
					if (split[1]) {
						try {
							props[split[0]] = JSON.decode(split[1]);
						} catch(e) {}
					}
				});
				this.store('validatorProps', props);
			}
		}
		return this.retrieve('validatorProps');
	}

};

var FormValidator = new Class({

	Implements:[Options, Events],

	Binds: ['onSubmit'],

	options: {/*
		onFormValidate: $empty(isValid, form, event),
		onElementValidate: $empty(isValid, field, className, warn),
		onElementPass: $empty(field),
		onElementFail: $empty(field, validatorsFailed) */
		fieldSelectors:"input, select, textarea",
		ignoreHidden: true,
		useTitles:false,
		evaluateOnSubmit:true,
		evaluateFieldsOnBlur: true,
		evaluateFieldsOnChange: true,
		serial: true,
		stopOnFailure: true,
		warningPrefix: function(){
			return FormValidator.getMsg('warningPrefix') || 'Warning: ';
		},
		errorPrefix: function(){
			return FormValidator.getMsg('errorPrefix') || 'Error: ';
		}
	},

	initialize: function(form, options){
		this.setOptions(options);
		this.element = $(form);
		this.element.store('validator', this);
		this.warningPrefix = $lambda(this.options.warningPrefix)();
		this.errorPrefix = $lambda(this.options.errorPrefix)();
		if (this.options.evaluateOnSubmit) this.element.addEvent('submit', this.onSubmit);
		if (this.options.evaluateFieldsOnBlur) this.watchFields(this.getFields());
	},

	toElement: function(){
		return this.element;
	},

	getFields: function(){
		return this.fields = this.element.getElements(this.options.fieldSelectors);
	},

	watchFields: function(fields){
		fields.each(function(el){
				el.addEvent('blur', this.validateField.pass([el, false], this));
			if (this.options.evaluateFieldsOnChange)
				el.addEvent('change', this.validateField.pass([el, true], this));
		}, this);
	},

	onSubmit: function(event){
		if (!this.validate(event) && event) event.preventDefault();
		else this.reset();
	},

	reset: function(){
		this.getFields().each(this.resetField, this);
		return this;
	},

	validate: function(event){
		var result = this.getFields().map(function(field){
			return this.validateField(field, true);
		}, this).every(function(v){ return v;});
		this.fireEvent('formValidate', [result, this.element, event]);
		if (this.options.stopOnFailure && !result && event) event.preventDefault();
		return result;
	},

	validateField: function(field, force){
		if (this.paused) return true;
		field = $(field);
		var passed = !field.hasClass('validation-failed');
		var failed, warned;
		if (this.options.serial && !force){
			failed = this.element.getElement('.validation-failed');
			warned = this.element.getElement('.warning');
		}
		if (field && (!failed || force || field.hasClass('validation-failed') || (failed && !this.options.serial))){
			var validators = field.className.split(" ").some(function(cn){
				return this.getValidator(cn);
			}, this);
			var validatorsFailed = [];
			field.className.split(" ").each(function(className){
				if (className && !this.test(className, field)) validatorsFailed.include(className);
			}, this);
			passed = validatorsFailed.length === 0;
			if (validators && !field.hasClass('warnOnly')){
				if (passed){
					field.addClass('validation-passed').removeClass('validation-failed');
					this.fireEvent('elementPass', field);
				} else {
					field.addClass('validation-failed').removeClass('validation-passed');
					this.fireEvent('elementFail', [field, validatorsFailed]);
				}
			}
			if (!warned){
				var warnings = field.className.split(" ").some(function(cn){
					if (cn.test('^warn-') || field.hasClass('warnOnly'))
						return this.getValidator(cn.replace(/^warn-/,""));
					else return null;
				}, this);
				field.removeClass('warning');
				var warnResult = field.className.split(" ").map(function(cn){
					if (cn.test('^warn-') || field.hasClass('warnOnly'))
						return this.test(cn.replace(/^warn-/,""), field, true);
					else return null;
				}, this);
			}
		}
		return passed;
	},

	test: function(className, field, warn){
		var validator = this.getValidator(className);
		field = $(field);
		if (field.hasClass('ignoreValidation')) return true;
		warn = $pick(warn, false);
		if (field.hasClass('warnOnly')) warn = true;
		var isValid = validator ? validator.test(field) : true;
		if (validator && this.isVisible(field)) this.fireEvent('elementValidate', [isValid, field, className, warn]);
		if (warn) return true;
		return isValid;
	},

	isVisible : function(field){
		if (!this.options.ignoreHidden) return true;
		while(field != document.body){
			if ($(field).getStyle('display') == "none") return false;
			field = field.getParent();
		}
		return true;
	},

	resetField: function(field){
		field = $(field);
		if (field){
			field.className.split(" ").each(function(className){
				if (className.test('^warn-')) className = className.replace(/^warn-/,"");
				field.removeClass('validation-failed');
				field.removeClass('warning');
				field.removeClass('validation-passed');
			}, this);
		}
		return this;
	},

	stop: function(){
		this.paused = true;
		return this;
	},

	start: function(){
		this.paused = false;
		return this;
	},

	ignoreField: function(field, warn){
		field = $(field);
		if (field){
			this.enforceField(field);
			if (warn) field.addClass('warnOnly');
			else field.addClass('ignoreValidation');
		}
		return this;
	},

	enforceField: function(field){
		field = $(field);
		if (field) field.removeClass('warnOnly').removeClass('ignoreValidation');
		return this;
	}

});

FormValidator.getMsg = function(key){
	return MooTools.lang.get('FormValidator', key);
};

FormValidator.adders = {

	validators:{},

	add : function(className, options){
		this.validators[className] = new InputValidator(className, options);
		//if this is a class (this method is used by instances of FormValidator and the FormValidator namespace)
		//extend these validators into it
		//this allows validators to be global and/or per instance
		if (!this.initialize){
			this.implement({
				validators: this.validators
			});
		}
	},

	addAllThese : function(validators){
		$A(validators).each(function(validator){
			this.add(validator[0], validator[1]);
		}, this);
	},

	getValidator: function(className){
		return this.validators[className.split(":")[0]];
	}

};

$extend(FormValidator, FormValidator.adders);

FormValidator.implement(FormValidator.adders);

FormValidator.add('IsEmpty', {

	errorMsg: false,
	test: function(element){
		if (element.type == "select-one"||element.type == "select")
			return !(element.selectedIndex >= 0 && element.options[element.selectedIndex].value != "");
		else
			return ((element.get('value') == null) || (element.get('value').length == 0));
	}

});

FormValidator.addAllThese([

	['required', {
		errorMsg: function(){
			return FormValidator.getMsg('required');
		},
		test: function(element){
			return !FormValidator.getValidator('IsEmpty').test(element);
		}
	}],

	['minLength', {
		errorMsg: function(element, props){
			if ($type(props.minLength))
				return FormValidator.getMsg('minLength').substitute({minLength:props.minLength,length:element.get('value').length });
			else return '';
		},
		test: function(element, props){
			if ($type(props.minLength)) return (element.get('value').length >= $pick(props.minLength, 0));
			else return true;
		}
	}],

	['maxLength', {
		errorMsg: function(element, props){
			//props is {maxLength:10}
			if ($type(props.maxLength))
				return FormValidator.getMsg('maxLength').substitute({maxLength:props.maxLength,length:element.get('value').length });
			else return '';
		},
		test: function(element, props){
			//if the value is <= than the maxLength value, element passes test
			return (element.get('value').length <= $pick(props.maxLength, 10000));
		}
	}],

	['validate-integer', {
		errorMsg: FormValidator.getMsg.pass('integer'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) || (/^-?[1-9]\d*$/).test(element.get('value'));
		}
	}],

	['validate-numeric', {
		errorMsg: FormValidator.getMsg.pass('numeric'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) ||
				(/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(element.get('value'));
		}
	}],

	['validate-digits', {
		errorMsg: FormValidator.getMsg.pass('digits'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) || (/^[\d() .:\-\+#]+$/.test(element.get('value')));
		}
	}],

	['validate-alpha', {
		errorMsg: FormValidator.getMsg.pass('alpha'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) ||  (/^[a-zA-Z]+$/).test(element.get('value'));
		}
	}],

	['validate-alphanum', {
		errorMsg: FormValidator.getMsg.pass('alphanum'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) || !(/\W/).test(element.get('value'));
		}
	}],

	['validate-date', {
		errorMsg: function(element, props){
			if (Date.parse){
				var format = props.dateFormat || "%x";
				return FormValidator.getMsg('dateSuchAs').substitute({date:new Date().format(format)});
			} else {
				return FormValidator.getMsg('dateInFormatMDY');
			}
		},
		test: function(element, props){
			if (FormValidator.getValidator('IsEmpty').test(element)) return true;
			if (Date.parse){
				var format = props.dateFormat || "%x";
				var d = Date.parse(element.get('value'));
				var formatted = d.format(format);
				if (formatted != "invalid date") element.set('value', formatted);
				return !isNaN(d);
			} else {
			var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
			if (!regex.test(element.get('value'))) return false;
			var d = new Date(element.get('value').replace(regex, '$1/$2/$3'));
			return (parseInt(RegExp.$1, 10) == (1 + d.getMonth())) &&
				(parseInt(RegExp.$2, 10) == d.getDate()) &&
				(parseInt(RegExp.$3, 10) == d.getFullYear());
			}
		}
	}],

	['validate-email', {
		errorMsg: FormValidator.getMsg.pass('email'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) || (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(element.get('value'));
		}
	}],

	['validate-url', {
		errorMsg: FormValidator.getMsg.pass('url'),
		test: function(element){
			return FormValidator.getValidator('IsEmpty').test(element) || (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(element.get('value'));
		}
	}],

	['validate-currency-dollar', {
		errorMsg: FormValidator.getMsg.pass('currencyDollar'),
		test: function(element){
			// [$]1[##][,###]+[.##]
			// [$]1###+[.##]
			// [$]0.##
			// [$].##
			return FormValidator.getValidator('IsEmpty').test(element) ||  (/^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/).test(element.get('value'));
		}
	}],

	['validate-one-required', {
		errorMsg: FormValidator.getMsg.pass('oneRequired'),
		test: function(element, props){
			var p = $(props['validate-one-required']) || element.parentNode;
			return p.getElements('input').some(function(el){
				if (['checkbox', 'radio'].contains(el.get('type'))) return el.get('checked');
				return el.get('value');
			});
		}
	}]

]);

Element.Properties.validator = {

	set: function(options){
		var validator = this.retrieve('validator');
		if (validator) validator.setOptions(options);
		return this.store('validator:options');
	},

	get: function(options){
		if (options || !this.retrieve('validator')){
			if (options || !this.retrieve('validator:options')) this.set('validator', options);
			this.store('validator', new FormValidator(this, this.retrieve('validator:options')));
		}
		return this.retrieve('validator');
	}

};

Element.implement({

	validate: function(options){
		this.set('validator', options);
		return this.get('validator', options).validate();
	}

});
/*
Script: FormValidator.Extras.js
	Additional validators for the FormValidator class.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/
FormValidator.addAllThese([

	['validate-enforce-oncheck', {
		test: function(element, props){
			if (element.checked){
				var fv = element.getParent('form').retrieve('validator');
				if (!fv) return true;
				(props.toEnforce || $(props.enforceChildrenOf).getElements('input, select, textarea')).map(function(item){
					fv.enforceField(item);
				});
			}
			return true;
		}
	}],

	['validate-ignore-oncheck', {
		test: function(element, props){
			if (element.checked){
				var fv = element.getParent('form').retrieve('validator');
				if (!fv) return true;
				(props.toIgnore || $(props.ignoreChildrenOf).getElements('input, select, textarea')).each(function(item){
					fv.ignoreField(item);
					fv.resetField(item);
				});
			}
			return true;
		}
	}],

	['validate-nospace', {
		errorMsg: function(){
			return FormValidator.getMsg('noSpace');
		},
		test: function(element, props){
			return !element.get('value').test(/\s/);
		}
	}],

	['validate-toggle-oncheck', {
		test: function(element, props){
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			var eleArr = props.toToggle || $(props.toToggleChildrenOf).getElements('input, select, textarea');
			if (!element.checked){
				eleArr.each(function(item){
					fv.ignoreField(item);
					fv.resetField(item);
				});
			} else {
				eleArr.each(function(item){
					fv.enforceField(item);
				});
			}
			return true;
		}
	}],

	['validate-reqchk-bynode', {
		errorMsg: function(){
			return FormValidator.getMsg('reqChkByNode');
		},
		test: function(element, props){
			return ($(props.nodeId).getElements(props.selector || 'input[type=checkbox], input[type=radio]')).some(function(item){
				return item.checked;
			});
		}
	}],

	['validate-required-check', {
		errorMsg: function(element, props){
			return props.useTitle ? element.get('title') : FormValidator.getMsg('requiredChk');
		},
		test: function(element, props){
			return !!element.checked;
		}
	}],

	['validate-reqchk-byname', {
		errorMsg: function(element, props){
			return FormValidator.getMsg('reqChkByName').substitute({label: props.label || element.get('type')});
		},
		test: function(element, props){
			var grpName = props.groupName || element.get('name');
			var oneCheckedItem = $$(document.getElementsByName(grpName)).some(function(item, index){
				return item.checked;
			});
			var fv = element.getParent('form').retrieve('validator');
			if (oneCheckedItem && fv) fv.resetField(element);
			return oneCheckedItem;
		}
	}],

	['validate-match', {
		errorMsg: function(element, props){
			return FormValidator.getMsg('match').substitute({matchName: props.matchName || $(props.matchInput).get('name')});
		},
		test: function(element, props){
			var eleVal = element.get('value');
			var matchVal = $(props.matchInput) && $(props.matchInput).get('value');
			return eleVal && matchVal ? eleVal == matchVal : true;
		}
	}],

	['validate-after-date', {
		errorMsg: function(element, props){
			return FormValidator.getMsg('afterDate').substitute({
				label: props.afterLabel || (props.afterElement ? FormValidator.getMsg('startDate') : FormValidator.getMsg('currentDate'))
			});
		},
		test: function(element, props){
			var start = $(props.afterElement) ? Date.parse($(props.afterElement).get('value')) : new Date();
			var end = Date.parse(element.get('value'));
			return end && start ? end >= start : true;
		}
	}],

	['validate-before-date', {
		errorMsg: function(element, props){
			return FormValidator.getMsg('beforeDate').substitute({
				label: props.beforeLabel || (props.beforeElement ? FormValidator.getMsg('endDate') : FormValidator.getMsg('currentDate'))
			});
		},
		test: function(element, props){
			var start = Date.parse(element.get('value'));
			var end = $(props.beforeElement) ? Date.parse($(props.beforeElement).get('value')) : new Date();
			return end && start ? end >= start : true;
		}
	}],

	['validate-custom-required', {
		errorMsg: function(){
			return FormValidator.getMsg('required');
		},
		test: function(element, props){
			return element.get('value') != props.emptyValue;
		}
	}],

	['validate-same-month', {
		errorMsg: function(element, props){
			var startMo = $(props.sameMonthAs) && $(props.sameMonthAs).get('value');
			var eleVal = element.get('value');
			if (eleVal != ''){
				if (!startMo){ return FormValidator.getMsg('startMonth');}
				else {
					return FormValidator.getMsg('sameMonth');
				}
			}
		},
		test: function(element, props){
			var d1 = Date.parse(element.get('value'));
			var d2 = Date.parse($(props.sameMonthAs) && $(props.sameMonthAs).get('value'));
			return d1 && d2 ? d1.format("%B") == d2.format("%B") : true;
		}
	}]

]);
/*
Script: FormValidator.Inline.js
	Extends FormValidator to add inline messages.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

FormValidator.Inline = new Class({

	Extends: FormValidator,

	options: {
		scrollToErrorsOnSubmit: true,
		scrollFxOptions: {
			offset: {
				y: -20
			}
		}
	},

	initialize: function(form, options){
		this.parent(form, options);
		this.addEvent('onElementValidate', function(isValid, field, className, warn){
			var validator = this.getValidator(className);
			if (!isValid && validator.getError(field)){
				if (warn) field.addClass('warning');
				var advice = this.makeAdvice(className, field, validator.getError(field), warn);
				this.insertAdvice(advice, field);
				this.showAdvice(className, field);
			} else {
				this.hideAdvice(className, field);
			}
		});
	},

	makeAdvice: function(className, field, error, warn){
		var errorMsg = (warn)?this.warningPrefix:this.errorPrefix;
				errorMsg += (this.options.useTitles) ? field.title || error:error;
		var cssClass = (warn)?'warning-advice':'validation-advice';
		var advice = this.getAdvice(className, field);
		if(advice) {
			advice = advice.clone(true).set('html', errorMsg).replaces(advice);
		} else {
			advice = new Element('div', {
				html: errorMsg,
				styles: { display: 'none' },
				id: 'advice-'+className+'-'+this.getFieldId(field)
			}).addClass(cssClass);
		}
		field.store('advice-'+className, advice);
		return advice;
	},

	getFieldId : function(field){
		return field.id ? field.id : field.id = "input_" + field.name;
	},

	showAdvice: function(className, field){
		var advice = this.getAdvice(className, field);
		if (advice && !field.retrieve(this.getPropName(className))
				&& (advice.getStyle('display') == "none"
				|| advice.getStyle('visiblity') == "hidden"
				|| advice.getStyle('opacity') == 0)){
			field.store(this.getPropName(className), true);
			if (advice.reveal) advice.reveal();
			else advice.setStyle('display', 'block');
		}
	},

	hideAdvice: function(className, field){
		var advice = this.getAdvice(className, field);
		if (advice && field.retrieve(this.getPropName(className))){
			field.store(this.getPropName(className), false);
			//if Fx.Reveal.js is present, transition the advice out
			if (advice.dissolve) advice.dissolve();
			else advice.setStyle('display', 'none');
		}
	},

	getPropName: function(className){
		return 'advice' + className;
	},

	resetField: function(field){
		field = $(field);
		if (!field) return this;
		this.parent(field);
		field.className.split(" ").each(function(className){
			this.hideAdvice(className, field);
		}, this);
	},

	getAllAdviceMessages: function(field, force){
		var advice = [];
		if (field.hasClass('ignoreValidation') && !force) return advice;
		var validators = field.className.split(" ").some(function(cn){
			var warner = cn.test('^warn-') || field.hasClass('warnOnly');
			if (warner) cn = cn.replace(/^warn-/,"");
			var validator = this.getValidator(cn);
			if (!validator) return;
			advice.push({
				message: validator.getError(field),
				warnOnly: warner,
				passed: validator.test(),
				validator: validator
			});
		}, this);
		return advice;
	},

	getAdvice: function(className, field){
		return field.retrieve('advice-'+className);
	},

	insertAdvice: function(advice, field){
		//Check for error position prop
		var props = field.get('validatorProps');
		//Build advice
		if (!props.msgPos || !$(props.msgPos)){
			switch (field.type.toLowerCase()){
				case 'radio':
					var p = field.getParent().adopt(advice);
					break;
				default:
					advice.inject($(field), 'after');
			};
		} else {
			$(props.msgPos).grab(advice);
		}
	},

	validate: function(field, force){
		var result = this.parent(field, force);
		if (this.options.scrollToErrorsOnSubmit && !result){
			var failed = $(this).getElement('.validation-failed');
			var par = $(this).getParent();
			var isScrolled = function(p){
				return p.getScrollSize().y != p.getSize().y;
			};
			var scrolls;
			while (par != document.body && !isScrolled(par)){
				par = par.getParent();
			};
			var fx = par.retrieve('fvScroller');
			if (!fx && window.Fx && Fx.Scroll){
				fx = new Fx.Scroll(par, {
					transition: 'quad:out',
					offset: {
						y: -20
					}
				});
				par.store('fvScroller', fx);
			}
			if (failed){
				if (fx) fx.toElement(failed);
				else par.scrollTo(par.getScroll().x, failed.getPosition(par).y - 20);
			}
		}
	}

});

/*
Script: IframeShim.js
	Defines IframeShim, a class for obscuring select lists and flash objects in IE.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

var IframeShim = new Class({

	Implements: [Options, Events, Class.Occlude],

	options: {
		className: 'iframeShim',
		display: false,
		zIndex: null,
		margin: 0,
		offset: {x: 0, y: 0},
		browsers: (Browser.Engine.trident4 || (Browser.Engine.gecko && !Browser.Engine.gecko19 && Browser.Platform.mac))
	},

	property: 'IframeShim',

	initialize: function(element, options){
		this.element = $(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		if(this.options.browsers){
		  var zIndex = this.element.getStyle('zIndex').toInt();
			if (!zIndex){
				var pos = this.element.getStyle('position');
				if (pos == "static" || !pos) this.element.setStyle('position', 'relative');
				this.element.setStyle('zIndex', zIndex);
			}
			this.shim = new Iframe({
				src: (window.location.protocol == 'https') ? '://0' : 'javascript:void(0)',
				scrolling: 'no',
				frameborder: 0,
				styles: {
					zIndex: ($chk(this.options.zIndex) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1,
					position: 'absolute',
					border: 'none',
					filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
				},
				'class': this.options.className
			}).store('IframeShim', this);
			var inject = (function(){
				this.shim.inject(this.element, 'after');
				this[this.options.display ? 'show' : 'hide']();
				this.fireEvent('inject');
			}).bind(this);
			if (Browser.Engine.trident && !IframeShim.ready) window.addEvent('load', inject);
			else inject();
		} else {
			this.position = this.hide = this.show = this.dispose = $lambda(this);
		}
	},

	position: function(){
		if (!IframeShim.ready) return this;
		var size = this.element.measure(function(){ return this.getSize(); });
		if ($type(this.options.margin)){
			size.x = size.x - (this.options.margin * 2);
			size.y = size.y - (this.options.margin * 2);
			this.options.offset.x += this.options.margin;
			this.options.offset.y += this.options.margin;
		}
		if (this.shim) {
			this.shim.set({width: size.x, height: size.y}).position({
				relativeTo: this.element,
				offset: this.options.offset
			});
		}
		return this;
	},

	hide: function(){
		if (this.shim) this.shim.hide();
		return this;
	},

	show: function(){
		if (this.shim) this.shim.show();
		return this.position();
	},

	dispose: function(){
		if (this.shim) this.shim.dispose();
		return this;
	},

	destroy: function(){
		if (this.shim) this.shim.desroy();
		return this;
	}

});

window.addEvent('load', function(){
	IframeShim.ready = true;
});
/*
Script: Group.js
	Class for monitoring collections of events

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

var Group = new Class({

	initialize: function(){
		this.instances = Array.flatten(arguments);
		this.events = {};
		this.checker = {};
	},

	addEvent: function(type, fn){
		this.checker[type] = this.checker[type] || {};
		this.events[type] = this.events[type] || [];
		if (this.events[type].contains(fn)) return false;
		else this.events[type].push(fn);
		this.instances.each(function(instance, i){
			instance.addEvent(type, this.check.bind(this, [type, instance, i]));
		}, this);
		return this;
	},

	check: function(type, instance, i){
		this.checker[type][i] = true;
		var every = this.instances.every(function(current, j){
			return this.checker[type][j] || false;
		}, this);
		if (!every) return;
		this.checker[type] = {};
		this.events[type].each(function(event){
			event.call(this, this.instances, instance);
		}, this);
	}

});

/*
Script: Color.js
	Class for creating and manipulating colors in JavaScript. Supports HSB -> RGB Conversions and vice versa.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

var Color = new Native({

	initialize: function(color, type){
		if (arguments.length >= 3){
			type = 'rgb'; color = Array.slice(arguments, 0, 3);
		} else if (typeof color == 'string'){
			if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
			else if (color.match(/hsb/)) color = color.hsbToRgb();
			else color = color.hexToRgb(true);
		}
		type = type || 'rgb';
		switch (type){
			case 'hsb':
				var old = color;
				color = color.hsbToRgb();
				color.hsb = old;
			break;
			case 'hex': color = color.hexToRgb(true); break;
		}
		color.rgb = color.slice(0, 3);
		color.hsb = color.hsb || color.rgbToHsb();
		color.hex = color.rgbToHex();
		return $extend(color, this);
	}

});

Color.implement({

	mix: function(){
		var colors = Array.slice(arguments);
		var alpha = ($type(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

var $RGB = function(r, g, b){
	return new Color([r, g, b], 'rgb');
};

var $HSB = function(h, s, b){
	return new Color([h, s, b], 'hsb');
};

var $HEX = function(hex){
	return new Color(hex, 'hex');
};

Array.implement({

	rgbToHsb: function(){
		var red = this[0], green = this[1], blue = this[2];
		var hue, saturation, brightness;
		var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
		var delta = max - min;
		brightness = max / 255;
		saturation = (max != 0) ? delta / max : 0;
		if (saturation == 0){
			hue = 0;
		} else {
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	hsbToRgb: function(){
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}

});

String.implement({

	rgbToHsb: function(){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHsb() : null;
	},

	hsbToRgb: function(){
		var hsb = this.match(/\d{1,3}/g);
		return (hsb) ? hsb.hsbToRgb() : null;
	}

});

/*
Script: Assets.js
	Provides methods to dynamically load JavaScript, CSS, and Image files into the document.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
*/

var Asset = new Hash({

	javascript: function(source, properties){
		properties = $extend({
			onload: $empty,
			document: document,
			check: $lambda(true)
		}, properties);

		var script = new Element('script', {src: source, type: 'text/javascript'});

		var load = properties.onload.bind(script), check = properties.check, doc = properties.document;
		delete properties.onload; delete properties.check; delete properties.document;

		script.addEvents({
			load: load,
			readystatechange: function(){
				if (['loaded', 'complete'].contains(this.readyState)) load();
			}
		}).set(properties);

		if (Browser.Engine.webkit419) var checker = (function(){
			if (!$try(check)) return;
			$clear(checker);
			load();
		}).periodical(50);

		return script.inject(doc.head);
	},

	css: function(source, properties){
		return new Element('link', $merge({
			rel: 'stylesheet', media: 'screen', type: 'text/css', href: source
		}, properties)).inject(document.head);
	},

	image: function(source, properties){
		properties = $merge({
			onload: $empty,
			onabort: $empty,
			onerror: $empty
		}, properties);
		var image = new Image();
		var element = $(image) || new Element('img');
		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name;
			var event = properties[type];
			delete properties[type];
			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});
		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	},

	images: function(sources, options){
		options = $merge({
			onComplete: $empty,
			onProgress: $empty
		}, options);
		sources = $splat(sources);
		var images = [];
		var counter = 0;
		return new Elements(sources.map(function(source){
			return Asset.image(source, {
				onload: function(){
					options.onProgress.call(this, counter, sources.indexOf(source));
					counter++;
					if (counter == sources.length) options.onComplete();
				}
			});
		}));
	}

});
/*
Script: Hash.Cookie.js
	Class for creating, reading, and deleting Cookies in JSON format.

	License:
		MIT-style license.

	Authors:
		Valerio Proietti
		Aaron Newton
*/

Hash.Cookie = new Class({

	Extends: Cookie,

	options: {
		autoSave: true
	},

	initialize: function(name, options){
		this.parent(name, options);
		this.load();
	},

	save: function(){
		var value = JSON.encode(this.hash);
		if (!value || value.length > 4096) return false; //cookie would be truncated!
		if (value == '{}') this.dispose();
		else this.write(value);
		return true;
	},

	load: function(){
		this.hash = new Hash(JSON.decode(this.read(), true));
		return this;
	}

});

Hash.each(Hash.prototype, function(method, name){
	if (typeof method == 'function') Hash.Cookie.implement(name, function(){
		var value = method.apply(this.hash, arguments);
		if (this.options.autoSave) this.save();
		return value;
	});
});
/*
Script: Element.Pin.js
	Extends the Element native object to include the pin method useful for fixed positioning for elements.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

(function(){
	var supportsPositionFixed = false;
	window.addEvent('domready', function(){
		var test = new Element('div').setStyles({
			position: 'fixed',
			top: 0,
			right: 0
		}).inject(document.body);
		supportsPositionFixed = (test.offsetTop === 0);
		test.dispose();
	});

	Element.implement({

		pin: function(enable){
			if (this.getStyle('display') == 'none')
				return;

			if (enable!==false){
				var p = this.getPosition();
				if (!this.retrieve('pinned')){
					var pos = {
						top: p.y - window.getScroll().y,
						left: p.x - window.getScroll().x
					};
					if (supportsPositionFixed){
						this.setStyle('position','fixed').setStyles(pos);
					} else {
						this.store('pinnedByJS', true);
						this.setStyles({
							position: 'absolute',
							top: p.y,
							left: p.x
						});
						this.store('scrollFixer', (function(){
							if (this.retrieve('pinned'))
								this.setStyles({
									top: pos.top.toInt() + window.getScroll().y,
									left: pos.left.toInt() + window.getScroll().x
								});
						}).bind(this));
						window.addEvent('scroll', this.retrieve('scrollFixer'));
					}
					this.store('pinned', true);
				}
			} else {
				var op;
				if (!Browser.Engine.trident){
					if (this.getParent().getComputedStyle('position') != 'static') op = this.getParent();
					else op = this.getParent().getOffsetParent();
				}
				var p = this.getPosition(op);
				this.store('pinned', false);
				var reposition;
				if (supportsPositionFixed && !this.retrieve('pinnedByJS')){
					reposition = {
						top: p.y + window.getScroll().y,
						left: p.x + window.getScroll().x
					};
				} else {
					this.store('pinnedByJS', false);
					window.removeEvent('scroll', this.retrieve('scrollFixer'));
					reposition = {
						top: p.y,
						left: p.x
					};
				}
				this.setStyles($merge(reposition, {position: 'absolute'}));
			}
			return this.addClass('isPinned');
		},

		unpin: function(){
			return this.pin(false).removeClass('isPinned');
		},

		togglepin: function(){
			this.pin(!this.retrieve('pinned'));
		}

	});

})();
/*
Script: Clientcide.js
	The Clientcide namespace.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Clientcide = {
	version: '%build%',
	setAssetLocation: function(baseHref) {
		if (window.StickyWin && StickyWin.ui) {
			StickyWin.UI.implement({
				options: {
					baseHref: baseHref + '/stickyWinHTML/'
				}
			});
			if (StickyWin.alert) {
				var CGFsimpleErrorPopup = StickyWin.alert.bind(window);
				StickyWin.alert = function(msghdr, msg, base) {
				    return CGFsimpleErrorPopup(msghdr, msg, base||baseHref + "/simple.error.popup");
				};
			}
		}
		if (window.TagMaker) {
			TagMaker.implement({
			    options: {
			        baseHref: baseHref + '/tips/'
			    }
			});
		}
		if (window.ProductPicker) {
			ProductPicker.implement({
			    options:{
			        baseHref: baseHref + '/Picker'
			    }
			});
		}

		if (window.Autocompleter) {
			Autocompleter.Base.implement({
					options: {
						baseHref: baseHref + '/autocompleter/'
					}
			});
		}

		if (window.Lightbox) {
			Lightbox.implement({
			    options: {
			        assetBaseUrl: baseHref + '/slimbox/'
			    }
			});
		}

		if (window.Waiter) {
			Waiter.implement({
				options: {
					baseHref: baseHref + '/waiter/'
				}
			});
		}
	},
	preLoadCss: function(){
		if (window.StickyWin && StickyWin.ui) StickyWin.ui();
		if (window.StickyWin && StickyWin.pointy) StickyWin.pointy();
		Clientcide.preloaded = true;
		return true;
	},
	preloaded: false
};
(function(){
	if (!window.addEvent) return;
	var preload = function(){
		if (window.dbug) dbug.log('preloading clientcide css');
		if (!Clientcide.preloaded) Clientcide.preLoadCss();
	};
	window.addEvent('domready', preload);
	window.addEvent('load', preload);
})();
setCNETAssetBaseHref = Clientcide.setAssetLocation;
/*
Script: ToElement.js
	Defines the toElement method for a class.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Class.ToElement = new Class({
	toElement: function(){
		return this.element;
	}
});
var ToElement = Class.ToElement;
/*
Script: SimpleEditor.js
	A simple html editor for wrapping text with links and whatnot.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleEditor = new Class({
	Implements: [Class.ToElement, Class.Occlude],
	property: 'SimpleEditor',
	initialize: function(input, buttons, commands){
		this.element = $(input);
		if (this.occlude()) return this.occluded;
		this.commands = new Hash($extend(SimpleEditor.commands, commands||{}));
		this.buttons = $$(buttons);
		this.buttons.each(function(button){
			button.addEvent('click', function() {
				this.exec(button.get('rel'));
			}.bind(this));
		}.bind(this));
		$(this).addEvent('keydown', function(e){
			if (e.control||e.meta) {
				var key = this.shortCutToKey(e.key, e.shift);
				if (key) {
					e.stop();
					this.exec(key);
				}
			}
		}.bind(this));
	},
	shortCutToKey: function(shortcut, shift){
		var returnKey = false;
		this.commands.each(function(value, key){
			var char = (value.shortcut ? value.shortcut.toLowerCase() : value.shortcut);
			if (value.shortcut == shortcut || (shift && char == shortcut)) returnKey = key;
		});
		return returnKey;
	},
	addCommand: function(key, command, shortcut){
		this.commands.set(key, {
			command: command,
			shortcut: shortcut
		});
	},
	addCommands: function(commands){
		this.commands.extend(commands);
	},
	exec: function(key){
		var currentScrollPos; 
		if ($(this).scrollTop || $(this).scrollLeft) {
			currentScrollPos = {
				scrollTop: $(this).getScroll().y,
				scrollLeft: $(this).getScroll().x
			};
		}
		if (this.commands.has(key)) this.commands.get(key).command($(this));
		if (currentScrollPos) {
			$(this).set('scrollTop', currentScrollPos.getScroll().y);
			$(this).set('scrollLeft', currentScrollPos.getScroll().x);
		}
	}
});
$extend(SimpleEditor, {
	commands: {},
	addCommand: function(key, command, shortcut){
		SimpleEditor.commands[key] = {
			command: command,
			shortcut: shortcut
		}
	},
	addCommands: function(commands){
		$extend(SimpleEditor.commands, commands);
	}
});
SimpleEditor.addCommands({
	bold: {
		shortcut: 'b',
		command: function(input){
			input.insertAroundCursor({before:'<strong>',after:'</strong>'});
		}
	},
	underline: {
		shortcut: 'u',
		command: function(input){
			input.insertAroundCursor({before:'<span style="text-decoration:underline">',after:'</span>'});
		}
	},
	anchor: {
		shortcut: 'l',
		command: function(input){
			if (window.TagMaker){
				if (!this.linkBuilder) this.linkBuilder = new TagMaker.anchor();
				this.linkBuilder.prompt(input);
			} else {
				var href = window.prompt(SimpleEditor.getMsg('linkURL'));
				var opts = {before: '<a href="'+href+'">', after:'</a>'};
				if (!input.getSelectedText()) opts.defaultMiddle = window.prompt(SimpleEditor.getMsg('linkText'));
				input.insertAroundCursor(opts);
			}
		}
	},
	hr: {
		shortcut: '-',
		command: function(input){
			input.insertAtCursor('\n<hr/>\n');
		}
	},
	img: {
		shortcut: 'g',
		command: function(input){
			if (window.TagMaker) {
				if (!this.anchorBuilder) this.anchorBuilder = new TagMaker.image();
				this.anchorBuilder.prompt(input);
			} else {
				var href = window.prompt(SimpleEditor.getMsg('imgURL'));
				var alt = window.prompt(SimpleEditor.getMsg('imgAlt'));
				input.insertAtCursor('<img src="'+href+'" alt="'+alt.replace(/"/g,'')+'" />');
			}
		}
	},
	stripTags: {
		shortcut: '\\',
		command: function(input){
			input.insertAtCursor(input.getSelectedText().stripTags());
		}
	},
	sup: {
		shortcut: false,
		command: function(input){
			input.insertAroundCursor({before:'<sup>', after: '</sup>'});
		}
	},
	sub: {
		shortcut: false,
		command: function(input){
			input.insertAroundCursor({before:'<sub>', after: '</sub>'});
		}
	},
	blockquote: {
		shortcut: false,
		command: function(input){
			input.insertAroundCursor({before:'<blockquote>', after: '</blockquote>'});
		}
	},
	paragraph: {
		shortcut: 'enter',
		command: function(input){
			input.insertAroundCursor({before:'\n<p>\n', after: '\n</p>\n'});
		}
	},
	strike: {
		shortcut: 'k',
		command: function(input){
			input.insertAroundCursor({before:'<strike>',after:'</strike>'});
		}
	},
	italics: {
		shortcut: 'i',
		command: function(input){
			input.insertAroundCursor({before:'<em>',after:'</em>'});
		}
	},
	bullets: {
		shortcut: '8',
		command: function(input){
			input.insertAroundCursor({before:'<ul>\n	<li>',after:'</li>\n</ul>'});
		}
	},
	numberList: {
		shortcut: '=',
		command: function(input){
			input.insertAroundCursor({before:'<ol>\n	<li>',after:'</li>\n</ol>'});
		}
	},
	clean: {
		shortcut: false,
		command: function(input){
			input.tidy();
		}
	},
	preview: {
		shortcut: false,
		command: function(input){
			try {
				if (!this.container){
					this.container = new Element('div', {
						styles: {
							border: '1px solid black',
							padding: 8,
							height: 300,
							overflow: 'auto'
						}
					});
					this.preview = new StickyWin.Modal({
						content: StickyWin.ui("preview", this.container, {
							width: 600,
							buttons: [{
								text: 'close',
								onClick: function(){
									this.container.empty();
								}.bind(this)
							}]
						}),
						showNow: false
					});
				}
				this.container.set('html', input.get('value'));
				this.preview.show();
			} catch(e){dbug.log('you need StickyWin.Modal and StickyWin.ui')}
		}
	}
});

SimpleEditor.resources = {
	enUS: {
		woops:'Woops',
		nopeCtrlC:'Sorry, this function doesn\'t work here; use ctrl+c.',
		nopeCtrlX:'Sorry, this function doesn\'t work here; use ctrl+x.',
		linkURL:'The URL for the link',
		linkText:'The link text',
		imgURL:'The URL to the image',
		imgAlt:'The title (alt) for the image'
	}
};
SimpleEditor.language = "enUS";
SimpleEditor.getMsg = function(key, language){
	return SimpleEditor.resources[language||SimpleEditor.language][key];
};
/*
Script: SimpleEditor.French.js
	SimpleEditor messages in French. Thanks Miquel Hudin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
SimpleEditor.resources.FR = {
	woops:'Oops',
	nopeCtrlC:'Désolé, cette fonction ne fonctionne pas ici. Utilisez ctrl+c.',
	nopeCtrlX:'Désolé, cette fonction ne fonctionne pas ici. Utilisez ctrl+x.',
	linkURL:'L\'URL pour le lien',
	linkText:'Texte du lien',
	imgURL:'L\'URL de l\'image',
	imgAlt:'Le titre (alt) de l\'image'
};

/*
Script: SimpleEditor.Dutch.js
	SimpleEditor messages in Dutch. Thanks Lennart Pilon.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
SimpleEditor.resources.NL = {
	woops:'Oeps',
	nopeCtrlC:'Sorry, deze functie werkt niet; gebruik ctrl+c.',
	nopeCtrlX:'Sorry, deze functie werkt niet; gebruik ctrl+x.',
	linkURL:'De URL voor de snelkoppeling',
	linkText:'De tekst van de snelkoppeling',
	imgURL:'De URL van de afbeelding',
	imgAlt:'De titel (alt) voor de afbeelding'
};
/*
Script: SimpleEditor.Portuguese.js
	SimpleEditor messages in Portuguese. Thanks Miquel Hudin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
SimpleEditor.resources.POR = {
		woops:'Opa',
		nopeCtrlC:'Desculpe, esta função não funciona aqui. Use ctrl+c.',
		nopeCtrlX:'Desculpe, esta função não funciona aqui. Use ctrl+x.',
		linkURL:'O URL para o link',
		linkText:'Texto do link',
		imgURL:'A URL para a imagem',
		imgAlt:'O título (alt) para a imagem'
};
/*
Script: SimpleEditor.Spanish.js
	SimpleEditor messages in Spanish. Thanks Miquel Hudin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
SimpleEditor.resources.ESP = {
		woops:'¡Vaya!',
		nopeCtrlC:'Lo sentimos, esta función no funciona aquí.  Uso ctrl+c.',
		nopeCtrlX:'Lo sentimos, esta función no funciona aquí.  Uso ctrl+x.',
		linkURL:'La URL para el enlace',
		linkText:'Texto de enlace',
		imgURL:'La URL de la imagen',
		imgAlt:'El título (alt) de la imagen'
};
/*
Script: Collapsable.js
	Enables a dom element to, when clicked, hide or show (it toggles) another dom element. Kind of an Accordion for one item.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Collapsable = new Class({
	Extends: Fx.Reveal,
	initialize: function(clicker, section, options) {
		this.clicker = $(clicker);
		this.section = $(section);
		this.parent(this.section, options);
		this.addEvents();
	},
	addEvents: function(){
		this.clicker.addEvent('click', this.toggle.bind(this));
	}
});
/*
Script: TabSwapper.js

Handles the scripting for a common UI layout; the tabbed box.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var TabSwapper = new Class({
	Implements: [Options, Events],
	options: {
		selectedClass: 'tabSelected',
		mouseoverClass: 'tabOver',
		deselectedClass: '',
		rearrangeDOM: true,
		initPanel: 0, 
		smooth: false, 
		smoothSize: false,
		maxSize: null,
		effectOptions: {
			duration: 500
		},
		cookieName: null, 
		cookieDays: 999
//	onActive: $empty,
//	onActiveAfterFx: $empty,
//	onBackground: $empty
	},
	tabs: [],
	sections: [],
	clickers: [],
	sectionFx: [],
	initialize: function(options){
		this.setOptions(options);
		var prev = this.setup();
		if (prev) return prev;
		if (this.options.cookieName && this.recall()) this.show(this.recall().toInt());
		else this.show(this.options.initPanel);
	},
	setup: function(){
		var opt = this.options;
		sections = $$(opt.sections);
		tabs = $$(opt.tabs);
		if (tabs[0] && tabs[0].retrieve('tabSwapper')) return tabs[0].retrieve('tabSwapper');
		clickers = $$(opt.clickers);
		tabs.each(function(tab, index){
			this.addTab(tab, sections[index], clickers[index], index);
		}, this);
	},
	addTab: function(tab, section, clicker, index){
		tab = $(tab); clicker = $(clicker); section = $(section);
		//if the tab is already in the interface, just move it
		if (this.tabs.indexOf(tab) >= 0 && tab.retrieve('tabbered') 
			 && this.tabs.indexOf(tab) != index && this.options.rearrangeDOM) {
			this.moveTab(this.tabs.indexOf(tab), index);
			return this;
		}
		//if the index isn't specified, put the tab at the end
		if (!$defined(index)) index = this.tabs.length;
		//if this isn't the first item, and there's a tab
		//already in the interface at the index 1 less than this
		//insert this after that one
		if (index > 0 && this.tabs[index-1] && this.options.rearrangeDOM) {
			tab.inject(this.tabs[index-1], 'after');
			section.inject(this.tabs[index-1].retrieve('section'), 'after');
		}
		this.tabs.splice(index, 0, tab);
		clicker = clicker || tab;

		tab.addEvents({
			mouseout: function(){
				tab.removeClass(this.options.mouseoverClass);
			}.bind(this),
			mouseover: function(){
				tab.addClass(this.options.mouseoverClass);
			}.bind(this)
		});

		clicker.addEvent('click', function(e){
			e.preventDefault();
			this.show(index);
		}.bind(this));

		tab.store('tabbered', true);
		tab.store('section', section);
		tab.store('clicker', clicker);
		this.hideSection(index);
		return this;
	},
	removeTab: function(index){
		var now = this.tabs[this.now];
		if (this.now == index){
			if (index > 0) this.show(index - 1);
			else if (index < this.tabs.length) this.show(index + 1);
		}
		this.now = this.tabs.indexOf(now);
		return this;
	},
	moveTab: function(from, to){
		var tab = this.tabs[from];
		var clicker = tab.retrieve('clicker');
		var section = tab.retrieve('section');
		
		var toTab = this.tabs[to];
		var toClicker = toTab.retrieve('clicker');
		var toSection = toTab.retrieve('section');
		
		this.tabs.erase(tab).splice(to, 0, tab);

		tab.inject(toTab, 'before');
		clicker.inject(toClicker, 'before');
		section.inject(toSection, 'before');
		return this;
	},
	show: function(i){
		if (!$chk(this.now)) {
			this.tabs.each(function(tab, idx){
				if (i != idx) 
					this.hideSection(idx)
			}, this);
		}
		this.showSection(i).save(i);
		return this;
	},
	save: function(index){
		if (this.options.cookieName) 
			Cookie.write(this.options.cookieName, index, {duration:this.options.cookieDays});
		return this;
	},
	recall: function(){
		return (this.options.cookieName)?$pick(Cookie.read(this.options.cookieName), false): false;
	},
	hideSection: function(idx) {
		var tab = this.tabs[idx];
		if (!tab) return this;
		var sect = tab.retrieve('section');
		if (!sect) return this;
		if (sect.getStyle('display') != 'none') {
			this.lastHeight = sect.getSize().y;
			sect.setStyle('display', 'none');
			tab.swapClass(this.options.selectedClass, this.options.deselectedClass);
			this.fireEvent('onBackground', [idx, sect, tab]);
		}
		return this;
	},
	showSection: function(idx) {
		var tab = this.tabs[idx];
		if (!tab) return this;
		var sect = tab.retrieve('section');
		if (!sect) return this;
		var smoothOk = this.options.smooth && (!Browser.Engine.trident4 
										|| (Browser.Engine.trident4 && !Browser.Engine.trident4));
		if (this.now != idx) {
			if (!tab.retrieve('tabFx')) 
				tab.store('tabFx', new Fx.Morph(sect, this.options.effectOptions));
			var start = {
				display:'block',
				overflow: 'hidden'
			};
			if (smoothOk) start.opacity = 0;
			var effect = false;
			if (smoothOk) {
				effect = {opacity: 1};
			} else if (sect.getStyle('opacity').toInt() < 1) {
				sect.setStyle('opacity', 1);
				if (!this.options.smoothSize) 
					this.fireEvent('onActiveAfterFx', [idx, sect, tab]);
			}
			if (this.options.smoothSize) {
				var size = sect.getDimensions().height;
				if ($chk(this.options.maxSize) && this.options.maxSize < size) 
					size = this.options.maxSize;
				if (!effect) effect = {};
				effect.height = size;
			}
			if ($chk(this.now)) this.hideSection(this.now);
			if (this.options.smoothSize && this.lastHeight) start.height = this.lastHeight;
			sect.setStyles(start);
			if (effect) {
				tab.retrieve('tabFx').start(effect).chain(function(){
					this.fireEvent('onActiveAfterFx', [idx, sect, tab]);
					sect.setStyle("height", "auto");
				}.bind(this));
			}
			this.now = idx;
			this.fireEvent('onActive', [idx, sect, tab]);
		}
		tab.swapClass(this.options.deselectedClass, this.options.selectedClass);
		return this;
	}
});

//returns a collection given an id or a selector
$G = function(elements) {
	return $splat($(elements)||$$(elements));
};
var HoverGroup = new Class({
	Implements: [Options, Events],
	Binds: ['enter', 'leave', 'remain'],
	options: {
		//onEnter: $empty,
		//onLeave: $empty,
		elements: [],
		delay: 300,
		start: ['mouseenter'],
		remain: [],
		end: ['mouseleave']
	},
	initialize: function(options) {
		this.setOptions(options);
		this.attachTo(this.options.elements);
		this.addEvents({
			leave: function(){
				this.active = false;
			},
			enter: function(){
				this.active = true;
			}
		});
	},
	elements: [],
	attachTo: function(elements, detach){
		var starters = {}, remainers = {}, enders = {};
		elements = $G(elements);
		this.options.start.each(function(start) {
			starters[start] = this.enter;
		}, this);
		this.options.end.each(function(end) {
			enders[end] = this.leave;
		}, this);
		this.options.remain.each(function(remain){
			remainers[remain] = this.remain;
		}, this);
		if (detach) {
			elements.each(function(el) {
				el.removeEvents(starters).removeEvents(enders).removeEvents(remainers);
				this.elements.erase(el);
			});
		} else {
			elements.each(function(el){
				el.addEvents(starters).addEvents(enders).addEvents(remainers);
			});
			this.elements.combine(elements);
		}
		return this;
	},
	detachFrom: function(elements){
		this.attachTo(elements, true);
	},
	enter: function(e){
		this.isMoused = true;
		this.assert(e);
	},
	leave: function(e){
		this.isMoused = false;
		this.assert(e);
	},
	remain: function(e){
		if (this.active) this.enter(e);
	},
	assert: function(e){
		$clear(this.assertion);
		this.assertion = (function(){
			if (!this.isMoused && this.active) this.fireEvent('leave', e);
			else if (this.isMoused && !this.active) this.fireEvent('enter', e);
		}).delay(this.options.delay, this);
	}
});
/*
Script: MenuSlider.js
	Slides open a menu when the user mouses over a dom element. leaves it open while the mouse is over that element or the menu.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MenuSlider = new Class({
	Implements: [Options, Events],
	Binds: ['slideIn', 'slideOut'],
	options: {
	/*	onIn: $empty,
		onInStart: $empty,
		onOut: $empty,
		hoverGroupOptions: {}, */
		fxOptions: {
			duration: 400,
			transition: 'expo:out',
			link: 'cancel'
		},
		useIframeShim: true
	},
	initialize: function(menu, subMenu, options) {
		this.menu = $(menu);
		this.subMenu = $(subMenu);
		this.setOptions(options);
		this.makeSlider();
		this.hoverGroup = new HoverGroup($merge(this.options.hoverGroupOptions, {
			elements: [this.menu, this.subMenu],
			onEnter: this.slideIn,
			onLeave: this.slideOut
		}));
	},
	makeSlider: function(){
		this.slider = new Fx.Slide(this.subMenu, this.options.fxOptions).hide();
		if (this.options.useIframeShim && window.IframeShim) this.shim = new IframeShim(this.subMenu);
	},
	slideIn: function(){
		this.fireEvent('inStart');
		this.slider.slideIn().chain(function(){
			if (this.shim) this.shim.show();
			this.fireEvent('in');
		}.bind(this));
		return this;
	},
	slideOut: function(){
		this.hide();
		this.fireEvent('out');
		if (this.shim) this.shim.hide();
		return this;
	},
	hide: function(){
		$clear(this.hoverGroup.assertion);
		this.hoverGroup.active = false;
		this.slider.cancel();
		this.slider.hide();
		if (this.shim) this.shim.hide();
		return this;
	}
});
/*
Script: SimpleSlideShow.js

Makes a very, very simple slideshow gallery with a collection of dom elements and previous and next buttons.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleSlideShow = new Class({
	Implements: [Events, Options, Chain],
	options: {
		startIndex: 0,
		slides: [],
		currentSlideClass: 'currentSlide',
		currentIndexContainer: false,
		maxContainer: false,
		nextLink: false,
		prevLink: false,
		wrap: true,
		disabledLinkClass: 'disabled',
//		onNext: $empty,
//		onPrev: $empty,
//		onSlideClick: $empty,
//		onSlideDisplay: $empty,
		crossFadeOptions: {}
	},
	initialize: function(options){
		this.setOptions(options);
		var slides = this.options.slides;
		this.makeSlides(slides);
		this.setCounters();
		this.setUpNav();
		this.now = this.options.startIndex;
		if (this.slides.length > 0) this.show(this.now);
	},
	slides:[],
	setCounters: function(){
		if ($(this.options.currentIndexContainer))$(this.options.currentIndexContainer).set('html', this.now+1);
		if ($(this.options.maxContainer))$(this.options.maxContainer).set('html', this.slides.length);
	},
	makeSlides: function(slides){
		//hide them all
		slides.each(function(slide, index){
			if (index != this.now) slide.setStyle('display', 'none');
			else slide.setStyle('display', 'block');
			this.makeSlide(slide);
		}, this);
	},
	makeSlide: function(slide){
		slide.addEvent('click', function(){ this.fireEvent('onSlideClick'); }.bind(this));
		this.slides.include(slide);
	},
	setUpNav: function(){	
		if ($(this.options.nextLink)) {
			$(this.options.nextLink).addEvent('click', function(){
				this.forward();
			}.bind(this));
		}
		if ($(this.options.prevLink)) {
			$(this.options.prevLink).addEvent('click', function(){
				this.back();
			}.bind(this));
		}
	},
	disableLinks: function(now){
		if (this.options.wrap) return;
		now = $pick(now, this.now);
		var prev = $(this.options.prevLink);
		var next = $(this.options.nextLink);
		var dlc = this.options.disabledLinkClass;
		if (now > 0) {
			if (prev) prev.removeClass(dlc);
			if (now === this.slides.length-1 && next) next.addClass(dlc);
			else if (next) next.removeClass(dlc)
		}	else { //now is zero
			if (this.slides.length > 0 && next) next.removeClass(dlc);
			if (prev) prev.addClass(dlc);
		}
	},
	forward: function(){
		if ($type(this.now) && this.now < this.slides.length-1) this.show(this.now+1);
		else if ($type(this.now) && this.options.wrap) this.show(0);
		else if (!$type(this.now)) this.show(this.options.startIndex);
		this.fireEvent('next');
		return this;
	},
	back: function(){
		if (this.now > 0) {
			this.show(this.now-1);
			this.fireEvent('onPrev');
		} else if (this.options.wrap && this.slides.length > 1) {
			this.show(this.slides.length-1);
			this.fireEvent('prev');
		}
		return this;
	},
	show: function(index){
		if (this.showing) return this.chain(this.show.bind(this, index));
		var now = this.now;
		var s = this.slides[index]; //saving bytes
		function fadeIn(s, resetOpacity){
			s.setStyle('display','block');
			if (!Browser.Engine.trident4) {
				if (resetOpacity) s.setStyle('opacity', 0);
				s.set('tween', this.options.crossFadeOptions).get('tween').start('opacity', 1).chain(function(){
					this.showing = false;
					this.disableLinks();
					this.callChain();
					this.fireEvent('onSlideDisplay', index);
				}.bind(this));
			}
		};
		if (s) {
			if ($type(this.now) && this.now != index){
				if (!Browser.Engine.trident4) {
					var fx = this.slides[this.now].get('tween');
					fx.setOptions(this.options.crossFadeOptions);
					this.showing = true;
					fx.start('opacity', 0).chain(function(){
						this.slides[now].setStyle('display','none');
						s.addClass(this.options.currentSlideClass);
						fadeIn.run([s, true], this);
						this.fireEvent('onSlideDisplay', index);
					}.bind(this));
				} else {
					this.slides[this.now].setStyle('display','none');
					fadeIn.run(s, this);
				}
			} else fadeIn.run(s, this);
			this.now = index;
			this.setCounters();
		}
	},
	slideClick: function(){
		this.fireEvent('onSlideClick', [this.slides[this.now], this.now]);
	}
});

SimpleSlideShow.Carousel = new Class({
	Extends: SimpleSlideShow,
	Implements: [Class.ToElement],
	Binds: ['makeSlide'],
	options: {
		sliderWidth: 999999
	},
	initialize: function(container, options){
		this.setOptions(options);
		this.container = $(container);
		this.element = new Element('div').wraps(this.container).setStyles({
			width: this.container.getSize().x,
			overflow: 'hidden'
		});
		this.container.setStyles({
			width: this.options.sliderWidth,
			position: 'relative'
		});
		this.parent(options);
	},
	makeSlides: function(slides) {
		this.slides = [];
		slides.each(this.makeSlide);
	},
	makeSlide: function(slide) {
		if (slide.retrieve('slideSetup')) return;
		slide.store('slideSetup', true);
		slide.show();
		var s = new Element('div', {
			styles: {
				'float': 'left',
				width: $(this).getSize().x
			}
		}).wraps(slide);
		this.parent(s);
		this.slides.erase(slide);
		this.setCounters();
		s.show();
		s.inject(this.container);
	},
	show: function(index) {
		if (!this.container) return;
		this.fx = this.fx || new Fx.Tween(this.container, {
			property: 'left'
		});
		if (this.showing) return this.chain(this.show.bind(this, index));
		var now = this.now;
		var s = this.slides[index]; //saving bytes
		if (s) {
			if (this.now != index) {
				this.fx.start(-s.getPosition(this.container).x).chain(function(){
					s.addClass(this.options.currentSlideClass);
					this.showing = false;
					this.disableLinks();
					this.callChain();
					this.fireEvent('onSlideDisplay', index);
				}.bind(this));
			}
			this.now = index;
			this.setCounters();
		}
	}
});

var SimpleImageSlideShow;
(function(){
	var extender = function(extend, passContainer) {
		return {
			Extends: extend,
			Implements: Class.ToElement,
			options: {
				imgUrls: [],
				imgClass: 'screenshot',
				container: false
			},
			initialize: function(){
				var args = Array.link(arguments, {options: Object.type, container: $defined});
				this.container = $(args.container) || (args.options?$(args.options.container):false); //legacy
				if (passContainer) this.parent(this.container, args.options);
				else this.parent(args.options);
				this.options.imgUrls.each(function(url){
					this.addImg(url);
				}, this);
				this.show(this.options.startIndex);
			},
			addImg: function(url){
				if (this.container) {
					var img = new Element('img', {
						'src': url,
						'id': this.options.imgClass+this.slides.length
					}).addClass(this.options.imgClass).setStyle(
						'display', 'none').inject(this.container).addEvent(
						'click', this.slideClick.bind(this));
					this.slides.push(img);
					this.makeSlide(img);
					this.setCounters();
				}
				return this;
			}
		};
	};
	SimpleImageSlideShow = new Class(extender(SimpleSlideShow));
	SimpleImageSlideShow.Carousel = new Class(extender(SimpleSlideShow.Carousel, true));
})();

/*
Script: SimpleCarousel.js

Builds a carousel object that manages the basic functions of a generic carousel (a carousel	here being a collection of "slides" that play from one to the next, with a collection of "buttons" that reference each slide).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleCarousel = new Class({
	Implements: [Options, Events],
	options: {
//		onRotate: $empty,
//		onStop: $empty,
//		onAutoPlay: $empty,
//		onShowSlide: $empty,
		slideInterval: 4000,
		transitionDuration: 700,
		startIndex: 0,
		buttonOnClass: "selected",
		buttonOffClass: "off",
		rotateAction: "none",
		rotateActionDuration: 100,
		autoplay: true
	},
	initialize: function(container, slides, buttons, options){
		this.container = $(container);
		var instance = this.container.retrieve('SimpleCarouselInstance');
		if (instance) return instance;
		this.container.store('SimpleCarouselInstance', this);
		this.setOptions(options);
		this.container.addClass('hasCarousel');
		this.slides = $$(slides);
		this.buttons = $$(buttons);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if (this.options.autoplay) this.autoplay();
		if (this.options.rotateAction != 'none') this.setupAction(this.options.rotateAction);
		return this;
	},
	toElement: function(){
		return this.container;
	},
	setupAction: function(action) {
		this.buttons.each(function(el, idx){
			$(el).addEvent(action, function() {
				this.slideFx.setOptions(this.slideFx.options, {duration: this.options.rotateActionDuration});
				if (this.currentSlide != idx) this.showSlide(idx);
				this.stop();
			}.bind(this));
		}, this);
	},
	createFx: function(){
		if (!this.slideFx) this.slideFx = new Fx.Elements(this.slides, {duration: this.options.transitionDuration});
		this.slides.each(function(slide){
			slide.setStyle('opacity',0);
		});
	},
	showSlide: function(slideIndex){
		var action = {};
		this.slides.each(function(slide, index){
			if (index == slideIndex && index != this.currentSlide){ //show
				$(this.buttons[index]).swapClass(this.options.buttonOffClass, this.options.buttonOnClass);
				action[index.toString()] = {
					opacity: 1
				};
			} else {
				$(this.buttons[index]).swapClass(this.options.buttonOnClass, this.options.buttonOffClass);
				action[index.toString()] = {
					opacity:0
				};
			}
		}, this);
		this.fireEvent('onShowSlide', slideIndex);
		this.currentSlide = slideIndex;
		this.slideFx.start(action);
		return this;
	},
	autoplay: function(){
		this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
		this.fireEvent('onAutoPlay');
		return this;
	},
	stop: function(){
		$clear(this.slideshowInt);
		this.fireEvent('onStop');
		return this;
	},
	rotate: function(){
		var current = this.currentSlide;
		var next = (current+1 >= this.slides.length) ? 0 : current+1;
		this.showSlide(next);
		this.fireEvent('onRotate', next);
		return this;
	}
});
/*
Script: MultipleOpenAccordion.js

Creates a Mootools Fx.Accordion that allows the user to open more than one element.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MultipleOpenAccordion = new Class({
	Implements: [Options, Events, Chain],
	options: {
		togglers: [],
		elements: [],
		openAll: true,
		firstElementsOpen: [0],
		fixedHeight: false,
		fixedWidth: false,
		height: true,
		opacity: true,
		width: false
//	onActive: $empty,
//	onBackground: $empty
	},
	togglers: [],
	elements: [],
	initialize: function(container, options){
		this.setOptions(options);
		this.container = $(container);
		elements = $$(options.elements);
		$$(options.togglers).each(function(toggler, idx){
			this.addSection(toggler, elements[idx], idx);
		}, this);
		if (this.togglers.length) {
			if (this.options.openAll) this.showAll();
			else this.toggleSections(this.options.firstElementsOpen, false, true);
		}
		this.openSections = this.showSections.bind(this);
		this.closeSections = this.hideSections.bind(this);
	},
	addSection: function(toggler, element){
		toggler = $(toggler);
		element = $(element);
		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		this.togglers.include(toggler);
		this.elements.include(element);
		var idx = this.togglers.indexOf(toggler);
		toggler.addEvent('click', this.toggleSection.bind(this, idx));
		var mode;
		if (this.options.height && this.options.width) mode = "both";
		else mode = (this.options.height)?"vertical":"horizontal";
		element.store('reveal', new Fx.Reveal(element, {
			transitionOpacity: this.options.opacity,
			mode: mode,
			heightOverride: this.options.fixedHeight,
			widthOverride: this.options.fixedWidth
		}));
		return this;
	},
	onComplete: function(idx, callChain){
		this.fireEvent(this.elements[idx].isDisplayed()?'onActive':'onBackground', [this.togglers[idx], this.elements[idx]]);
		this.callChain();
		return this;
	},
	showSection: function(idx, useFx){
		this.toggleSection(idx, useFx, true);
	},
	hideSection: function(idx, useFx){
		this.toggleSection(idx, useFx, false);
	},
	toggleSection: function(idx, useFx, show, callChain){
		var method = show?'reveal':$defined(show)?'dissolve':'toggle';
		callChain = $pick(callChain, true);
		var el = this.elements[idx];
		if ($pick(useFx, true)) {
			el.retrieve('reveal')[method]().chain(
				this.onComplete.bind(this, [idx, callChain])
			);
		} else {
				if (method == "toggle") el.togglek();
				else el[method == "reveal"?'show':'hide']();
				this.onComplete(idx, callChain);
		}
		return this;
	},
	toggleAll: function(useFx, show){
		var method = show?'reveal':$chk(show)?'disolve':'toggle';
		var last = this.elements.getLast();
		this.elements.each(function(el, idx){
			this.toggleSection(idx, useFx, show, el == last);
		}, this);
		return this;
	},
	toggleSections: function(sections, useFx, show) {
		last = sections.getLast();
		this.elements.each(function(el,idx){
			this.toggleSection(idx, useFx, sections.contains(idx)?show:!show, idx == last);
		}, this);
		return this;
	},
	showSections: function(sections, useFx){
		sections.each(function(i){
			this.showSection(i, useFx);
		}, this);
	},
	hideSections: function(sections, useFx){
		sections.each(function(i){
			this.hideSection(i, useFx);
		}, this);
	},
	showAll: function(useFx){
		return this.toggleAll(useFx, true);
	},
	hideAll: function(useFx){
		return this.toggleAll(useFx, false);
	}
});

/*
Script: MooScroller.js

Recreates the standard scrollbar behavior for elements with overflow but using DOM elements so that the scroll bar elements are completely styleable by css.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MooScroller = new Class({
	Implements: [Options, Events],
	options: {
		maxThumbSize: 10,
		mode: 'vertical',
		width: 0, //required only for mode: horizontal
		scrollSteps: 10,
		wheel: true,
		scrollLinks: {
			forward: 'scrollForward',
			back: 'scrollBack'
		},
		hideWhenNoOverflow: true
//		onScroll: $empty,
//		onPage: $empty
	},

	initialize: function(content, knob, options){
		this.setOptions(options);
		this.horz = (this.options.mode == "horizontal");

		this.content = $(content).setStyle('overflow', 'hidden');
		this.knob = $(knob);
		this.track = this.knob.getParent();
		this.setPositions();
		
		if (this.horz && this.options.width) {
			this.wrapper = new Element('div');
			this.content.getChildren().each(function(child){
				this.wrapper.adopt(child);
			}, this);
			this.wrapper.inject(this.content).setStyle('width', this.options.width);
		}
		

		this.bound = {
			'start': this.start.bind(this),
			'end': this.end.bind(this),
			'drag': this.drag.bind(this),
			'wheel': this.wheel.bind(this),
			'page': this.page.bind(this)
		};

		this.position = {};
		this.mouse = {};
		this.update();
		this.attach();
		
		var clearScroll = function (){
			$clear(this.scrolling);
		}.bind(this);
		['forward','back'].each(function(direction) {
			var lnk = $(this.options.scrollLinks[direction]);
			if (lnk) {
				lnk.addEvents({
					mousedown: function() {
						this.scrolling = this[direction].periodical(50, this);
					}.bind(this),
					mouseup: clearScroll.bind(this),
					click: clearScroll.bind(this)
				});
			}
		}, this);
		this.knob.addEvent('click', clearScroll.bind(this));
		window.addEvent('domready', function(){
			try {
				$(document.body).addEvent('mouseup', clearScroll.bind(this));
			}catch(e){}
		}.bind(this));
	},
	setPositions: function(){
		[this.track, this.knob].each(function(el){
			if (el.getStyle('position') == 'static') el.setStyle('position','relative');
		});

	},
	toElement: function(){
		return this.content;
	},
	update: function(){
		var plain = this.horz?'Width':'Height';
		this.contentSize = this.content['offset'+plain];
		this.contentScrollSize = this.content['scroll'+plain];
		this.trackSize = this.track['offset'+plain];

		this.contentRatio = this.contentSize / this.contentScrollSize;

		this.knobSize = (this.trackSize * this.contentRatio).limit(this.options.maxThumbSize, this.trackSize);

		if (this.options.hideWhenNoOverflow) {
			this.hidden = this.knobSize == this.trackSize;
			this.track.setStyle('opacity', this.hidden?0:1);
		}
		
		this.scrollRatio = this.contentScrollSize / this.trackSize;
		this.knob.setStyle(plain.toLowerCase(), this.knobSize);

		this.updateThumbFromContentScroll();
		this.updateContentFromThumbPosition();
	},

	updateContentFromThumbPosition: function(){
		this.content[this.horz?'scrollLeft':'scrollTop'] = this.position.now * this.scrollRatio;
	},

	updateThumbFromContentScroll: function(){
		this.position.now = (this.content[this.horz?'scrollLeft':'scrollTop'] / this.scrollRatio).limit(0, (this.trackSize - this.knobSize));
		this.knob.setStyle(this.horz?'left':'top', this.position.now);
	},

	attach: function(){
		this.knob.addEvent('mousedown', this.bound.start);
		if (this.options.scrollSteps) this.content.addEvent('mousewheel', this.bound.wheel);
		this.track.addEvent('mouseup', this.bound.page);
	},

	wheel: function(event){
		if (this.hidden) return;
		this.scroll(-(event.wheel * this.options.scrollSteps));
		this.updateThumbFromContentScroll();
		event.stop();
	},

	scroll: function(steps){
		steps = steps||this.options.scrollSteps;
		this.content[this.horz?'scrollLeft':'scrollTop'] += steps;
		this.updateThumbFromContentScroll();
		this.fireEvent('onScroll', steps);
	},
	forward: function(steps){
		this.scroll(steps);
	},
	back: function(steps){
		steps = steps||this.options.scrollSteps;
		this.scroll(-steps);
	},

	page: function(event){
		var axis = this.horz?'x':'y';
		var forward = (event.page[axis] > this.knob.getPosition()[axis]);
		this.scroll((forward?1:-1)*this.content['offset'+(this.horz?'Width':'Height')]);
		this.updateThumbFromContentScroll();
		this.fireEvent('onPage', forward);
		event.stop();
	},

	
	start: function(event){
		var axis = this.horz?'x':'y';
		this.mouse.start = event.page[axis];
		this.position.start = this.knob.getStyle(this.horz?'left':'top').toInt();
		document.addEvent('mousemove', this.bound.drag);
		document.addEvent('mouseup', this.bound.end);
		this.knob.addEvent('mouseup', this.bound.end);
		event.stop();
	},

	end: function(event){
		document.removeEvent('mousemove', this.bound.drag);
		document.removeEvent('mouseup', this.bound.end);
		this.knob.removeEvent('mouseup', this.bound.end);
		event.stop();
	},

	drag: function(event){
		var axis = this.horz?'x':'y';
		this.mouse.now = event.page[axis];
		this.position.now = (this.position.start + (this.mouse.now - this.mouse.start)).limit(0, (this.trackSize - this.knobSize));
		this.updateContentFromThumbPosition();
		this.updateThumbFromContentScroll();
		event.stop();
	}

});

/*
Script: HtmlTable.js

Builds table elements with methods to add rows quickly.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var HtmlTable = new Class({
	Implements: [Options],
	options: {
		properties: {
			cellpadding: 0,
			cellspacing: 0,
			border: 0
		},
		rows: []
	},
	initialize: function(options) {
		this.setOptions(options);
		this.table = new Element('table').setProperties(this.options.properties);
		this.table.store('HtmlTable', this);
		this.tbody = new Element('tbody').inject(this.table);
		this.options.rows.each(this.push.bind(this));
		["adopt", "inject", "wraps", "grab", "replaces", "empty", "dispose"].each(function(method){
				this[method] = this.table[method].bind(this.table);
		}, this);
	},
	toElement: function(){
		return this.table;
	},
	push: function(row) {
		var tr = new Element('tr').inject(this.tbody);
		var tds = row.map(function (tdata) {
			tdata = tdata || '';
			var td = new Element('td').inject(tr);
			if (tdata.properties) td.setProperties(tdata.properties);
			function setContent(content){
				if ($(content)) td.adopt($(content));
				else td.set('html', content);
			};
			if ($defined(tdata.content)) setContent(tdata.content);
			else setContent(tdata);
			return td;
		}, this);
		return {tr: tr, tds: tds};
	}
});
/*
Script: Element.Delegation.js
	Extends the Element native object to include the delegate method for more efficient event management.

	Event checking based on the work of Daniel Steigerwald.
	License: MIT-style license.
	Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz

	License:
		MIT-style license.

	Authors:
		Aaron Newton
		Daniel Steigerwald

*/
(function(){

	var getType = function(type){
		var custom = Element.Events.get(type);
		return custom ? custom.base : type;
	};

	var checkOverOut = function(el, e){
		if (el == e.target || el.hasChild(e.target)){
			var related = e.relatedTarget;
			if (related == undefined) return true;
			if (related === false) return false;
			return ($type(el) != 'document' && related != el && related.prefix != 'xul' && !el.hasChild(related));
		}
	};

	var check = function(e, test){
		var target = e.target;
		var isOverOut = /^(mouseover|mouseout)$/.test(e.type);
		var els = this.getElements(test);
		var match = els.indexOf(target);
		if (match >= 0) return els[match];
		for (var i = els.length; i--; ){
			var el = els[i];
			if (el == target || el.hasChild(target)){
				return (!isOverOut || checkOverOut(el, e)) ? el : false;
			}
		}
	};

	var splitType = function(type){
		if (type.test(/^.*?\(.*?\)$/)){
			return {
				event: type.match(/.*?(?=\()/),
				selector: type.replace(/^.*?\((.*)\)$/, "$1")
			};
		}
		return {event: type};
	};

	var oldAddEvent = Element.prototype.addEvent,
		oldAddEvents = Element.prototype.addEvents,
		oldRemoveEvent = Element.prototype.removeEvent,
		oldRemoveEvents = Element.prototype.removeEvents;
	Element.implement({
		//use as usual (this.addEvent('click', fn))
		//or for delegation
		//this.addEvent('click(div.foo)', fn)
		addEvent: function(type, fn){
			var splitted = splitType(type);
			//if the type has a selector
			if (splitted.selector){
				//get the delegates and the monitors
				var monitors = this.retrieve('$moo:delegateMonitors', {});
				//if there's not a delegate for this type already
				if (!monitors[type]){
					//create a monitor that will fire the event when it occurs
					var monitor = function(e){
						var el = check.call(this, e, splitted.selector);
						if (el) this.fireEvent(type, [e, el], 0, el);
					}.bind(this);
					monitors[type] = monitor;
					//add the monitor to the element
					//translates to this.addEvent('click', monitor);
					//monitor just looks for clicks that match the selector
					//and fires the event
					//we only create one monitor for a given selector and all it does
					//is calls fireEvent for that selector
					//i.e. this.fireEvent('click:div.foo')
					oldAddEvent.call(this, splitted.event, monitor);
				}
			}
			return oldAddEvent.apply(this, arguments);
		},
		removeEvent: function(type, fn){
			//if we're removing an event with a selector
			var splitted = splitType(type);
			if (splitted.selector){
				var events = this.retrieve('events');
				//if there are no events with this type or
				//if a specific fn is being removed but isn't attached, return
				if (!events[type] || (fn && !events[type].contains(fn))) return this;
				//if a fn is defined, remove it from the events
				if (fn) events[type].erase(fn);
				//else empty all the events of this type
				else events[type].empty();
				//if there are none left, we remove the monitor, too
				if (events[type].length == 0){
					//get the monitors we've created
					var monitors = this.retrieve('$moo:delegateMonitors', {});
					//remove the monitor
					oldRemoveEvent(splitted.event, monitors[type]);
					//delete the monitor from the monitors list
					delete monitors[type];
				}
				return this;
			}
			//otherwise do what you normally do and remove the event (no selector involved)
			return oldRemoveEvent.apply(this, arguments);
		},
		//fireEvent is changed to allow a bind argument so that we can bind
		//the method to the element in our monitor above
		fireEvent: function(type, args, delay, bind){
			var events = this.retrieve('events');
			if (!events || !events[type]) return this;
			events[type].keys.each(function(fn){
				//added the bind||this
				fn.create({'bind': bind||this, 'delay': delay, 'arguments': args})();
			}, this);
			return this;
		}
	});

})();
/*
Script: CiUI.js

Handles iPhone-optimized pages and mimics iPhone UI behavior

Version: 0.3

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

(function() {

if (!window.addEventListener) return;

var bodyEl; // see ciUI.initialize() for details
var buttonForward = "go_forward";
var buttonBackward = "go_back";
var buttonLoadMore = "load_more";
var cachePage = "cache";
var backButtonEl; // see ciUI.initialize() for details
var backButtonTextEl; // see ciUI.initialize() for details
var pageTitleEl; // see ciUI.initialize() for details
var update = "do_update";
var updateAttr = "update";

var pages = []; // see ciUI.initialize() for details
var pageHistory = [];
var cachedPages = [];
var cacheCounter = 0;
var cachedPagePrefix = "__cached-"; 

var homePage = location.href;
var hashPrefix = "#__";
var currentHash = hashPrefix + 0;
var currentPage = 1; // possible values are 1 or -1 (1: from, -1: to)

var animSpeed = 20; // smaller number means slower animation
var navigationCheckInterval = 300;
var navigtionChangeTimer;
var httpRequest = null;
var uiIsActive;

window.ciUI = {
	initialize: function() {
		bodyEl = $("iphone_body");
		backButtonEl = $("iphone_backbutton");
		backButtonTextEl = $("iphone_backbutton_text");
		pageTitleEl = $("iphone_title");
		if (!bodyEl || !backButtonEl || !backButtonTextEl || !pageTitleEl) return;
		if (pageTitleEl && pageTitleEl.innerHTML == "") pageTitleEl.innerHTML = document.title;
		this.setupPages();
		this.animating = false;
		this.shouldCache = null;		
		setTimeout(scrollTo, 100, 0, 1);
		return true;
	},
	
	setupPages: function() {
		var page1 = document.createElement('div');
		var page2 = document.createElement('div');
		var home  = document.createElement('div');
		var ascrolltop = document.createElement('a');

		page1.id = "__page1__";
		page1.className = "iphone_page";
		page1.style.left = "0%";
		page1.style.display = "block";
		
		page2.id = "__page2__";
		page2.className = "iphone_page";
		page2.style.left = "100%";
		page2.style.display = "none";
		
		home.id	= "__home__";
		home.style.display = "none";
		ascrolltop.id = "__scroll_top__";
		ascrolltop.name = "";
		
		page1.innerHTML = home.innerHTML = bodyEl.innerHTML;
		bodyEl.innerHTML = "";
		bodyEl.appendChild(page1);
		bodyEl.appendChild(page2);		
		document.body.appendChild(home);
		document.body.insertBefore(ascrolltop, document.body.firstChild);

		this.adjustBodyToEl(page1);
	
		pages[1] = $(page1.id);
		pages[0] = $(home.id);
		pages[-1] = $(page2.id);
	},
	
	goToPage: function(target, backwards, shouldBeCached) {
		this.slidePages(backwards);
		// Cache if needed
		if (this.shouldCache) {
			this.saveCurrentPageToCache();
			this.shouldCache = null;
		}
		// BACKWARD
		if (backwards) { 
			currentHash = location.hash;
			pageHistory.splice(pageHistory.indexOf(target)+1, pageHistory.length);
		}
		// FORWARD
		else {
   			pageHistory.push(target);								
			if (shouldBeCached && !cachedPages[escape(target.href)]) {
				this.shouldCache = target.href;			
			}
		}

		this.updatePage(target);				
	},
	
	loadMore: function(target) {
		target.className = "load_more_loading";
		(new this.ajax(target.href, updatePage)).run();
		
		function updatePage(content) {
			target.parentNode.removeChild(target);
			pages[currentPage].innerHTML += content;
			ciUI.adjustBodyToEl(pages[currentPage]);
		}
	},
	
	updatePage: function(target) {
		var nextHash = hashPrefix + (pageHistory.length);
		backButtonEl.style.display = (pageIndexFromHash(nextHash) == 0 || !target) ? "none" : "block";
		// Update body with new page content
		if (pageIndexFromHash(nextHash) == 0 || !target) {
			pageTitleEl.innerHTML = trim(document.title);
			this.updatePageContent(pages[0].innerHTML); // page[0] is home, no need for AJAX
		}
		else if ((idx = cachedPages[escape(target.href)]) != null) {
			backButtonTextEl.innerHTML = (pageHistory[pageHistory.length-2]) ? trim(pageHistory[pageHistory.length-2].title, 15) : "Back";
			pageTitleEl.innerHTML = trim(target.title);
			this.updatePageContent($(cachedPagePrefix + idx).innerHTML);			
		}			
		else {
			backButtonTextEl.innerHTML = (pageHistory[pageHistory.length-2]) ? trim(pageHistory[pageHistory.length-2].title, 15) : "Back";
			pageTitleEl.innerHTML = trim(target.title);			
			var url = target.href;
			if (!url && target.tagName.toLowerCase() == "form") url = target.action+"?"+target.toQueryString();
			(new this.ajax(url, this.updatePageContent)).run();
		}
	},
	
	saveCurrentPageToCache: function() {
		var page = document.createElement("div");
		page.style.display = "none";
		page.innerHTML = pages[currentPage].innerHTML;
		page.id = cachedPagePrefix + cacheCounter;
		cachedPages[escape(this.shouldCache)] = cacheCounter++;
		document.body.appendChild(page);	
	},
	
	updatePageContent: function(content) {
		var updateTimer = setInterval(update, 0);
			
		function update() {
			if (!ciUI.animating) {
				$("__scroll_top__").name = currentHashName(true);
				pages[currentPage].innerHTML = content;
				pages[-currentPage].innerHTML = "";
				clearInterval(updateTimer);								
				ciUI.adjustBodyToEl(pages[currentPage]);				
				location.href = currentHash = currentHashName();
				if (ciUI.callbackFunct) ciUI.callbackFunct();
			}			
		}		
	},
	
	slidePages: function(backwards) {
		this.animating = true;
		
		var fromPage = pages[currentPage];
		var toPage = pages[-currentPage];
		var progress = 100;
		
		toPage.innerHTML = this.loadingPage();
		toPage.style.display = "block";
		
		if (!backwards) toPage.style.left = "100%";
		
		clearInterval(navigationChangeTimer); // pause the history daemon during animation.
		setTimeout(scrollTo, 100, 0, 1);
		var animTimer = setInterval(animate, 0);
		
		function animate() {
			progress -= animSpeed;
			
			if (progress <= 0) {
				clearInterval(animTimer);				
				navigationChangeTimer = setInterval(navigationChangeAgent, navigationCheckInterval); // restart the history daemon
				currentPage *= -1;
				progress = 0;
				ciUI.animating = false;
			}			
			fromPage.style.left = (backwards ? (100 - progress) : (progress - 100)) + "%";
			toPage.style.left = (backwards ? -progress : progress) + "%";
		}
	},
	
	ajax: function(sourceURL, responseConsumer, responseType) {
		this.run = function()
		{
			if (httpRequest != null) {				
				httpRequest.abort();
				httpRequest = null;
			}				

			if (responseType === undefined) responseType = "TEXT";
			responseType = responseType.toUpperCase();
			
			if (window.XMLHttpRequest) { 
				httpRequest = new XMLHttpRequest();
				if (httpRequest.overrideMimeType) {
					httpRequest.overrideMimeType('text/xml');
				}
			} 
			else if (window.ActiveXObject) { 
				try {
					httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
				} 
				catch (e) {
					try {
						httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
					} 
					catch (e) {}
				}
			}
			
			if (!httpRequest) {
				//console.log('Giving up, cannot create an XMLHTTP instance');
				return false;
			}
	
		
			httpRequest.open('GET', sourceURL, true);
			httpRequest.onreadystatechange = getResponse;
			httpRequest.send(null);	
		};
		
		function getResponse() {	
			if (httpRequest.readyState == 4)
				if (httpRequest.status == 200) {
					if (responseType == "XML")
						responseConsumer(httpRequest.responseXML);
					else
						responseConsumer(httpRequest.responseText);
					httpRequest = null;
				}
				else
					;//console.log("There was a problem with the request: " + sourceUrl);
		}
	},
	
	update: function(url, element) {	
		(new this.ajax(url, function(html){
			if (!element.tagName) element = $(element);
			element.innerHTML = html;
		})).run();
	},
		
	cancel: function(event) {
		history.back();
		event.preventDefault();
		return false;
	},
	
	loadingPage: function() {
		return $("iphone_loading_page").innerHTML;
	},
	
	// a dirty hack to move the footer to proper location since iphone_body doesn't expand with content
	adjustBodyToEl: function(el) {
		bodyEl.style.height = el.offsetHeight + "px";
	}	
};

addEventListener("load", function(event) {
	uiIsActive = ciUI.initialize();
	if (uiIsActive) navigationChangeTimer = setInterval(navigationChangeAgent, navigationCheckInterval);
}, false);

addEventListener("click", function(event) {
	if (!uiIsActive) return;
	var a = findParent(event.target, "a");
	// We don't want to prevent defaults by default because there may be actual hrefs going to outside pages
	var shouldCachePage = a.hasClass(cachePage);
	if (a && a.hasClass(buttonForward)) {
		ciUI.goToPage(a, false, shouldCachePage);
		event.preventDefault();
	} else if (a && a.hasClass(buttonBackward)) {
		history.back();	
		event.preventDefault();
	} else if (a && a.hasClass(buttonLoadMore)) {
		ciUI.loadMore(a);
		event.preventDefault();	
	}	
}, true);

addEventListener("submit", function(event) {
	if (!uiIsActive) return;
	var a;
	var form = findParent(event.target, "form");
	if (!form) return;
	if (form.hasClass(buttonForward)) {	
		event.preventDefault();
		return ciUI.goToPage(form, false);
	} else if (form.hasClass(update)) {
		event.preventDefault();
		ciUI.update(form.action+"?"+form.toQueryString(), form.getAttribute(updateAttr));
		}
}, true);

addEventListener("click", function(event) {
	if (!uiIsActive) return;
	var a = findParent(event.target, ("a"));
	if (!a || !a.hasClass(update)) return;
	ciUI.update(a.href, a.getAttribute(updateAttr));
}, true);

function trim(text, maxLength) {
	if (maxLength === undefined) maxLength = 20;
	return (text.length > maxLength) ? text.substring(0, maxLength - 3) + "..." : text;
};

function currentHashName(ommitHashSymbol) {
	return (ommitHashSymbol) ? hashPrefix.substr(1, hashPrefix.length) + (pageHistory.length) : hashPrefix + (pageHistory.length);
};

function navigationChangeAgent() {
	if (currentHash != location.hash) {
		ciUI.goToPage(pageHistory[pageHistory.length-2], true);
	}
};

function pageIndexFromHash(hash) {
	return (hash) ? hash.substr(hash.lastIndexOf("_") + 1, hash.length) : 0;
};

Element.prototype.hasClass = function(name) {
	return this.className.indexOf(name) != -1;
};

Element.prototype.toQueryString = function(){
	var qs = "";
	var getvals = function(element){
		var kids = element.childNodes;
		for (var i=0; i < kids.length; i++) {
			var el = kids[i];
			if (el.tagName) {
				var t = el.tagName.toLowerCase();
				if (t.toLowerCase() == "input" && el.getAttribute("type") == "checkbox" && !el.checked) {
					qs += el.name + "=" + 0  + "&";
					continue;
				}
				if (t.toLowerCase() == "input" || t.toLowerCase() == "textarea") qs += el.name + "=" + escape(el.value) + "&";
				else if (t == "select") qs += el.name + "=" + escape(el.options[el.selectedIndex].value) + "&"; //no support for multiselect yet
				else getvals(el);
			}
		}
	};
	getvals(this);
	return qs;
}

// This function is courtesy of iUI
function findParent(node, localName) {
    while (node && (node.nodeType != 1 || node.localName.toLowerCase() != localName))
        node = node.parentNode;
    return node;
};

function $(id) { return document.getElementById(id); };

})();
/**
 * Observer - Observe formelements for changes
 *
 * @version		1.0rc3
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */
var Observer = new Class({

	Implements: [Options, Events],

	options: {
		periodical: false,
		delay: 1000
	},

	initialize: function(el, onFired, options){
		this.setOptions(options);
		this.addEvent('onFired', onFired);
		this.element = $(el) || $$(el);
		/* Clientcide change */
		this.boundChange = this.changed.bind(this);
		this.resume();
	},

	changed: function() {
		var value = this.element.get('value');
		if ($equals(this.value, value)) return;
		this.clear();
		this.value = value;
		this.timeout = this.onFired.delay(this.options.delay, this);
	},

	setValue: function(value) {
		this.value = value;
		this.element.set('value', value);
		return this.clear();
	},

	onFired: function() {
		this.fireEvent('onFired', [this.value, this.element]);
	},

	clear: function() {
		$clear(this.timeout || null);
		return this;
	},
	/* Clientcide change */
	pause: function(){
		$clear(this.timeout);
		$clear(this.timer);
		this.element.removeEvent('keyup', this.boundChange);
		return this;
	},
	resume: function(){
		this.value = this.element.get('value');
		if (this.options.periodical) this.timer = this.changed.periodical(this.options.periodical, this);
		else this.element.addEvent('keyup', this.boundChange);
		return this;
	}

});

var $equals = function(obj1, obj2) {
	return (obj1 == obj2 || JSON.encode(obj1) == JSON.encode(obj2));
};
/**
 * Autocompleter
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
var Autocompleter = {};

var OverlayFix = IframeShim;

Autocompleter.Base = new Class({
	
	Implements: [Options, Events],
	
	options: {
		minLength: 1,
		markQuery: true,
		width: 'inherit',
		maxChoices: 10,
//		injectChoice: null,
//		customChoices: null,
		className: 'autocompleter-choices',
		zIndex: 42,
		delay: 400,
		observerOptions: {},
		fxOptions: {},
//		onSelection: $empty,
//		onShow: $empty,
//		onHide: $empty,
//		onBlur: $empty,
//		onFocus: $empty,

		autoSubmit: false,
		overflow: false,
		overflowMargin: 25,
		selectFirst: false,
		filter: null,
		filterCase: false,
		filterSubset: false,
		forceSelect: false,
		selectMode: true,
		choicesMatch: null,

		multiple: false,
		separator: ', ',
		separatorSplit: /\s*[,;]\s*/,
		autoTrim: true,
		allowDupes: false,

		cache: true,
		relative: false
	},

	initialize: function(element, options) {
		this.element = $(element);
		this.setOptions(options);
		this.build();
		this.observer = new Observer(this.element, this.prefetch.bind(this), $merge({
			'delay': this.options.delay
		}, this.options.observerOptions));
		this.queryValue = null;
		if (this.options.filter) this.filter = this.options.filter.bind(this);
		var mode = this.options.selectMode;
		this.typeAhead = (mode == 'type-ahead');
		this.selectMode = (mode === true) ? 'selection' : mode;
		this.cached = [];
	},

	/**
	 * build - Initialize DOM
	 *
	 * Builds the html structure for choices and appends the events to the element.
	 * Override this function to modify the html generation.
	 */
	build: function() {
		if ($(this.options.customChoices)) {
			this.choices = this.options.customChoices;
		} else {
			this.choices = new Element('ul', {
				'class': this.options.className,
				'styles': {
					'zIndex': this.options.zIndex
				}
			}).inject(document.body);
			this.relative = false;
			if (this.options.relative || this.element.getOffsetParent() != document.body) {
				this.choices.inject(this.element, 'after');
				this.relative = this.element.getOffsetParent();
			}
			this.fix = new OverlayFix(this.choices);
		}
		if (!this.options.separator.test(this.options.separatorSplit)) {
			this.options.separatorSplit = this.options.separator;
		}
		this.fx = (!this.options.fxOptions) ? null : new Fx.Tween(this.choices, $merge({
			'property': 'opacity',
			'link': 'cancel',
			'duration': 200
		}, this.options.fxOptions)).addEvent('onStart', Chain.prototype.clearChain).set(0);
		this.element.setProperty('autocomplete', 'off')
			.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress', this.onCommand.bind(this))
			.addEvent('click', this.onCommand.bind(this, [false]))
			.addEvent('focus', this.toggleFocus.create({bind: this, arguments: true, delay: 100}));
			//.addEvent('blur', this.toggleFocus.create({bind: this, arguments: false, delay: 100}));
		document.addEvent('click', function(e){
			if (e.target != this.choices) this.toggleFocus(false);
		}.bind(this));
	},

	destroy: function() {
		if (this.fix) this.fix.dispose();
		this.choices = this.selected = this.choices.destroy();
	},

	toggleFocus: function(state) {
		this.focussed = state;
		if (!state) this.hideChoices(true);
		this.fireEvent((state) ? 'onFocus' : 'onBlur', [this.element]);
	},

	onCommand: function(e) {
		if (!e && this.focussed) return this.prefetch();
		if (e && e.key && !e.shift) {
			switch (e.key) {
				case 'enter':
					if (this.element.value != this.opted) return true;
					if (this.selected && this.visible) {
						this.choiceSelect(this.selected);
						return !!(this.options.autoSubmit);
					}
					break;
				case 'up': case 'down':
					if (!this.prefetch() && this.queryValue !== null) {
						var up = (e.key == 'up');
						this.choiceOver((this.selected || this.choices)[
							(this.selected) ? ((up) ? 'getPrevious' : 'getNext') : ((up) ? 'getLast' : 'getFirst')
						](this.options.choicesMatch), true);
					}
					return false;
				case 'esc': case 'tab':
					this.hideChoices(true);
					break;
			}
		}
		return true;
	},

	setSelection: function(finish) {
		var input = this.selected.inputValue, value = input;
		var start = this.queryValue.length, end = input.length;
		if (input.substr(0, start).toLowerCase() != this.queryValue.toLowerCase()) start = 0;
		if (this.options.multiple) {
			var split = this.options.separatorSplit;
			value = this.element.value;
			start += this.queryIndex;
			end += this.queryIndex;
			var old = value.substr(this.queryIndex).split(split, 1)[0];
			value = value.substr(0, this.queryIndex) + input + value.substr(this.queryIndex + old.length);
			if (finish) {
				var space = /[^\s,]+/;
				var tokens = value.split(this.options.separatorSplit).filter(space.test, space);
				if (!this.options.allowDupes) tokens = [].combine(tokens);
				var sep = this.options.separator;
				value = tokens.join(sep) + sep;
				end = value.length;
			}
		}
		this.observer.setValue(value);
		this.opted = value;
		if (finish || this.selectMode == 'pick') start = end;
		this.element.selectRange(start, end);
		this.fireEvent('onSelection', [this.element, this.selected, value, input]);
	},

	showChoices: function() {
		var match = this.options.choicesMatch, first = this.choices.getFirst(match);
		this.selected = this.selectedValue = null;
		if (this.fix) {
			var pos = this.element.getCoordinates(this.relative), width = this.options.width || 'auto';
			this.choices.setStyles({
				'left': pos.left,
				'top': pos.bottom,
				'width': (width === true || width == 'inherit') ? pos.width : width
			});
		}
		if (!first) return;
		if (!this.visible) {
			this.visible = true;
			this.choices.setStyle('display', '');
			if (this.fx) this.fx.start(1);
			this.fireEvent('onShow', [this.element, this.choices]);
		}
		if (this.options.selectFirst || this.typeAhead || first.inputValue == this.queryValue) this.choiceOver(first, this.typeAhead);
		var items = this.choices.getChildren(match), max = this.options.maxChoices;
		var styles = {'overflowY': 'hidden', 'height': ''};
		this.overflown = false;
		if (items.length > max) {
			var item = items[max - 1];
			styles.overflowY = 'scroll';
			styles.height = item.getCoordinates(this.choices).bottom;
			this.overflown = true;
		};
		this.choices.setStyles(styles);
		this.fix.show();
	},

	hideChoices: function(clear) {
		if (clear) {
			var value = this.element.value;
			if (this.options.forceSelect) value = this.opted;
			if (this.options.autoTrim) {
				value = value.split(this.options.separatorSplit).filter($arguments(0)).join(this.options.separator);
			}
			this.observer.setValue(value);
		}
		if (!this.visible) return;
		this.visible = false;
		this.observer.clear();
		var hide = function(){
			this.choices.setStyle('display', 'none');
			this.fix.hide();
		}.bind(this);
		if (this.fx) this.fx.start(0).chain(hide);
		else hide();
		this.fireEvent('onHide', [this.element, this.choices]);
	},

	prefetch: function() {
		var value = this.element.value, query = value;
		if (this.options.multiple) {
			var split = this.options.separatorSplit;
			var values = value.split(split);
			var index = this.element.getCaretPosition();
			var toIndex = value.substr(0, index).split(split);
			var last = toIndex.length - 1;
			index -= toIndex[last].length;
			query = values[last];
		}
		if (query.length < this.options.minLength) {
			this.hideChoices();
		} else {
			if (query === this.queryValue || (this.visible && query == this.selectedValue)) {
				if (this.visible) return false;
				this.showChoices();
			} else {
				this.queryValue = query;
				this.queryIndex = index;
				if (!this.fetchCached()) this.query();
			}
		}
		return true;
	},

	fetchCached: function() {
		return false;
		if (!this.options.cache
			|| !this.cached
			|| !this.cached.length
			|| this.cached.length >= this.options.maxChoices
			|| this.queryValue) return false;
		this.update(this.filter(this.cached));
		return true;
	},

	update: function(tokens) {
		this.choices.empty();
		this.cached = tokens;
		if (!tokens || !tokens.length) {
			this.hideChoices();
		} else {
			if (this.options.maxChoices < tokens.length && !this.options.overflow) tokens.length = this.options.maxChoices;
			tokens.each(this.options.injectChoice || function(token){
				var choice = new Element('li', {'html': this.markQueryValue(token)});
				choice.inputValue = token;
				this.addChoiceEvents(choice).inject(this.choices);
			}, this);
			this.showChoices();
		}
	},

	choiceOver: function(choice, selection) {
		if (!choice || choice == this.selected) return;
		if (this.selected) this.selected.removeClass('autocompleter-selected');
		this.selected = choice.addClass('autocompleter-selected');
		this.fireEvent('onSelect', [this.element, this.selected, selection]);
		if (!selection) return;
		this.selectedValue = this.selected.inputValue;
		if (this.overflown) {
			var coords = this.selected.getCoordinates(this.choices), margin = this.options.overflowMargin,
				top = this.choices.scrollTop, height = this.choices.offsetHeight, bottom = top + height;
			if (coords.top - margin < top && top) this.choices.scrollTop = Math.max(coords.top - margin, 0);
			else if (coords.bottom + margin > bottom) this.choices.scrollTop = Math.min(coords.bottom - height + margin, bottom);
		}
		if (this.selectMode) this.setSelection();
	},

	choiceSelect: function(choice) {
		if (choice) this.choiceOver(choice);
		this.setSelection(true);
		this.queryValue = false;
		this.hideChoices();
	},

	filter: function(tokens) {
		var regex = new RegExp(((this.options.filterSubset) ? '' : '^') + this.queryValue.escapeRegExp(), (this.options.filterCase) ? '' : 'i');
		return (tokens || this.tokens).filter(regex.test, regex);
	},

	/**
	 * markQueryValue
	 *
	 * Marks the queried word in the given string with <span class="autocompleter-queried">*</span>
	 * Call this i.e. from your custom parseChoices, same for addChoiceEvents
	 *
	 * @param		{String} Text
	 * @return		{String} Text
	 */
	markQueryValue: function(str) {
		return (!this.options.markQuery || !this.queryValue) ? str
			: str.replace(new RegExp('(' + ((this.options.filterSubset) ? '' : '^') + this.queryValue.escapeRegExp() + ')', (this.options.filterCase) ? '' : 'i'), '<span class="autocompleter-queried">$1</span>');
	},

	/**
	 * addChoiceEvents
	 *
	 * Appends the needed event handlers for a choice-entry to the given element.
	 *
	 * @param		{Element} Choice entry
	 * @return		{Element} Choice entry
	 */
	addChoiceEvents: function(el) {
		return el.addEvents({
			'mouseover': this.choiceOver.bind(this, [el]),
			'click': this.choiceSelect.bind(this, [el])
		});
	}
});

/**
 * Autocompleter.Local
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
Autocompleter.Local = new Class({

	Extends: Autocompleter.Base,

	options: {
		minLength: 0,
		delay: 200
	},

	initialize: function(element, tokens, options) {
		this.parent(element, options);
		this.tokens = tokens;
	},

	query: function() {
		this.update(this.filter());
	}

});

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
		var indicator = $(this.options.indicator);
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

/*
Script: AutoCompleter.Clientcide.js
	Adds Clientcide css assets to autocompleter automatically.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	Autocompleter.Base = Class.refactor(Autocompleter.Base, {
		options: {
			baseHref: 'http://www.cnet.com/html/rb/assets/global/autocompleter/'
		},
		initialize: function(a1,a2,a3) {
			this.previous(a1,a2,a3);
			this.writeStyle();
		},
		writeStyle: function(){
			window.addEvent('domready', function(){
				if ($('AutocompleterCss')) return;
				new Element('link', {
					rel: 'stylesheet', 
					media: 'screen', 
					type: 'text/css', 
					href: this.options.baseHref+'Autocompleter.css', 
					id: 'AutocompleterCss'
				}).inject(document.head);
			}.bind(this));
		}
	});
})();

/*
Script: Autocompleter.JSONP.js
	Implements Request.JSONP support for the Autocompleter class.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Autocompleter.JSONP = new Class({

	Extends: Autocompleter.Ajax.Json,

	options: {
		postVar: 'query',
		jsonpOptions: {},
//		onRequest: $empty,
//		onComplete: $empty,
//		filterResponse: $empty
		minLength: 1
	},

	initialize: function(el, url, options) {
		this.url = url;
		this.setOptions(options);
		this.parent(el, options);
	},

	query: function(){
		var data = $unlink(this.options.jsonpOptions.data||{});
		data[this.options.postVar] = this.queryValue;
		this.jsonp = new Request.JSONP($merge({url: this.url, data: data},	this.options.jsonpOptions));
		this.jsonp.addEvent('onComplete', this.queryResponse.bind(this));
		this.fireEvent('onRequest', [this.element, this.jsonp, data, this.queryValue]);
		this.jsonp.send();
	},
	
	queryResponse: function(response) {
		this.parent();
		var data = (this.options.filter)?this.options.filter.run([response], this):response;
		this.update(data);
	}

});
Autocompleter.JsonP = Autocompleter.JSONP;
/*
Script: modalizer.js
	Defines Modalizer: functionality to overlay the window contents with a semi-transparent layer that prevents interaction with page content until it is removed

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Modalizer = new Class({
	defaultModalStyle: {
		display:'block',
		position:'fixed',
		top:0,
		left:0,	
		'z-index':5000,
		'background-color':'#333',
		opacity:0.8
	},
	setModalOptions: function(options){
		this.modalOptions = $merge({
			width:(window.getScrollSize().x),
			height:(window.getScrollSize().y),
			elementsToHide: 'select, embed, object',
			hideOnClick: true,
			modalStyle: {},
			updateOnResize: true,
			layerId: 'modalOverlay',
			onModalHide: $empty,
			onModalShow: $empty
		}, this.modalOptions, options);
		return this;
	},
	layer: function(){
		if (!this.modalOptions.layerId) this.setModalOptions();
		return $(this.modalOptions.layerId) || new Element('div', {id: this.modalOptions.layerId}).inject(document.body);
	},
	resize: function(){
		if (this.layer()) {
			this.layer().setStyles({
				width:(window.getScrollSize().x),
				height:(window.getScrollSize().y)
			});
		}
	},
	setModalStyle: function (styleObject){
		this.modalOptions.modalStyle = styleObject;
		this.modalStyle = $merge(this.defaultModalStyle, {
			width:this.modalOptions.width,
			height:this.modalOptions.height
		}, styleObject);
		if (this.layer()) this.layer().setStyles(this.modalStyle);
		return(this.modalStyle);
	},
	modalShow: function(options){
		this.setModalOptions(options);
		this.layer().setStyles(this.setModalStyle(this.modalOptions.modalStyle));
		if (Browser.Engine.trident4) this.layer().setStyle('position','absolute');
		this.layer().removeEvents('click').addEvent('click', function(){
			this.modalHide(this.modalOptions.hideOnClick);
		}.bind(this));
		this.bound = this.bound||{};
		if (!this.bound.resize && this.modalOptions.updateOnResize) {
			this.bound.resize = this.resize.bind(this);
			window.addEvent('resize', this.bound.resize);
		}
		if ($type(this.modalOptions.onModalShow)  == "function") this.modalOptions.onModalShow();
		this.togglePopThroughElements(0);
		this.layer().setStyle('display','block');
		return this;
	},
	modalHide: function(override, force){
		if (override === false) return false; //this is internal, you don't need to pass in an argument
		this.togglePopThroughElements(1);
		if ($type(this.modalOptions.onModalHide) == "function") this.modalOptions.onModalHide();
		this.layer().setStyle('display','none');
		if (this.modalOptions.updateOnResize) {
			this.bound = this.bound||{};
			if (!this.bound.resize) this.bound.resize = this.resize.bind(this);
			window.removeEvent('resize', this.bound.resize);
		}
		return this;
	},
	togglePopThroughElements: function(opacity){
		if (Browser.Engine.trident4 || (Browser.Engine.gecko && Browser.Platform.mac)) {
			$$(this.modalOptions.elementsToHide).each(function(sel){
				sel.setStyle('opacity', opacity);
			});
		}
	}
});
/*
Script: Lightbox.js
	A lightbox clone for MooTools.

* Christophe Beyls (http://www.digitalia.be); MIT-style license.
* Inspired by the original Lightbox v2 by Lokesh Dhakar: http://www.huddletogether.com/projects/lightbox2/.
* Refactored by Aaron Newton 

*/
var Lightbox = new Class({
	Implements: [Options, Events, Modalizer],
	Binds: ['click', 'keyboardListener', 'addHtmlElements'],
	options: {
//	anchors: null,
		resizeDuration: 400,
//	resizeTransition: false,	// default transition
		initialWidth: 250,
		initialHeight: 250,
		zIndex: 5000,
		animateCaption: true,
		showCounter: true,
		autoScanLinks: true,
		relString: 'lightbox',
		useDefaultCss: true,
		assetBaseUrl: 'http://www.cnet.com/html/rb/assets/global/slimbox/',
		overlayStyles: {
			opacity: 0.8
		}
//	onImageShow: $empty,
//	onDisplay: $empty,
//	onHide: $empty
	},

	initialize: function(){
		var args = Array.link(arguments, {options: Object.type, links: Array.type});
		this.setOptions(args.options);
		var anchors = args.links || this.options.anchors;
		if (this.options.autoScanLinks && !anchors) anchors = $$('a[rel^='+this.options.relString+']');
		if (!$$(anchors).length) return; //no links!
		this.addAnchors(anchors);
		if (this.options.useDefaultCss) this.addCss();
		window.addEvent('domready', this.addHtmlElements.bind(this));
	},
		
	anchors: [],
	
	addAnchors: function(anchors){
		$$(anchors).each(function(el){
			if (!el.retrieve('lightbox')) {
				el.store('lightbox', this);
				this.attach(el);
			}
		}.bind(this));
	},
	
	attach: function(el) {		
		el.addEvent('click', this.click.pass(el, this));
		this.anchors.include(el);
	},

	addHtmlElements: function(){
		this.container = new Element('div', {
			'class':'lbContainer'
		}).inject(document.body);
		this.setModalOptions();
		this.overlay = this.layer().addClass('lbOverlay');
		this.setModalStyle($merge(this.options.overlayStyles, {
				opacity: 0
			})
		);
		this.popup = new Element('div', {
			'class':'lbPopup'
		}).inject(this.container);
		this.overlay.inject(this.popup);
		this.center = new Element('div', {
			styles: {	
				width: this.options.initialWidth, 
				height: this.options.initialHeight, 
				marginLeft: (-(this.options.initialWidth/2)),
				display: 'none',
				zIndex:this.options.zIndex+1
			}
		}).inject(this.popup).addClass('lbCenter');
		this.image = new Element('div', {
			'class': 'lbImage'
		}).inject(this.center);
		
		this.prevLink = new Element('a', {
			'class': 'lbPrevLink', 
			href: 'javascript:void(0);', 
			styles: {'display': 'none'}
		}).inject(this.image);
		this.nextLink = this.prevLink.clone().removeClass('lbPrevLink').addClass('lbNextLink').inject(this.image);
		this.prevLink.addEvent('click', this.previous.bind(this));
		this.nextLink.addEvent('click', this.next.bind(this));

		this.bottomContainer = new Element('div', {
			'class': 'lbBottomContainer', 
			styles: {
				display: 'none', 
				zIndex:this.options.zIndex+1
		}}).inject(this.popup);
		this.bottom = new Element('div', {'class': 'lbBottom'}).inject(this.bottomContainer);
		new Element('a', {
			'class': 'lbCloseLink', 
			href: 'javascript:void(0);'
		}).inject(this.bottom).addEvent('click', this.close.bind(this));
		this.overlay.addEvent('click', this.close.bind(this));
		this.caption = new Element('div', {'class': 'lbCaption'}).inject(this.bottom);
		this.number = new Element('div', {'class': 'lbNumber'}).inject(this.bottom);
		new Element('div', {'styles': {'clear': 'both'}}).inject(this.bottom);
		var nextEffect = this.nextEffect.bind(this);
		this.fx = {
			overlay: new Fx.Tween(this.overlay, {property: 'opacity', duration: 500}).set(0),
			resize: new Fx.Morph(this.center, $extend({
				duration: this.options.resizeDuration, 
				onComplete: nextEffect}, 
				this.options.resizeTransition ? {transition: this.options.resizeTransition} : {})),
			image: new Fx.Tween(this.image, {property: 'opacity', duration: 500, onComplete: nextEffect}),
			bottom: new Fx.Tween(this.bottom, {property: 'margin-top', duration: 400, onComplete: nextEffect})
		};

		this.preloadPrev = new Element('img');
		this.preloadNext = new Element('img');
	},
	
	addCss: function(){
		window.addEvent('domready', function(){
			if ($('LightboxCss')) return;
			new Element('link', {
				rel: 'stylesheet', 
				media: 'screen', 
				type: 'text/css', 
				href: this.options.assetBaseUrl + 'slimbox.css',
				id: 'LightboxCss'
			}).inject(document.head);
		}.bind(this));
	},

	click: function(el){
		link = $(el);
		var rel = link.get('rel')||this.options.relString;
		if (rel == this.options.relString) return this.show(link.get('href'), link.get('title'));

		var j, imageNum, images = [];
		this.anchors.each(function(el){
			if (el.get('rel') == link.get('rel')){
				for (j = 0; j < images.length; j++) if (images[j][0] == el.get('href')) break;
				if (j == images.length){
					images.push([el.get('href'), el.get('title')]);
					if (el.get('href') == link.get('href')) imageNum = j;
				}
			}
		}, this);
		return this.open(images, imageNum);
	},

	show: function(url, title){
		return this.open([[url, title]], 0);
	},

	open: function(images, imageNum){
		this.fireEvent('onDisplay');
		this.images = images;
		this.setup(true);
		this.top = (window.getScroll().y + (window.getSize().y / 15)).toInt();
		this.center.setStyles({
			top: this.top,
			display: ''
		});
		this.modalShow();
		this.fx.overlay.start(0, this.options.overlayStyles.opacity);
		return this.changeImage(imageNum);
	},

	setup: function(open){
		var elements = $$('object, iframe');
		elements.extend($$(Browser.Engine.trident ? 'select' : 'embed'));
		elements.reverse().each(function(el){
			if (open) el.store('lbBackupStyle', el.getStyle('visibility') || 'visible');
			var vis = (open ? 'hidden' : el.retrieve('lbBackupStyle') || 'visible');
			el.setStyle('visibility', vis);
		});
		var fn = open ? 'addEvent' : 'removeEvent';
		document[fn]('keydown', this.keyboardListener);
		this.step = 0;
	},

	keyboardListener: function(event){
		switch (event.code){
			case 27: case 88: case 67: this.close(); break;
			case 37: case 80: this.previous(); break;	
			case 39: case 78: this.next();
		}
	},

	previous: function(){
		return this.changeImage(this.activeImage-1);
	},

	next: function(){
		return this.changeImage(this.activeImage+1);
	},

	changeImage: function(imageNum){
		this.fireEvent('onImageShow', [imageNum, this.images[imageNum]]);
		if (this.step || (imageNum < 0) || (imageNum >= this.images.length)) return false;
		this.step = 1;
		this.activeImage = imageNum;

		this.center.setStyle('backgroundColor', '');
		this.bottomContainer.setStyle('display', 'none');
		this.prevLink.setStyle('display', 'none');
		this.nextLink.setStyle('display', 'none');
		this.fx.image.set(0);
		this.center.addClass('lbLoading');
		this.preload = new Element('img', {
			events: {
				load: function(){
					this.nextEffect.delay(100, this)
				}.bind(this)
			}
		});
		this.preload.set('src', this.images[imageNum][0]);
		return false;
	},

	nextEffect: function(){
		switch (this.step++){
		case 1:
			this.image.setStyle('backgroundImage', 'url('+this.images[this.activeImage][0]+')');
			this.image.setStyle('width', this.preload.width);
			this.bottom.setStyle('width',this.preload.width);
			this.image.setStyle('height', this.preload.height);
			this.prevLink.setStyle('height', this.preload.height);
			this.nextLink.setStyle('height', this.preload.height);

			this.caption.set('html',this.images[this.activeImage][1] || '');
			this.number.set('html',(!this.options.showCounter || (this.images.length == 1)) ? '' : 'Image '+(this.activeImage+1)+' of '+this.images.length);

			if (this.activeImage) $(this.preloadPrev).set('src', this.images[this.activeImage-1][0]);
			if (this.activeImage != (this.images.length - 1)) 
				$(this.preloadNext).set('src',  this.images[this.activeImage+1][0]);
			if (this.center.clientHeight != this.image.offsetHeight){
				this.fx.resize.start({height: this.image.offsetHeight});
				break;
			}
			this.step++;
		case 2:
			if (this.center.clientWidth != this.image.offsetWidth){
				this.fx.resize.start({width: this.image.offsetWidth, marginLeft: -this.image.offsetWidth/2});
				break;
			}
			this.step++;
		case 3:
			this.bottomContainer.setStyles({
				top: (this.top + this.center.getSize().y), 
				height: 0, 
				marginLeft: this.center.getStyle('margin-left'), 
				display: ''
			});
			this.fx.image.start(1);
			break;
		case 4:
			this.center.style.backgroundColor = '#000';
			if (this.options.animateCaption){
				this.fx.bottom.set(-this.bottom.offsetHeight);
				this.bottomContainer.setStyle('height', '');
				this.fx.bottom.start(0);
				break;
			}
			this.bottomContainer.style.height = '';
		case 5:
			if (this.activeImage) this.prevLink.setStyle('display', '');
			if (this.activeImage != (this.images.length - 1)) this.nextLink.setStyle('display', '');
			this.step = 0;
		}
	},

	close: function(){
		this.fireEvent('onHide');
		if (this.step < 0) return;
		this.step = -1;
		if (this.preload) this.preload.destroy();
		for (var f in this.fx) this.fx[f].cancel();
		this.center.setStyle('display', 'none');
		this.bottomContainer.setStyle('display', 'none');
		this.fx.overlay.chain(this.setup.pass(false, this)).start(0);
		return;
	}
});
window.addEvent('domready', function(){if ($(document.body).get('html').match(/rel=?.lightbox/i)) new Lightbox()});

/*
Script: Fx.Marquee.js
	Defines Fx.Marquee, a marquee class for animated notifications.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Fx.Marquee = new Class({
	Extends: Fx.Morph,
	options: {
		mode: 'horizontal', //or vertical
		message: '', //the message to display
		revert: true, //revert back to the previous message after a specified time
		delay: 5000, //how long to wait before reverting
		cssClass: 'msg', //the css class to apply to that message
		showEffect: { opacity: 1 },
		hideEffect: {opacity: 0},
		revertEffect: { opacity: [0,1] },
		currentMessage: null
/*	onRevert: $empty,
		onMessage: $empty */
	},
	initialize: function(container, options){
		container = $(container); 
		var msg = this.options.currentMessage || (container.getChildren().length == 1)?container.getFirst():''; 
		var wrapper = new Element('div', {	
				styles: { position: 'relative' },
				'class':'fxMarqueeWrapper'
			}).inject(container); 
		this.parent(wrapper, options);
		this.current = this.wrapMessage(msg);
	},
	wrapMessage: function(msg){
		if ($(msg) && $(msg).hasClass('fxMarquee')) { //already set up
			var wrapper = $(msg);
		} else {
			//create the wrapper
			var wrapper = new Element('span', {
				'class':'fxMarquee',
				styles: {
					position: 'relative'
				}
			});
			if ($(msg)) wrapper.grab($(msg)); //if the message is a dom element, inject it inside the wrapper
			else if ($type(msg) == "string") wrapper.set('html', msg); //else set it's value as the inner html
		}
		return wrapper.inject(this.element); //insert it into the container
	},
	announce: function(options) {
		this.setOptions(options).showMessage();
		return this;
	},
	showMessage: function(reverting){
		//delay the fuction if we're reverting
		(function(){
			//store a copy of the current chained functions
			var chain = this.$chain?$A(this.$chain):[];
			//clear teh chain
			this.clearChain();
			this.element = $(this.element);
			this.current = $(this.current);
			this.message = $(this.message);
			//execute the hide effect
			this.start(this.options.hideEffect).chain(function(){
				//if we're reverting, hide the message and show the original
				if (reverting) {
					this.message.hide();
					if (this.current) this.current.show();
				} else {
					//else we're showing; remove the current message
					if (this.message) this.message.dispose();
					//create a new one with the message supplied
					this.message = this.wrapMessage(this.options.message);
					//hide the current message
					if (this.current) this.current.hide();
				}
				//if we're reverting, execute the revert effect, else the show effect
				this.start((reverting)?this.options.revertEffect:this.options.showEffect).chain(function(){
					//merge the chains we set aside back into this.$chain
					if (this.$chain) this.$chain.combine(chain);
					else this.$chain = chain;
					this.fireEvent((reverting)?'onRevert':'onMessage');
					//then, if we're reverting, show the original message
					if (!reverting && this.options.revert) this.showMessage(true);
					//if we're done, call the chain stack
					else this.callChain.delay(this.options.delay, this);
				}.bind(this));
			}.bind(this));
		}).delay((reverting)?this.options.delay:10, this);
		return this;
	}
});
/*
Script: dbug.js
	A wrapper for Firebug console.* statements.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var dbug = {
	logged: [],	
	timers: {},
	firebug: false, 
	enabled: false, 
	log: function() {
		dbug.logged.push(arguments);
	},
	nolog: function(msg) {
		dbug.logged.push(arguments);
	},
	time: function(name){
		dbug.timers[name] = new Date().getTime();
	},
	timeEnd: function(name){
		if (dbug.timers[name]) {
			var end = new Date().getTime() - dbug.timers[name];
			dbug.timers[name] = false;
			dbug.log('%s: %s', name, end);
		} else dbug.log('no such timer: %s', name);
	},
	enable: function(silent) { 
		var con = window.firebug ? firebug.d.console.cmd : window.console;

		if((!!window.console && !!window.console.warn) || window.firebug) {
			try {
				dbug.enabled = true;
				dbug.log = function(){
						(con.debug || con.log).apply(con, arguments);
				};
				dbug.time = function(){
					con.time.apply(con, arguments);
				};
				dbug.timeEnd = function(){
					con.timeEnd.apply(con, arguments);
				};
				if(!silent) dbug.log('enabling dbug');
				for(var i=0;i<dbug.logged.length;i++){ dbug.log.apply(con, dbug.logged[i]); }
				dbug.logged=[];
			} catch(e) {
				dbug.enable.delay(400);
			}
		}
	},
	disable: function(){ 
		if(dbug.firebug) dbug.enabled = false;
		dbug.log = dbug.nolog;
		dbug.time = function(){};
		dbug.timeEnd = function(){};
	},
	cookie: function(set){
		var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
		var debugCookie = value ? unescape(value[1]) : false;
		if((!$defined(set) && debugCookie != 'true') || ($defined(set) && set)) {
			dbug.enable();
			dbug.log('setting debugging cookie');
			var date = new Date();
			date.setTime(date.getTime()+(24*60*60*1000));
			document.cookie = 'jsdebug=true;expires='+date.toGMTString()+';path=/;';
		} else dbug.disableCookie();
	},
	disableCookie: function(){
		dbug.log('disabling debugging cookie');
		document.cookie = 'jsdebug=false;path=/;';
	}
};

(function(){
	var fb = !!window.console || !!window.firebug;
	var con = window.firebug ? window.firebug.d.console.cmd : window.console;
	var debugMethods = ['debug','info','warn','error','assert','dir','dirxml'];
	var otherMethods = ['trace','group','groupEnd','profile','profileEnd','count'];
	function set(methodList, defaultFunction) {
		for(var i = 0; i < methodList.length; i++){
			dbug[methodList[i]] = (fb && con[methodList[i]])?con[methodList[i]]:defaultFunction;
		}
	};
	set(debugMethods, dbug.log);
	set(otherMethods, function(){});
})();
if ((!!window.console && !!window.console.warn) || window.firebug){
	dbug.firebug = true;
	var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
	var debugCookie = value ? unescape(value[1]) : false;
	if(window.location.href.indexOf("jsdebug=true")>0 || debugCookie=='true') dbug.enable();
	if(debugCookie=='true')dbug.log('debugging cookie enabled');
	if(window.location.href.indexOf("jsdebugCookie=true")>0){
		dbug.cookie();
		if(!dbug.enabled)dbug.enable();
	}
	if(window.location.href.indexOf("jsdebugCookie=false")>0)dbug.disableCookie();
}
/*
Script: StyleWriter.js

Provides a simple method for injecting a css style element into the DOM if it's not already present.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var StyleWriter = new Class({
	createStyle: function(css, id) {
		window.addEvent('domready', function(){
			try {
				if ($(id) && id) return;
				var style = new Element('style', {id: id||''}).inject($$('head')[0]);
				if (Browser.Engine.trident) style.styleSheet.cssText = css;
				else style.set('text', css);
			}catch(e){dbug.log('error: %s',e);}
		}.bind(this));
	}
});
/*
Script: StickyWin.js

Creates a div within the page with the specified contents at the location relative to the element you specify; basically an in-page popup maker.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var StickyWin = new Class({
	Binds: ['destroy', 'hide', 'togglepin'],
	Implements: [Options, Events, StyleWriter, Class.ToElement],
	options: {
//		onDisplay: $empty,
//		onClose: $empty,
		closeClassName: 'closeSticky',
		pinClassName: 'pinSticky',
		content: '',
		zIndex: 10000,
		className: '',
//		id: ... set above in initialize function
/*  	these are the defaults for Element.position anyway
		************************************************
		edge: false, //see Element.position
		position: 'center', //center, corner == upperLeft, upperRight, bottomLeft, bottomRight
		offset: {x:0,y:0},
		relativeTo: document.body, */
		width: false,
		height: false,
		timeout: -1,
		allowMultipleByClass: false,
		allowMultiple: true,
		showNow: true,
		useIframeShim: true,
		iframeShimSelector: '',
		destroyOnClose: false
	},
	initialize: function(options){
		this.options.inject = this.options.inject || {
			target: document.body,
			where: 'bottom' 
		};
		this.setOptions(options);
		this.id = this.options.id || 'StickyWin_'+new Date().getTime();
		this.makeWindow();

		if (this.options.content) this.setContent(this.options.content);
		if (this.options.timeout > 0) {
			this.addEvent('onDisplay', function(){
				this.hide.delay(this.options.timeout, this)
			}.bind(this));
		}
		if (this.options.showNow) this.show();
		//add css for clearfix
		this.createStyle(this.css, 'StickyWinClearFix');
		if (this.options.destroyOnClose) this.addEvent('close', this.destroy)
	},
	makeWindow: function(){
		this.destroyOthers();
		if (!$(this.id)) {
			this.win = new Element('div', {
				id:		this.id
			}).addClass(this.options.className).addClass('StickyWinInstance').addClass('SWclearfix').setStyles({
			 	display:'none',
				position:'absolute',
				zIndex:this.options.zIndex
			}).inject(this.options.inject.target, this.options.inject.where).store('StickyWin', this);			
		} else this.win = $(this.id);
		this.element = this.win;
		if (this.options.width && $type(this.options.width.toInt())=="number") this.win.setStyle('width', this.options.width.toInt());
		if (this.options.height && $type(this.options.height.toInt())=="number") this.win.setStyle('height', this.options.height.toInt());
		return this;
	},
	show: function(suppressEvent){
		this.showWin();
		if (!suppressEvent) this.fireEvent('onDisplay');
		if (this.options.useIframeShim) this.showIframeShim();
		this.visible = true;
		return this;
	},
	showWin: function(){
		if (!this.positioned) this.position();
		this.win.show();
	},
	hide: function(suppressEvent){
		if (!suppressEvent) this.fireEvent('onClose');
		this.hideWin();
		if (this.options.useIframeShim) this.hideIframeShim();
		this.visible = false;
		return this;
	},
	hideWin: function(){
		this.win.setStyle('display','none');
	},
	destroyOthers: function() {
		if (!this.options.allowMultipleByClass || !this.options.allowMultiple) {
			$$('div.StickyWinInstance').each(function(sw) {
				if (!this.options.allowMultiple || (!this.options.allowMultipleByClass && sw.hasClass(this.options.className))) 
					sw.retrieve('StickyWin').destroy();
			}, this);
		}
	},
	setContent: function(html) {
		if (this.win.getChildren().length>0) this.win.empty();
		if ($type(html) == "string") this.win.set('html', html);
		else if ($(html)) this.win.adopt(html);
		this.win.getElements('.'+this.options.closeClassName).each(function(el){
			el.addEvent('click', this.hide);
		}, this);
		this.win.getElements('.'+this.options.pinClassName).each(function(el){
			el.addEvent('click', this.togglepin);
		}, this);
		return this;
	},	
	position: function(options){
		this.positioned = true;
		this.setOptions(options);
		this.win.position({
			allowNegative: true,
			relativeTo: this.options.relativeTo,
			position: this.options.position,
			offset: this.options.offset,
			edge: this.options.edge
		});
		if (this.shim) this.shim.position();
		return this;
	},
	pin: function(pin) {
		if (!this.win.pin) {
			dbug.log('you must include element.pin.js!');
			return this;
		}
		this.pinned = $pick(pin, true);
		this.win.pin(pin);
		return this;
	},
	unpin: function(){
		return this.pin(false);
	},
	togglepin: function(){
		return this.pin(!this.pinned);
	},
	makeIframeShim: function(){
		if (!this.shim){
			var el = (this.options.iframeShimSelector)?this.win.getElement(this.options.iframeShimSelector):this.win;
			this.shim = new IframeShim(el, {
				display: false,
				name: 'StickyWinShim'
			});
		}
	},
	showIframeShim: function(){
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			this.shim.show();
		}
	},
	hideIframeShim: function(){
		if (this.shim) this.shim.hide();
	},
	destroy: function(){
		if (this.win) this.win.destroy();
		if (this.options.useIframeShim && this.shim) this.shim.destroy();
		if ($('modalOverlay'))$('modalOverlay').destroy();
	}
});

/*
Script: StickyWin.ui.js

Creates an html holder for in-page popups using a default style.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.UI = new Class({
	Implements: [Options, Class.ToElement, StyleWriter],
	options: {
		width: 300,
		css: "div.DefaultStickyWin div.body{font-family:verdana; font-size:11px; line-height: 13px;}"+
			"div.DefaultStickyWin div.top_ul{background:url({%baseHref%}full.png) top left no-repeat; height:30px; width:15px; float:left}"+
			"div.DefaultStickyWin div.top_ur{position:relative; left:0px !important; left:-4px; background:url({%baseHref%}full.png) top right !important; height:30px; margin:0px 0px 0px 15px !important; margin-right:-4px; padding:0px}"+
			"div.DefaultStickyWin h1.caption{clear: none !important; margin:0px !important; overflow: hidden; padding:0 !important; font-weight:bold; color:#555; font-size:14px !important; position:relative; top:8px !important; left:5px !important; float: left; height: 22px !important;}"+
			"div.DefaultStickyWin div.middle, div.DefaultStickyWin div.closeBody {background:url({%baseHref%}body.png) top left repeat-y; margin:0px 20px 0px 0px !important;	margin-bottom: -3px; position: relative;	top: 0px !important; top: -3px;}"+
			"div.DefaultStickyWin div.body{background:url({%baseHref%}body.png) top right repeat-y; padding:8px 30px 8px 0px !important; margin-left:5px !important; position:relative; right:-20px !important;}"+
			"div.DefaultStickyWin div.bottom{clear:both}"+
			"div.DefaultStickyWin div.bottom_ll{background:url({%baseHref%}full.png) bottom left no-repeat; width:15px; height:15px; float:left}"+
			"div.DefaultStickyWin div.bottom_lr{background:url({%baseHref%}full.png) bottom right; position:relative; left:0px !important; left:-4px; margin:0px 0px 0px 15px !important; margin-right:-4px; height:15px}"+
			"div.DefaultStickyWin div.closeButtons{text-align: center; background:url({%baseHref%}body.png) top right repeat-y; padding: 0px 30px 8px 0px; margin-left:5px; position:relative; right:-20px}"+
			"div.DefaultStickyWin a.button:hover{background:url({%baseHref%}big_button_over.gif) repeat-x}"+
			"div.DefaultStickyWin a.button {background:url({%baseHref%}big_button.gif) repeat-x; margin: 2px 8px 2px 8px; padding: 2px 12px; cursor:pointer; border: 1px solid #999 !important; text-decoration:none; color: #000 !important;}"+
			"div.DefaultStickyWin div.closeButton{width:13px; height:13px; background:url({%baseHref%}closebtn.gif) no-repeat; position: absolute; right: 0px; margin:10px 15px 0px 0px !important; cursor:pointer;top:0px}"+
			"div.DefaultStickyWin div.dragHandle {	width: 11px;	height: 25px;	position: relative;	top: 5px;	left: -3px;	cursor: move;	background: url({%baseHref%}drag_corner.gif); float: left;}",
		cornerHandle: false,
		cssClass: '',
		baseHref: 'http://www.cnet.com/html/rb/assets/global/stickyWinHTML/',
		buttons: [],
		cssId: 'defaultStickyWinStyle',
		cssClassName: 'DefaultStickyWin',
		closeButton: true
/*	These options are deprecated:
		closeTxt: false,
		onClose: $empty,
		confirmTxt: false,
		onConfirm: $empty	*/
	},
	initialize: function() {
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		this.legacy();
		var css = this.options.css.substitute({baseHref: this.options.baseHref}, /\\?\{%([^}]+)%\}/g);
		if (Browser.Engine.trident4) css = css.replace(/png/g, 'gif');
		this.createStyle(css, this.options.cssId);
		this.build();
		if (args.caption || args.body) this.setContent(args.caption, args.body);
	},
	getArgs: function(){
		return StickyWin.UI.getArgs.apply(this, arguments);
	},
	legacy: function(){
		var opt = this.options; //saving bytes
		//legacy support
		if (opt.confirmTxt) opt.buttons.push({text: opt.confirmTxt, onClick: opt.onConfirm || $empty});
		if (opt.closeTxt) opt.buttons.push({text: opt.closeTxt, onClick: opt.onClose || $empty});
	},
	build: function(){
		var opt = this.options;

		var container = new Element('div', {
			'class': opt.cssClassName
		});
		if (opt.width) container.setStyle('width', opt.width);
		this.element = container;
		this.element.store('StickyWinUI', this);
		if (opt.cssClass) container.addClass(opt.cssClass);
		

		var bodyDiv = new Element('div').addClass('body');
		this.body = bodyDiv;
		
		var top_ur = new Element('div').addClass('top_ur');
		this.top_ur = top_ur;
		this.top = new Element('div').addClass('top').adopt(
				new Element('div').addClass('top_ul')
			).adopt(top_ur);
		container.adopt(this.top);
		
		if (opt.cornerHandle) new Element('div').addClass('dragHandle').inject(top_ur, 'top');
		
		//body
		container.adopt(new Element('div').addClass('middle').adopt(bodyDiv));
		//close buttons
		if (opt.buttons.length > 0){
			var closeButtons = new Element('div').addClass('closeButtons');
			opt.buttons.each(function(button){
				if (button.properties && button.properties.className){
					button.properties['class'] = button.properties.className;
					delete button.properties.className;
				}
				var properties = $merge({'class': 'closeSticky'}, button.properties);
				new Element('a').addEvent('click', button.onClick || $empty)
					.appendText(button.text).inject(closeButtons).set(properties).addClass('button');
			});
			container.adopt(new Element('div').addClass('closeBody').adopt(closeButtons));
		}
		//footer
		container.adopt(
			new Element('div').addClass('bottom').adopt(
					new Element('div').addClass('bottom_ll')
				).adopt(
					new Element('div').addClass('bottom_lr')
			)
		);
		if (this.options.closeButton) container.adopt(new Element('div').addClass('closeButton').addClass('closeSticky'));
		return this;
	},
	makeCaption: function(caption) {
		if (!caption) return this.destroyCaption();
		this.caption = caption;
		var opt = this.options;
		var h1Caption = new Element('h1').addClass('caption');
		if (opt.width) h1Caption.setStyle('width', (opt.width-(opt.cornerHandle?55:40)-(opt.closeButton?10:0)));
		if ($(this.caption)) h1Caption.adopt(this.caption);
		else h1Caption.set('html', this.caption);
		this.top_ur.adopt(h1Caption);
		this.h1 = h1Caption;
		if (!this.options.cornerHandle) this.h1.addClass('dragHandle');
		return this;
	},
	destroyCaption: function(){
		if (this.h1) {
			this.h1.destroy();
			this.h1 = null;
		}
		return this;
	},
	setContent: function(){
		var args = this.getArgs.apply(this, arguments);
		var caption = args.caption;
		var body = args.body;
		if (this.h1) this.destroyCaption();
		this.makeCaption(caption);
		if ($(body)) this.body.empty().adopt(body);
		else this.body.set('html', body);
		return this;
	}
});
StickyWin.UI.getArgs = function(){
	var input = $type(arguments[0]) == "arguments"?arguments[0]:arguments;
	var cap = input[0], bod = input[1];
	var args = Array.link(input, {options: Object.type});
	if (input.length == 3 || (!args.options && input.length == 2)) {
		args.caption = cap;
		args.body = bod;
	} else if (($type(bod) == 'object' || !bod) && cap && $type(cap) != 'object'){
		args.body = cap;
	}
	return args;
};

StickyWin.ui = function(caption, body, options){
	return $(new StickyWin.UI(caption, body, options))
};

/*
Script: StickyWin.UI.Pointy.js

Creates an html holder for in-page popups using a default style - this one including a pointer in the specified direction.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.UI.Pointy = new Class({
	Extends: StickyWin.UI,
	options: {
		theme: 'dark',
		themes: {
			dark: {
				bgColor: '#333',
				fgColor: '#ddd',
				imgset: 'dark'
			},
			light: {
				bgColor: '#ccc',
				fgColor: '#333',
				imgset: 'light'
			}
		},
		css: "div.DefaultPointyTip {position: relative}"+
		"div.DefaultPointyTip .pointyWrapper div.body{background: {%bgColor%}; color: {%fgColor%}; left: 0px; right: 0px !important;padding:  0px 10px !important;margin-left: 0px !important;font-family: verdana;font-size: 11px;line-height: 13px;position: relative;}"+
		"div.DefaultPointyTip .pointyWrapper div.top {position: relative;height: 25px; overflow: visible}"+
		"div.DefaultPointyTip .pointyWrapper div.top_ul{background: url({%baseHref%}{%imgset%}_back.png) top left no-repeat;width: 8px;height: 25px; position: absolute; left: 0px;}"+
		"div.DefaultPointyTip .pointyWrapper div.top_ur{background: url({%baseHref%}{%imgset%}_back.png) top right !important;margin: 0 0 0 8px !important;height: 25px;position: relative;left: 0px !important;padding: 0;}"+
		"div.DefaultPointyTip .pointyWrapper h1.caption{color: {%fgColor%};left: 0px !important;top: 4px !important;clear: none !important;overflow: hidden;font-weight: 700;font-size: 12px !important;position: relative;float: left;height: 22px !important;margin: 0 !important;padding: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.middle, div.DefaultPointyTip .pointyWrapper div.closeBody{background:  {%bgColor%};margin: 0 0px 0 0 !important;position: relative;top: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.bottom {clear: both; width: 100% !important;} "+
		"div.DefaultPointyTip .pointyWrapper div.bottom_ll{font-size:1; background: url({%baseHref%}{%imgset%}_back.png) bottom left no-repeat;width: 6px;height: 6px;position: absolute; left: 0px;}"+
		"div.DefaultPointyTip .pointyWrapper div.bottom_lr{font-size:1; background: url({%baseHref%}{%imgset%}_back.png) bottom right;height: 6px;margin: 0 0 0 6px !important;position: relative;left: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.noCaption{height: 6px; overflow: hidden}"+
		"div.DefaultPointyTip .pointyWrapper div.closeButton{width:13px; height:13px; background:url({%baseHref%}{%imgset%}_x.png) no-repeat; position: absolute; right: 0px; margin:4px 0px 0px !important; cursor:pointer; z-index: 1; top: 0px;}",
		baseHref: 'http://cnetjavascript.googlecode.com/svn/trunk/Assets/PointyTip/',
		divot: '{%baseHref%}{%imgset%}_divot.png',
		divotSize: 22,
		direction: 12,
		cssId: 'defaultPointyTipStyle',
		cssClassName: 'DefaultPointyTip'
	},
	initialize: function() {
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		$extend(this.options, this.options.themes[this.options.theme]);
		this.options.css = this.options.css.substitute(this.options, /\\?\{%([^}]+)%\}/g);
		if (args.options && args.options.theme) {
			while (!this.id) {
				var id = $random(0, 999999999);
				if (!StickyWin.UI.Pointy[id]) {
					StickyWin.UI.Pointy[id] = this;
					this.id = id;
				}
			}
			this.options.css = this.options.css.replace(/div\.DefaultPointyTip/g, "div#pointy_"+this.id);
			this.options.cssId = "pointyTipStyle_" + this.id;
		}
		if ($type(this.options.direction) == 'string') {
			var map = {
				left: 9,
				right: 3,
				up: 12,
				down: 6
			};
			this.options.direction = map[this.options.direction];
		}
		this.options.divot = this.options.divot.substitute(this.options, /\\?\{%([^}]+)%\}/g);
		if (Browser.Engine.trident4) this.options.divot = this.options.divot.replace(/png/g, 'gif');
		
		this.parent(args.caption, args.body, this.options);
		if (this.id) $(this).set('id', "pointy_"+this.id);
	},
	build: function(){
		this.parent();
		var opt = this.options;
		this.pointyWrapper = new Element('div', {
			'class': 'pointyWrapper'
		}).inject($(this));
		$(this).getChildren().each(function(el){
			if (el != this.pointyWrapper) this.pointyWrapper.grab(el);
		}, this);

		var w = opt.divotSize;
		var h = w;
		var left = (opt.width - opt.divotSize)/2;
		var orient = function(){
			switch(opt.direction) {
				case 12: case 1: case 11:
					return {
						height: h/2
					};
				case 5: case 6: case 7:
					return {
						height: h/2,
						backgroundPosition: '0 -'+h/2+'px'
					};
				case 8: case 9: case 10:
					return {
						width: w/2
					};
				case 2: case 3: case 4:
					return {
						width: w/2,
						backgroundPosition: '100%'
					};
			};
		};
		this.pointer = new Element('div', {
			styles: $extend({
				background: "url("+opt.divot+") no-repeat",
				width: w,
				height: h,
				overflow: 'hidden'
			}, orient()),
			'class': 'pointyDivot pointy_'+opt.direction
		}).inject(this.pointyWrapper);
	},
	expose: function(){
		if ($(this).getStyle('display') != 'none' && $(document.body).hasChild($(this))) return $empty;
		$(this).setStyles({
			visibility: 'hidden',
			position: 'absolute'
		});
		var dispose;
		if (!document.body.hasChild($(this))) {
			$(this).inject(document.body);
			dispose = true;
		}
		return (function(){
			if (dispose) $(this).dispose();
			$(this).setStyles({
				visibility: 'visible',
				position: 'relative'
			});
		}).bind(this);
	},
	positionPointer: function(options){
		if (!this.pointer) return;
		var opt = options || this.options;
		var pos;
		var d = opt.direction;
		switch (d){
			case 12: case 1: case 11:
				pos = {
					edge: {x: 'center', y: 'bottom'},
					position: {
						x: d==12?'center':d==1?'right':'left', 
						y: 'top'
					},
					offset: {
						x: (d==12?0:d==1?-1:1)*opt.divotSize,
						y: 1
					}
				};
				break;
			case 2: case 3: case 4:
				pos = {
					edge: {x: 'left', y: 'center'},
					position: {
						x: 'right', 
						y: d==3?'center':d==2?'top':'bottom'
					},
					offset: {
						x: -1,
						y: (d==3?0:d==4?-1:1)*opt.divotSize
					}
				};
				break;
			case 5: case 6: case 7:
				pos = {
					edge: {x: 'center', y: 'top'},
					position: {
						x: d==6?'center':d==5?'right':'left', 
						y: 'bottom'
					},
					offset: {
						x: (d==6?0:d==5?-1:1)*opt.divotSize,
						y: -1
					}
				};
				break;
			case 8: case 9: case 10:
				pos = {
					edge: {x: 'right', y: 'center'},
					position: {
						x: 'left', 
						y: d==9?'center':d==10?'top':'bottom'
					},
					offset: {
						x: 1,
						y: (d==9?0:d==8?-1:1)*opt.divotSize
					}
				};
				break;
		};
		var putItBack = this.expose();
		this.pointer.position($extend({
			relativeTo: this.pointyWrapper
		}, pos, options));
		putItBack();
	},
	setContent: function(a1, a2){
		this.parent(a1, a2);
		this.top[this.h1?'removeClass':'addClass']('noCaption');
		if (Browser.Engine.trident4) $(this).getElements('.bottom_ll, .bottom_lr').setStyle('font-size', 1); //IE6 bullshit
		if (this.options.closeButton) this.body.setStyle('margin-right', 6);
		this.positionPointer();
		return this;
	},
	makeCaption: function(caption){
		this.parent(caption);
		if (this.options.width && this.h1) this.h1.setStyle('width', (this.options.width-(this.options.closeButton?25:15)));
	}
});

StickyWin.UI.pointy = function(caption, body, options){
	return $(new StickyWin.UI.Pointy(caption, body, options));
};
StickyWin.ui.pointy = StickyWin.UI.pointy;
/*
Script: StickyWin.PointyTip.js
	Positions a pointy tip relative to the element you specify.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.PointyTip = new Class({
	Extends: StickyWin,
	options: {
		point: "left",
		pointyOptions: {}
	},
	initialize: function(){
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		var popts = this.options.pointyOptions;
		var d = popts.direction;
		if (!d) {
			var map = {
				left: 9,
				right: 3,
				up: 12,
				down: 6
			};
			d = map[this.options.point];
			if (!d) d = this.options.point;
			popts.direction = d;
		}
		if (!popts.width) popts.width = this.options.width;
		this.pointy = new StickyWin.UI.Pointy(args.caption, args.body, popts);
		this.options.content = null;
		this.setOptions(args.options, this.getPositionSettings());
		this.parent(this.options);
		this.win.empty().adopt(this.pointy);
		this.attachHandlers(this.win);
		if (this.options.showNow) this.position();
	},
	getArgs: function(){
		return StickyWin.UI.getArgs.apply(this, arguments);
	},
	getPositionSettings: function(){
		var s = this.pointy.options.divotSize;
		var d = this.options.point;
		switch(d) {
			case "left": case 8: case 9: case 10:
				return {
					edge: {
						x: 'left', 
						y: d==10?'top':d==8?'bottom':'center'
					},
					position: {x: 'right', y: 'center'},
					offset: {
						x: s
					}
				};
			case "right": case 2:  case 3: case 4:
				return {
					edge: {
						x: 'right', 
						y: d==2?'top':d==4?'bottom':'center'
					},
					position: {x: 'left', y: 'center'},
					offset: {x: -s}
				};
			case "up": case 11: case 12: case 1:
				return {
					edge: { 
						x: d==11?'left':d==1?'right':'center', 
						y: 'top' 
					},
					position: {	x: 'center', y: 'bottom' },
					offset: {
						y: s,
						x: d==11?-s:d==1?s:0
					}
				};
			case "down": case 5: case 6: case 7:
				return {
					edge: {
						x: d==7?'left':d==5?'right':'center', 
						y: 'bottom'
					},
					position: {x: 'center', y: 'top'},
					offset: {
						y: -s,
						x: d==7?-s:d==5?s:0
					}
				};
		};
	},
	setContent: function() {
		var args = this.getArgs(arguments);
		this.pointy.setContent(args.caption, args.body);
		[this.pointy.h1, this.pointy.body].each(this.attachHandlers, this);
		if (this.visible) this.position();
		return this;
	},
	showWin: function(){
		this.parent();
		this.pointy.positionPointer();
	},
	position: function(options){
		this.parent(options);
		this.pointy.positionPointer();
	},
	attachHandlers: function(content) {
		if (!content) return;
		content.getElements('.'+this.options.closeClassName).addEvent('click', function(){ this.hide(); }.bind(this));
		content.getElements('.'+this.options.pinClassName).addEvent('click', function(){ this.togglepin(); }.bind(this));
	}
});
FormValidator.Tips = new Class({
	Extends: FormValidator.Inline,
	options: {
		pointyTipOptions: {
			point: "left",
			width: 250
		}
//		tipCaption: ''
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
		if (advice && advice.visible) advice.show();
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
			$(advice).addClass(cssClass).set('id', 'advice-'+className+'-'+this.getFieldId(field));			
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
		if (field.hasClass('validation-failed') || field.hasClass('warning')) if (advice) advice.show();
		if (this.options.serial) {
			var fields = this.element.getElements('.validation-failed, .warning');
			if (fields.length) {
				fields.each(function(f, i) {
					var adv = this.getAdvice(f);
					adv.hide();
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
			display: 'none'
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
		li.inject(field.retrieve('validationMsgs'));
		li[li.reveal?'reveal':'show']();
		advice.msgs[className] = li;
	},
	insertAdvice: function(advice, field){
		//Check for error position prop
		var props = field.get('validatorProps');
		//Build advice
		if (!props.msgPos || !$(props.msgPos)) {
			switch (field.type.toLowerCase()) {
				case 'radio':
					var p = field.getParent().adopt(advice);
					break;
				default: 
					$(advice).inject($(field), 'after');
			};
		} else {
			$(props.msgPos).grab(advice);
		}
		advice.position();
	}
});
/*
Script: TagMaker.js
	Prompts the user to fill in the gaps to create an html tag output.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var TagMaker = new Class({
	Implements: [Options, Events, StyleWriter],
	options: {
		name: "Tag Builder",
		output: '',
		picklets: {},
		help: {},
		example: {},
		'class': {},
		selectLists: {},
		width: 400,
		maxHeight: 500,
		clearOnPrompt: true,
		baseHref: "http://www.cnet.com/html/rb/assets/global/tips", 
		css: "table.trinket {	width: 98%;	margin: 0px auto;	font-size: 10px; }"+
					"table.trinket td {	vertical-align: top;	padding: 4px;}"+
					"table.trinket td a.button {	position: relative;	top: -2px;}"+
					"table.trinket td.example {	font-size: 9px;	color: #666;	text-align: right;	border-bottom: 1px solid #ddd;"+
						"padding-bottom: 6px;}"+
					"table.trinket div.validation-advice {	background-color: #a36565;	font-weight: bold;	color: #fff;	padding: 4px;"+
						"margin-top: 3px;}"+
					"table.trinket input.text {width: 100%;}"+
					".tagMakerTipElement { 	cursor: help; }"+
					".tagMaker .tip {	color: #fff;	width: 172px;	z-index: 13000; }"+
					".tagMaker .tip-title {	font-weight: bold;	font-size: 11px;	margin: 0;	padding: 8px 8px 4px;"+
							"background: url(%baseHref%/bubble.png) top left;}"+
					".tagMaker .tip-text { font-size: 11px; 	padding: 4px 8px 8px; "+
							"background: url(%baseHref%/bubble.png) bottom right; }"+
					".tagMaker { z-index:10001 }"
//	onPrompt: $empty,
//	onChoose: $empty
	},
	initialize: function(options){
		this.setOptions(options);
		this.buttons = [
			{
				text: 'Paste',
				onClick: function(){
					if (this.validator.validate()) this.insert();
				}.bind(this),
				properties: {
					'class': 'tip',
					title: 'Paste::Insert the html into the field you are editing'
				}
			},
			{
				text: 'Close',
				properties: {
					'class': 'closeSticky tip',
					title: 'Close::Close this popup'
				}
			}
		];
		this.createStyle(this.options.css.replace("%baseHref%", this.options.baseHref, "g"), 'defaultTagBuilderStyle');
	},
	prompt: function(target){
		this.target = $(target);
		var content = this.getContent();
		if (this.options.clearOnPrompt) this.clear();
		if (content) {
				var relativeTo = (document.compatMode == "BackCompat" && this.target)?this.target:document.body;
				if (!this.win) {
					this.win = new StickyWin({
						content: content,
						draggable: true,
						relativeTo: relativeTo,
						onClose: function(){
							$$('.tagMaker-tip').hide();
						}
					});
				}
				if (!this.win.visible) this.win.show();
		}
		var innerText = this.getInnerTextInput();
		this.range = target.getSelectedRange();
		if (innerText) innerText.set('value', target.getTextInRange(this.range.start, this.range.end)||"");
		return this.fireEvent('onPrompt');
	},
	clear: function(){
		this.body.getElements('input').each(function(input){
			input.erase('value');
		});
	},
	getKeys: function(text) {
		return text.split('%').filter(function(inputKey, index){
				return index%2;
		});
	},
	getInnerTextInput: function(){
		return this.body.getElement('input[name=Inner-Text]');
	},
	getContent: function(){
		var opt = this.options; //save some bytes
		if (!this.form) { //if the body hasn't been created, create it
			this.form = new Element('form');
				var table = new HtmlTable({properties: {'class':'trinket'}});
				this.getKeys(opt.output).each(function(inputKey) {
					if (this.options.selectLists[inputKey]){
						var input = new Element('select').setProperties({
							name: inputKey.replace(' ', '-', 'g')
						}).addEvent('change', this.createOutput.bind(this));
						this.options.selectLists[inputKey].each(function(opt){
							var option = new Element('option').inject(input);
							if (opt.selected) option.set('selected', true);
							option.set('value', opt.value);
							option.set('text', opt.key);
						}, this);
						table.push([inputKey, input]);
					} else {
						var input = new Element('input', {
							type: 'text',
							name: inputKey.replace(/ /g, '-'),
							title: inputKey+'::'+opt.help[inputKey],
							'class': 'text tip ' + ((opt['class'])?opt['class'][inputKey]||'':''),
							events: {
								keyup: this.createOutput.bind(this),
								focus: function(){this.select()},
								change: this.createOutput.bind(this)
							}
						});
						if (opt.picklets[inputKey]) {
							var a = new Element('a').addClass('button').set('html', 'choose');
							var div = new Element('div').adopt(input.setStyle('width',160)).adopt(a);
							var picklets = ($type(opt.picklets[inputKey]) == "array")?opt.picklets[inputKey]:[opt.picklets[inputKey]];
							new ProductPicker(input, picklets, {
								showOnFocus: false, 
								additionalShowLinks: [a],
								onPick: function(input, data, picker){
									try {
										var ltInput = this.getInnerTextInput();
										if (ltInput && !ltInput.get('value')) {
											try {
												ltInput.set('value', picker.currentPicklet.options.listItemName(data));
											}catch (e){dbug.log('set value error: ', e);}
										}
										var val = input.value;
										if (inputKey == "Full Path" && val.test(/^http:/))
												input.set('value', val.substring(val.indexOf('/', 7), val.length));
										this.createOutput();
									} catch(e){dbug.log(e)}
								}.bind(this)
							});
							table.push([inputKey, div]);
						} else table.push([inputKey, input]);
					}
					//[{content: <content>, properties: {colspan: 2, rowspan: 3, 'class': "cssClass", style: "border: 1px solid blue"}]
					if (this.options.example[inputKey]) 
						table.push([{content: 'eg. '+this.options.example[inputKey], properties: {colspan: 2, 'class': 'example'}}]);
				}, this);
				this.resultInput = new Element('input', {
						type: 'text',
						title: 'HTML::This is the resulting tag html.',
						'class': 'text result tip'
					}).addEvent('focus', function(){this.select()});
				table.push(['HTML', this.resultInput]).tr;

			this.form = table.table;
			this.body = new Element('div', {
				styles: {
					overflow:'auto',
					maxHeight: this.options.maxHeight
				}
			}).adopt(this.form);
			this.validator = new FormValidator(this.form);
			this.validator.insertAdvice = function(advice, field){
				var p = $(field.parentNode);
				if (p) p.adopt(advice);
			};
		}

		if (!this.content) {
			this.content = StickyWin.ui(this.options.name, this.body, {
				buttons: this.buttons,
				width: this.options.width.toInt()
			});
			new Tips(this.content.getElements('.tip'), {
				showDelay: 700,
				maxTitleChars: 50, 
				maxOpacity: .9,
				className: 'tagMaker'
			});
		}
		return this.content;

	},
	createOutput: function(){
		var inputs = this.form.getElements('input, select');
		var html = this.options.output;
		inputs.each(function(input) {
			if (!input.hasClass('result')) {
				html = html.replace(new RegExp('%'+input.get('name').replace('-', ' ', 'g').toLowerCase()+'%', 'ig'),
					(input.get('tag')=='select'?input.getSelected()[0]:input).get('value'));
				html = html.replace(/\s\w+\=""/g, "");
			}
		});
		return this.resultInput.value = html;
	},
	insert: function(){
		if (!this.target) {
			simpleErrorPopup('Cannot Paste','This tag builder was not launched with a target input specified; you\'ll have to copy the tag yourself. Sorry!');
			return;
		}
		var value = (this.target)?this.target.value:this.target;
		var output = this.body.getElement("input.result");
		
		var currentScrollPos; 
		if (this.target.scrollTop || this.target.scrollLeft) {
			currentScrollPos = {
				scrollTop: this.target.getScroll().y,
				scrollLeft: this.target.getScroll().x
			};
		}
		this.target.value = value.substring(0, this.range.start) + output.value + value.substring((this.range.end-this.range.start) + this.range.start, value.length);
		if (currentScrollPos) {
			this.target.scrollTop = currentScrollPos.getScroll().y;
			this.target.scrollLeft = currentScrollPos.getScroll().x;
		}

		this.target.selectRange(this.range.start, output.value.length + this.range.start);
		this.fireEvent('onChoose');
		$$('.tagMaker-tip').hide();
		this.win.hide();
		return;
	}
});


TagMaker.image = new Class({
	Extends: TagMaker,
	options: {
		name: "Image Builder",
		output: '<img src="%Full Url%" width="%Width%" height="%Height%" alt="%Alt Text%" style="%Alignment%"/>',
		help: {
			'Full Url':'Enter the external URL (http://...) to the image',
			'Width':'Enter the width in pixels.',
			'Height':'Enter the height in pixels.',
			'Alt Text':'Enter the alternate text for the image.',
			'Alignment':'Choose how to float the image.'
		},
		example: {
			'Full Url':'http://i.i.com.com/cnwk.1d/i/hdft/redball.gif'
		},
		'class': {
			'Full Url':'validate-url required',
			'Width':'validate-digits',
			'Height':'validate-digits',
			'Alt Text':''
		},
		selectLists: {
			Alignment: [
				{
					key: 'left',
					value: 'float: left'
				},
				{
					key: 'right',
					value: 'float: right'
				},
				{
					key: 'none',
					value: 'float: none',
					selected: true
				},
				{
					key: 'center',
					value: 'margin-left: auto; margin-right: auto;'
				}
			]		
		}
	}
});

TagMaker.anchor = new Class({
	Extends: TagMaker,
	options: {
		name: "Anchor Builder",
		output: '<a href="%Full Url%">%Inner Text%</a>',
		help: {
			'Full Url':'Enter the external URL (http://...)',
			'Inner Text':'Enter the text for the link body'
		},
		example: {
			'Full Url':'http://www.microsoft.com',
			'Inner Text':'Microsoft'
		},
		'class': {
			'Full Url':'validate-url'
		}
	}
});
/*
Script: InputFocus.js
	Adds a focused css class to inputs when they have focus.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var InputFocus = new Class({
	Implements: [Options, Class.Occlude, Class.ToElement],
	Binds: ['focus', 'blur'],
	options: {
		focusedClass: 'focused',
		hideOutline: false
	},
	initialize: function(input, options) {
		this.element = $(input);
		if (this.occlude('focuser')) return this.occluded;
		this.setOptions(options);
		this.element.addEvents({
			focus: this.focus,
			blur: this.blur
		});
	},
	focus: function(){
		if (this.options.hideOutline) {
			(function(){
				if (Browser.Engine.trident) $(this).set('hideFocus', true);
				else $(this).setStyle('outline', '0');
			}).delay(500, this);
		}
		$(this).addClass(this.options.focusedClass);
	},
	blur: function(){
		$(this).removeClass(this.options.focusedClass);
	}
});
/*
Script: Waiter.js

Adds a semi-transparent overlay over a dom element with a spinnin ajax icon.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Waiter = new Class({
	Implements: [Options, Events, Chain],
	options: {
		baseHref: 'http://www.cnet.com/html/rb/assets/global/waiter/',
		containerProps: {
			styles: {
				position: 'absolute',
				'text-align': 'center'
			},
			'class':'waiterContainer'
		},
		containerPosition: {},
		msg: false,
		msgProps: {
			styles: {
				'text-align': 'center',
				fontWeight: 'bold'
			},
			'class':'waiterMsg'
		},
		img: {
			src: 'waiter.gif',
			styles: {
				width: 24,
				height: 24
			},
			'class':'waiterImg'
		},
		layer:{
			styles: {
				width: 0,
				height: 0,
				position: 'absolute',
				zIndex: 999,
				display: 'none',
				opacity: 0.9,
				background: '#fff'
			},
			'class': 'waitingDiv'
		},
		useIframeShim: true,
		fxOptions: {},
		injectWhere: null
//	iframeShimOptions: {},
//	onShow: $empty
//	onHide: $empty
	},
	initialize: function(target, options){
		this.target = $(target)||$(document.body);
		this.setOptions(options);
		this.waiterContainer = new Element('div', this.options.containerProps);
		if (this.options.msg) {
			this.msgContainer = new Element('div', this.options.msgProps);
			this.waiterContainer.adopt(this.msgContainer);
			if (!$(this.options.msg)) this.msg = new Element('p').appendText(this.options.msg);
			else this.msg = $(this.options.msg);
			this.msgContainer.adopt(this.msg);
		}
		if (this.options.img) this.waiterImg = $(this.options.img.id) || new Element('img').inject(this.waiterContainer);
		this.waiterOverlay = $(this.options.layer.id) || new Element('div').adopt(this.waiterContainer);
		this.waiterOverlay.set(this.options.layer);
		this.place(target);
		try {
			if (this.options.useIframeShim) this.shim = new IframeShim(this.waiterOverlay, this.options.iframeShimOptions);
		} catch(e) {
			dbug.log("Waiter attempting to use IframeShim but failed; did you include IframeShim? Error: ", e);
			this.options.useIframeShim = false;
		}
		this.waiterFx = this.waiterFx || new Fx.Elements($$(this.waiterContainer, this.waiterOverlay), this.options.fxOptions);
	},
	place: function(target, where){
		var where = where || this.options.injectWhere || target == document.body ? 'inside' : 'after';
		this.waiterOverlay.inject(target, where);
	},
	toggle: function(element, show) {
		//the element or the default
		element = $(element) || $(this.active) || $(this.target);
		this.place(element);
		if (!$(element)) return this;
		if (this.active && element != this.active) return this.stop(this.start.bind(this, element));
		//if it's not active or show is explicit
		//or show is not explicitly set to false
		//start the effect
		if ((!this.active || show) && show !== false) this.start(element);
		//else if it's active and show isn't explicitly set to true
		//stop the effect
		else if (this.active && !show) this.stop();
		return this;
	},
	reset: function(){
		this.waiterFx.cancel().set({
			0: { opacity:[0]},
			1: { opacity:[0]}
		});
	},
	start: function(element){
		this.reset();
		element = $(element) || $(this.target);
		this.place(element);
		if (this.options.img) {
			this.waiterImg.set($merge(this.options.img, {
				src: this.options.baseHref + this.options.img.src
			}));
		}
		
		var start = function() {
			var dim = element.getComputedSize();
			this.active = element;
			this.waiterOverlay.setStyles({
				width: this.options.layer.width||dim.totalWidth,
				height: this.options.layer.height||dim.totalHeight,
				display: 'block'
			}).position({
				relativeTo: element,
				position: 'upperLeft'
			});
			this.waiterContainer.position($merge({
				relativeTo: this.waiterOverlay
			}, this.options.containerPosition));
			if (this.options.useIframeShim) this.shim.show();
			this.waiterFx.start({
				0: { opacity:[1] },
				1: { opacity:[this.options.layer.styles.opacity]}
			}).chain(function(){
				if (this.active == element) this.fireEvent('onShow', element);
				this.callChain();
			}.bind(this));
		}.bind(this);

		if (this.active && this.active != element) this.stop(start);
		else start();
		
		return this;
	},
	stop: function(callback){
		if (!this.active) {
			if ($type(callback) == "function") callback.attempt();
			return this;
		}
		this.waiterFx.cancel();
		this.waiterFx.clearChain();
		//fade the waiter out
		this.waiterFx.start({
			0: { opacity:[0]},
			1: { opacity:[0]}
		}).chain(function(){
			this.active = null;
			this.waiterOverlay.hide();
			if (this.options.useIframeShim) this.shim.hide();
			this.fireEvent('onHide', this.active);
			this.callChain();
			this.clearChain();
			if ($type(callback) == "function") callback.attempt();
		}.bind(this));
		return this;
	}
});

if (typeof Request != "undefined" && Request.HTML) {
	Request.HTML = Class.refactor(Request.HTML, {
		options: {
			useWaiter: false,
			waiterOptions: {},
			waiterTarget: false
		},
		initialize: function(options){
			this._send = this.send;
			this.send = function(options){
				if (this.waiter) this.waiter.start().chain(this._send.bind(this, options));
				else this._send(options);
				return this;
			};
			this.previous(options);
			if (this.options.useWaiter && ($(this.options.update) || $(this.options.waiterTarget))) {
				this.waiter = new Waiter(this.options.waiterTarget || this.options.update, this.options.waiterOptions);
				['onComplete', 'onException', 'onCancel'].each(function(event){
					this.addEvent(event, this.waiter.stop.bind(this.waiter));
				}, this);
			}
		}
	});
}

Element.Properties.waiter = {

	set: function(options){
		var waiter = this.retrieve('waiter');
		return this.eliminate('waiter').store('waiter:options', options);
	},

	get: function(options){
		if (options || !this.retrieve('waiter')){
			if (options || !this.retrieve('waiter:options')) this.set('waiter', options);
			this.store('waiter', new Waiter(this, this.retrieve('waiter:options')));
		}
		return this.retrieve('waiter');
	}

};

Element.implement({

	wait: function(options){
		this.get('waiter', options).start();
		return this;
	},
	
	release: function(){
		var opt = Array.link(arguments, {options: Object.type, callback: Function.type});
		this.get('waiter', opt.options).stop(opt.callback);
		return this;
	}

});
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
/*
Script: Fupdate.Append.js
	Handles the basic functionality of submitting a form and updating a dom element with the result. 
	The result is appended to the DOM element instead of replacing its contents.

License:
	MIT-style license
*/
Fupdate.Append = new Class({

	Extends: Fupdate,

	options: {
		//onBeforeEffect: $empty,
		useReveal: true,
		revealOptions: {},
		inject: 'bottom'
	},

	makeRequest: function(){
		this.request = new Request.HTML($merge({
				url: $(this).get('action'),
				waiterTarget: $(this)
			}, this.options.requestOptions, {
				evalScripts: false
			})
		).addEvents({
			success: function(tree, elements, html, javascript){
				var container = new Element('div').set('html', html).hide();
				var kids = container.getChildren();
				if (kids.length == 1) container = kids[0];
				container.inject(this.update, this.options.inject);
				if (this.options.requestOptions.evalScripts) $exec(javascript);
				this.fireEvent('beforeEffect', container);
				var finish = function(){
					this.fireEvent('success', [container, this.update, tree, elements, html, javascript]);
				}.bind(this);
				if (this.options.useReveal) container.set('reveal', this.options.revealOptions).reveal().get('reveal').chain(finish);
				else finish();
			}.bind(this),
			failure: function(xhr){
				this.fireEvent('failure', xhr);
			}.bind(this)
		});
	}

});
/*
Script: DatePicker.js
	Allows the user to enter a date in many popuplar date formats or choose from a calendar.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var DatePicker;
(function(){
	var DPglobal = function() {
		if (DatePicker.pickers) return;
		DatePicker.pickers = [];
		DatePicker.hideAll = function(){
			DatePicker.pickers.each(function(picker){
				picker.hide();
			});
		};
	};
 	DatePicker = new Class({
		Implements: [Options, Events, StyleWriter],
		options: {
			format: "%x",
			defaultCss: 'div.calendarHolder {height:177px;position: absolute;top: -21px !important;top: -27px;left: -3px;width: 100%;}'+
				'div.calendarHolder table.cal {margin-right: 15px !important;margin-right: 8px;width: 205px;}'+
				'div.calendarHolder td {text-align:center;}'+
				'div.calendarHolder tr.dayRow td {padding: 2px;width: 22px;cursor: pointer;}'+
				'div.calendarHolder table.datePicker * {font-size:11px;line-height:16px;}'+
				'div.calendarHolder table.datePicker {margin: 0;padding:0 5px;float: left;}'+
				'div.calendarHolder table.datePicker table.cal td {cursor:pointer;}'+
				'div.calendarHolder tr.dateNav {font-weight: bold;height:22px;margin-top:8px;}'+
				'div.calendarHolder tr.dayNames {height: 23px;}'+
				'div.calendarHolder tr.dayNames td {color:#666;font-weight:700;border-bottom:1px solid #ddd;}'+
				'div.calendarHolder table.datePicker tr.dayRow td:hover {background:#ccc;}'+
				'div.calendarHolder table.datePicker tr.dayRow td {margin: 1px;}'+
				'div.calendarHolder td.today {color:#bb0904;}'+
				'div.calendarHolder td.otherMonthDate {border:1px solid #fff;color:#ccc;background:#f3f3f3 !important;margin: 0px !important;}'+
				'div.calendarHolder td.selectedDate {border: 1px solid #20397b;background:#dcddef;margin: 0px !important;}'+
				'div.calendarHolder a.leftScroll, div.calendarHolder a.rightScroll {cursor: pointer; color: #000}'+
				'div.datePickerSW div.body {height: 160px !important;height: 149px;}'+
				'div.datePickerSW .clearfix:after {content: ".";display: block;height: 0;clear: both;visibility: hidden;}'+
				'div.datePickerSW .clearfix {display: inline-table;}'+
				'* html div.datePickerSW .clearfix {height: 1%;}'+
				'div.datePickerSW .clearfix {display: block;}',
			calendarId: false,
			stickyWinOptions: {
				draggable: true,
				dragOptions: {},
				position: "bottomLeft",
				offset: {x:10, y:10},
				fadeDuration: 400
			},
			stickyWinUiOptions: {},
			updateOnBlur: true,
			additionalShowLinks: [],
			showOnInputFocus: true,
			useDefaultCss: true,
			hideCalendarOnPick: true,
			weekStartOffset: 0,
			showMoreThanOne: true,
			stickyWinToUse: StickyWin
/*		onPick: $empty,
			onShow: $empty,
			onHide: $empty */
		},
	
		initialize: function(input, options){
			DPglobal(); //make sure controller is setup
			if ($(input)) this.inputs = $H({start: $(input)});
	    	this.today = new Date();
			this.setOptions(options);
			if (this.options.useDefaultCss) this.createStyle(this.options.defaultCss, 'datePickerStyle');
			if (!this.inputs) return;
			this.whens = this.whens || ['start'];
			if (!this.calendarId) this.calendarId = "popupCalendar" + new Date().getTime();
			this.setUpObservers();
			this.getCalendar();
			this.formValidatorInterface();
			DatePicker.pickers.push(this);
		},
		formValidatorInterface: function(){
			this.inputs.each(function(input){
				var props;
				if (input.get('validatorProps')){
					try {
						props = JSON.decode(input.get('validatorProps'));
					}catch(e){}
				}
				if (props && props.dateFormat) {
					dbug.log('using date format specified in validatorProps property of element to play nice with FormValidator');
					this.setOptions({ format: props.dateFormat });
				} else {
					if (!props) props = {};
					props.dateFormat = this.options.format;
					input.set('validatorProps', JSON.encode(props));
				}
			}, this);
		},
		calWidth: 280,
		inputDates: {},
		selectedDates: {},
		setUpObservers: function(){
			this.inputs.each(function(input) {
				if (this.options.showOnInputFocus) input.addEvent('focus', this.show.bind(this));
				input.addEvent('blur', function(e){
					if (e) {
						this.selectedDates = this.getDates(null, true);
						this.fillCalendar(this.selectedDates.start);
						if (this.options.updateOnBlur) this.updateInput();
					}
				}.bind(this));
			}, this);
			this.options.additionalShowLinks.each(function(lnk){
				$(lnk).addEvent('click', this.show.bind(this))
			}, this);
		},
		getDates: function(dates, getFromInputs){
			var d = {};
			if (!getFromInputs) dates = dates||this.selectedDates;
			var getFromInput = function(when){
				var input = this.inputs.get(when);
				if (input) d[when] = this.validDate(input.get('value'));
			}.bind(this);
			this.whens.each(function(when) {
				switch($type(dates)){
					case "object":
						if (dates) d[when] = dates[when]?dates[when]:dates;
						if (!d[when] && !d[when].format) getFromInput(when);
						break;
					default:
						getFromInput(when);
						break;
				}
				if (!d[when]) d[when] = this.selectedDates[when]||new Date();
			}, this);
			return d;
		},
		updateInput: function(){
			var d = {};
			$each(this.getDates(), function(value, key){
				var input = this.inputs.get(key);
				if (!input) return;
				input.set('value', (value)?this.formatDate(value)||"":"");
			}, this);
			return this;
		},
		validDate: function(val) {
			if (!$chk(val)) return null;
			var date = Date.parse(val.trim());
			return isNaN(date)?null:date;
		},
		formatDate: function (date) {
			return date.format(this.options.format);
		},
		getCalendar: function() {
			if (!this.calendar) {
				var cal = new Element("table", {
					'id': this.options.calendarId || '',
					'border':'0',
					'cellpadding':'0',
					'cellspacing':'0',
					'class':'datePicker'
				});
				var tbody = new Element('tbody').inject(cal);
				var rows = [];
				(8).times(function(i){
					var row = new Element('tr').inject(tbody);
					(7).times(function(i){
						var td = new Element('td').inject(row).set('html', '&nbsp;');
					});
				});
				var rows = tbody.getElements('tr');
				rows[0].addClass('dateNav');
				rows[1].addClass('dayNames');
				(6).times(function(i){
					rows[i+2].addClass('dayRow');
				});
				this.rows = rows;
				var dayCells = rows[1].getElements('td');
				dayCells.each(function(cell, i){
					cell.firstChild.data = Date.$days[(i + this.options.weekStartOffset) % 7].substring(0,3);
				}, this);
				[6,5,4,3].each(function(i){ rows[0].getElements('td')[i].dispose() });
				this.prevLnk = rows[0].getElement('td').setStyle('text-align', 'right');
				this.prevLnk.adopt(new Element('a').set('html', "&lt;").addClass('rightScroll'));
				this.month = rows[0].getElements('td')[1];
				this.month.set('colspan', 5);
				this.nextLnk = rows[0].getElements('td')[2].setStyle('text-align', 'left');
				this.nextLnk.adopt(new Element('a').set('html', '&gt;').addClass('leftScroll'));
				cal.addEvent('click', this.clickCalendar.bind(this));
				this.calendar = cal;
				this.container = new Element('div').adopt(cal).addClass('calendarHolder');
				this.content = StickyWin.ui('', this.container, $merge(this.options.stickyWinUiOptions, {
					cornerHandle: this.options.stickyWinOptions.draggable,
					width: this.calWidth
				}));
				var opts = $merge(this.options.stickyWinOptions, {
					content: this.content,
					className: 'datePickerSW',
					allowMultipleByClass: true,
					showNow: false,
					relativeTo: this.inputs.get('start')
				});
				dbug.log('make ', StickyWin)
				this.stickyWin = new this.options.stickyWinToUse(opts);
				dbug.log(this.stickyWin)
				this.stickyWin.addEvent('onDisplay', this.positionClose.bind(this));
				this.container.setStyle('z-index', this.stickyWin.win.getStyle('z-index').toInt()+1);
			}
			return this.calendar;
		},
		positionClose: function(){
			if (this.closePositioned) return;
			var closer = this.content.getElement('div.closeButton');
			if (closer) {
				closer.inject(this.container, 'after').setStyle('z-index', this.stickyWin.win.getStyle('z-index').toInt()+2);
				(function(){
					this.content.setStyle('width', this.calendar.getSize().x + (this.options.time ? 240 : 40));
					closer.position({relativeTo: this.stickyWin.win.getElement('.top'), position: 'upperRight', edge: 'upperRight'});
				}).delay(3, this);
			}
			this.closePositioned = true;
		},
		hide: function(){
			this.stickyWin.hide();
			this.fireEvent('onHide');
			return this;
		},
		hideOthers: function(){
			DatePicker.pickers.each(function(picker){
				if (picker != this) picker.hide();
			});
			return this;
		},
		show: function(){
			this.selectedDates = {};
			var dates = this.getDates(null, true);
			this.whens.each(function(when){
				this.inputDates[when] = dates[when]?dates[when].clone():dates.start?dates.start.clone():this.today;
		    this.selectedDates[when] = !this.inputDates[when] || isNaN(this.inputDates[when]) 
						? this.today 
						: this.inputDates[when].clone();
				this.getCalendar(when);
			}, this);
			this.fillCalendar(this.selectedDates.start);
			if (!this.options.showMoreThanOne) this.hideOthers();
			this.stickyWin.show();
			this.fireEvent('onShow');		
			return this;
		},
		handleScroll: function(e){
			if (e.target.hasClass('rightScroll')||e.target.hasClass('leftScroll')) {
				var newRef = e.target.hasClass('rightScroll')
					?this.rows[2].getElement('td').refDate - Date.$units.day()
					:this.rows[7].getElements('td')[6].refDate + Date.$units.day();
				this.fillCalendar(new Date(newRef));
				return true;
			}
			return false;
		},
		setSelectedDates: function(e, newDate){
			this.selectedDates.start = newDate;
		},
		onPick: function(){
			this.updateSelectors();
			this.inputs.each(function(input) {
				input.fireEvent("change");
				input.fireEvent("blur");
			});
			this.fireEvent('onPick');
			if (this.options.hideCalendarOnPick) this.hide();
		},
		clickCalendar: function(e) {
			if (this.options.format == "%d/%m/%Y") Date.$culture = "GB";
			if (this.handleScroll(e)) return;
			if (!e.target.firstChild || !e.target.firstChild.data) return;
			var val = e.target.firstChild.data;
			if (e.target.refDate) {
				var newDate = new Date(e.target.refDate);
				this.setSelectedDates(e, newDate);
				this.updateInput();
				this.onPick();
			}
		},
		fillCalendar: function (date) {
			if ($type(date) == "string") date = new Date(date);
			var startDate = (date)?new Date(date.getTime()):new Date();
			var hours = startDate.get('hours');
			startDate.setDate(1);
			startDate.setTime((startDate.getTime() - (Date.$units.day() * (startDate.getDay()))) + 
			                  (Date.$units.day() * this.options.weekStartOffset));
			var monthyr = new Element('span', {
				html: Date.$months[date.getMonth()] + " " + date.getFullYear()
			});
			$(this.rows[0].getElements('td')[1]).empty().adopt(monthyr);
			var atDate = startDate.clone();
			this.rows.each(function(row, i){
				if (i < 2) return;
				row.getElements('td').each(function(td){
					atDate.set('hours', hours);
					td.firstChild.data = atDate.getDate();
					td.refDate = atDate.getTime();
					atDate.setTime(atDate.getTime() + Date.$units.day());
				}, this);
			}, this);
			this.updateSelectors();
		},
		updateSelectors: function(){
			var atDate;
			var month = new Date(this.rows[5].getElement('td').refDate).getMonth();
			this.rows.each(function(row, i){
				if (i < 2) return;
				row.getElements('td').each(function(td){
					td.className = '';
					atDate = new Date(td.refDate);
					if (atDate.format("%x") == this.today.format("%x")) td.addClass('today');
					this.whens.each(function(when){
						var date = this.selectedDates[when];
						if (date && atDate.format("%x") == date.format("%x")) {
							td.addClass('selectedDate');
							this.fireEvent('selectedDateMatch', [td, when]);
						}
					}, this);
					this.fireEvent('rowDateEvaluated', [atDate, td]);
					if (atDate.getMonth() != month) td.addClass('otherMonthDate');
					atDate.setTime(atDate.getTime() + Date.$units.day());
				}, this);
			}, this);
		}
	});
})();
/*
Script: Confirmer.js
	Fades a message in and out for the user to tell them that some event (like an ajax save) has occurred.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Confirmer = new Class({
	Implements: [Options, Events],
	options: {
		reposition: true, //for elements already in the DOM
		//if position = false, just fade
		positionOptions: {
			relativeTo: false,
			position: 'upperRight', //see <Element.Position>
			offset: {x:-225,y:0},
			zIndex: 9999
		},
		msg: 'your changes have been saved', //string or dom element
		msgContainerSelector: '.body',
		delay: 250,
		pause: 1000,
		effectOptions:{
			duration: 500
		},
		prompterStyle:{
			padding: '2px 6px',
			border: '1px solid #9f0000',
			backgroundColor: '#f9d0d0',
			fontWeight: 'bold',
			color: '#000',
			width: 210
		}
//	onComplete: $empty
	},
	initialize: function(options){
			this.setOptions(options);
			this.options.positionOptions.relativeTo = $(this.options.positionOptions.relativeTo) || document.body;
			this.prompter = ($(this.options.msg))?$(this.options.msg):this.makePrompter(this.options.msg);
			if (this.options.reposition){
				this.prompter.setStyles({
					position: 'absolute',
					display: 'none',
					zIndex: this.options.positionOptions.zIndex
				});
				if (!Browser.Engine.trident4) this.prompter.setStyle('opacity',0);
			} else if (!Browser.Engine.trident4) this.prompter.setStyle('opacity',0);
			else this.prompter.setStyle('visibility','hidden');
			if (!this.prompter.getParent()){
				window.addEvent('domready', function(){
					this.prompter.inject(document.body);
				}.bind(this));
			}
		try {
			this.msgHolder = this.prompter.getElement(this.options.msgContainerSelector);
			if (!this.msgHolder) this.msgHolder = this.prompter;
		} catch(e){dbug.log(e)}
	},
	makePrompter: function(msg){
		return new Element('div').setStyles(this.options.prompterStyle).appendText(msg);
	},
	prompt: function(options){
		if (!this.paused)this.stop();
		var msg = (options)?options.msg:false;
		options = $merge(this.options, {saveAsDefault: false}, options||{});
		if ($(options.msg) && msg) this.msgHolder.empty().adopt(options.msg);
		else if (!$(options.msg) && options.msg) this.msgHolder.empty().appendText(options.msg);
		if (!this.paused) {
			if (options.reposition) this.position(options.positionOptions);
			(function(){
				this.timer = this.fade(options.pause);
			}).delay(options.delay, this);
		}
		if (options.saveAsDefault) this.setOptions(options);
		return this;
	},
	fade: function(pause){
		this.paused = true;
		pause = $pick(pause, this.options.pause);
		if (!this.fx && !Browser.Engine.trident4)
			this.fx = new Fx.Tween(this.prompter, $merge({property: 'opacity'}, this.options.effectOptions));
		if (this.options.reposition) this.prompter.setStyle('display','block');
		if (!Browser.Engine.trident4){
			this.prompter.setStyle('visibility','visible');
			this.fx.start(0,1).chain(function(){
				this.timer = (function(){
					this.fx.start(0).chain(function(){
						if (this.options.reposition) this.prompter.hide();
						this.paused = false;
					}.bind(this));
				}).delay(pause, this);
			}.bind(this));
		} else {
			this.prompter.setStyle('visibility','visible');
			this.timer = (function(){
				this.prompter.setStyle('visibility','hidden');
				this.fireEvent('onComplete');
				this.paused = false;
			}).delay(pause+this.options.effectOptions.duration, this);
		}
		return this;
	},
	stop: function(){	
		this.paused = false;
		$clear(this.timer);
		if (this.fx) this.fx.set(0);
		if (this.options.reposition) this.prompter.hide();
		return this;
	},
	position: function(positionOptions){
		this.prompter.position($merge(this.options.positionOptions, positionOptions));
		return this;
	}
});

/*
Script: ProductPicker.js
	Allows the user to pick a product from a data source.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Picklet = new Class({
	Implements: [Options, Events],
/*	options: {
		onShow: $empty
	}, */
	inputElements : {},
	initialize: function(className, options){
		this.setOptions(options);
		this.className = className;
		this.getQuery = this.options.getQuery;
	}
});
var ProductPicker = new Class({
	Implements: [Options, Events, StyleWriter],
	options: {
//	onShow: $empty,
//	onPick: $empty,
		title: 'Product picker',
		showOnFocus: true,
		additionalShowLinks: [],
		stickyWinToUse: StickyWin,
		stickyWinOptions: {
			fadeDuration: 200,
			draggable: true,
			width: 450
		},
		moveIntoView: true,
		baseHref: 'http://www.cnet.com/html/rb/assets/global/Picker',
		css: "div.productPickerProductDiv div.results { overflow: 'auto'; width: 100%; margin-top: 4px }"+
			"div.productPickerProductDiv select { margin: 4px 0px 4px 0px}"+
			"div.pickerPreview div.sliderContent img {border: 1px solid #000}"+
			"div.pickerPreview div.sliderContent a {color: #0d63a0}" + 
			"div.productPickerProductDiv * {color: #000}" +
			".tool-tip { color: #fff; width: 172px; z-index: 13000; }" +
			".tool-title { font: Verdana, Arial, Helvetica, sans-serif; font-weight: bold; font-size: 11px; margin: 0; padding: 8px 8px 4px; background: url(%tipsArt%/bubble.png) top left !important; background: url(%tipsArt%/bubble.gif) top left; }" +
			".tool-text {font-size: 11px; margin: 0px; padding: 4px 8px 8px; background: url(%tipsArt%/bubble.png) bottom right !important; background: url(%tipsArt%/bubble.gif) bottom right; }"
	},
	initialize: function(input, picklets, options){
		this.setOptions(options);
		this.writeCss();
		this.input = $(input);
		if (!this.input) return;
		this.picklets = picklets;
		this.setUpObservers();
	},
	writeCss: function(){
		var art = this.options.baseHref;
		var tipsArt = art.replace("Picker", "tips");
		this.createStyle(this.options.css.replace("%tipsArt%", tipsArt, "g"), 'pickerStyles');
	},
	getPickletList: function(){
		if (this.picklets.length>1) {
			var selector = new Element('select').setStyle('width', 399);
			this.picklets.each(function(picklet, index){
				var opt = new Element('option').set('value',index);
				opt.text = picklet.options.descriptiveName;
				selector.adopt(opt);
			}, this);
			selector.addEvent('change', function(){
				this.showForm(this.picklets[selector.getSelected()[0].get('value')]);
				this.focusInput(true);
			}.bind(this));
			return selector;
		} else return false;
	},
	buildPicker: function(picklet){
		var contents = new Element('div');
		this.formBody = new Element('div');
		this.pickletList = this.getPickletList();
		if (this.pickletList) contents.adopt(this.pickletList);
		contents.adopt(this.formBody);
		var body = StickyWin.ui(this.options.title, contents, {
			width: this.options.stickyWinOptions.width,
			closeTxt: 'close'
		}).addClass('productPickerProductDiv');
		this.showForm();
		return body;
	},
	showForm: function(picklet){
		this.form = this.makeSearchForm(picklet || this.picklets[0]);
		this.formBody.empty().adopt(this.form);
		(picklet || this.picklets[0]).fireEvent('onShow');
		this.results = new Element('div').addClass('results');
		this.formBody.adopt(this.results);
		this.sliderFx = null;
		this.fireEvent("onShow");
	},
	makeSlider: function(){
		var png = (Browser.Engine.trident)?'gif':'png';
		this.slider = new Element('div', {
			styles: {
				background:'url('+this.options.baseHref+'/slider.'+png+') top right no-repeat',
				display: 'none',
				height:250,
				left:this.options.stickyWinOptions.width - 11,
				position:'absolute',
				top:25,
				width:0,
				overflow: 'hidden'
			}
		}).addClass('pickerPreview').inject(this.swin.win).addEvents({
			mouseover: function(){
				this.previewHover = true;
			}.bind(this),
			mouseout: function(){
				this.previewHover = false;
				(function(){if (!this.previewHover) this.hidePreview()}).delay(400, this);
			}.bind(this)
		});
		this.sliderContent = new Element('div', {
			styles: {
				width: 130,
				height: 200,
				padding: 10,
				margin: '10px 10px 0px 0px',
				overflow: 'auto',
				cssFloat: 'right'
			}
		}).inject(this.slider).addClass('sliderContent');
	},
	makeSearchForm: function(picklet){
		this.currentPicklet = picklet;
		var formTable = new Element('table', {
			styles: {
				width: "100%",
				cellpadding: '0',
				cellspacing: '0'
			}
		});
		var tBody = new Element('tbody').inject(formTable);
		var form = new Element('form').addEvent('submit', function(e){
			this.getResults(e.target, picklet);
		}.bind(this)).adopt(formTable).set('action','javascript:void(0);');
		$each(picklet.options.inputs, function(val, name){
			var ins = this.getSearchInputTr(val, name);
			tBody.adopt(ins.holder);
			picklet.inputElements[name] = ins.input;
		}, this);
		return form;
	},
	getSearchInputTr: function(val, name){
		try{
			var style = ($type(val.style))?val.style:{};
			//create the input object
			//this is I.E. hackery, because IE does not let you set the name of a DOM element.
			//thanks MSFT.
			var input = (Browser.Engine.trident)?new Element('<' + val.tagName + ' name="' + name + '" />'):
					new Element(val.tagName, {name: name});
			input.setStyles(style);
			if (val.type)input.set('type', val.type);
			if (val.tip && Tips){
				input.set('title', val.tip);
				new Tips([input], {
					onShow: function(tip){
						this.shown = true;
						(function(){
              if (!this.shown) return;
              $(tip).setStyles({ display:'block', opacity: 0 });
              new Fx.Tween(tip, {property: 'opacity', duration: 300 }).start(0,.9);
            }).delay(500, this);
          },
          onHide: function(tip){
            tip.setStyle('visibility', 'hidden');
            this.shown = false;
          }
        });
      }
      if (val.tagName == "select"){
        val.value.each(function(option, index){
          var opt = new Element('option',{ value: option });
          opt.text = (val.optionNames && val.optionNames[index])?$pick(val.optionNames[index], option):option;
          input.adopt(opt);
        });
      } else {
				input.set('value', $pick(val.value,""));
			}
      var holder = new Element('tr');
			var colspan=0;
			if (val.instructions) holder.adopt(new Element('td').set('html', val.instructions));
			else colspan=2;
			var inputTD = new Element('td').adopt(input);
			if (colspan) inputTD.set('colspan', colspan);
			holder.adopt(inputTD);
			return { holder : holder, input : input};
		}catch(e){dbug.log(e); return false;}
	},
	getResults: function(form, picklet){
		if (form.get('tag') != "form") form = $$('form').filter(function(fm){ return fm.hasChild(form) })[0];
		if (!form) {
			dbug.log('error computing form');
			return null;
		}
		var query = picklet.getQuery(unescape(form.toQueryString()).parseQueryString());
		query.addEvent('onComplete', this.showResults.bind(this));
		query.send();
		return this;
	},
	showResults: function(data){
		var empty = false;
		if (this.results.innerHTML=='') {
			empty = true;
			this.results.setStyles({
				height: 0,
				border: '1px solid #666',
				padding: 0,
				overflow: 'auto',
				opacity: 0
			});
		} else this.results.empty();
		this.items = this.currentPicklet.options.resultsList(data);
		if (this.items && this.items.length > 0) {
			this.items.each(function(item, index){
				var name = this.currentPicklet.options.listItemName(item);
				var value = this.currentPicklet.options.listItemValue(item);
				this.results.adopt(this.makeProductListEntry(name, value, index));
			}, this);
		} else {
			this.results.set('html', "Sorry, there don't seem to be any items for that search");
		}
		this.results.morph({ height: 200, opacity: 1 });
		this.listStyles();
		this.getOnScreen.delay(500, this);
	},
	getOnScreen: function(){
		if (document.compatMode == "BackCompat") return;
		var s = this.swin.win.getCoordinates();
		if (s.top < window.getScroll().y) {
			this.swin.win.tween('top', window.getScroll().y+50);
			return;
		}
		if (s.top+s.height > window.getScroll().y+window.getSize().y && window.getSize().y>s.height) {
			this.swin.win.tween('top', window.getScroll().y+window.getSize().y-s.height-100);
			return;
		}
		try{this.swin.shim.show.delay(500, this.swin.shim);}catch(e){}
		return;
	},
	listStyles: function(){
		var defaultStyle = {
			cursor: 'pointer',
			borderBottom: '1px solid #ddd',
			padding: '2px 8px 2px 8px',
			backgroundColor:'#fff',
			color: '#000',
			fontWeight: 'normal'
		};
		var hoverStyle = {
			backgroundColor:'#fcfbd1',
			color: '#d56a00'
		};
		var selectedStyle = $extend(defaultStyle, {
			color: '#D00000',
			fontWeight: 'bold',
			backgroundColor: '#eee'
		});
		this.results.getElements('div.productPickerProductDiv').each(function(p){
			var useStyle = (this.input.value.toInt() == p.get('val').toInt())?selectedStyle:defaultStyle;
			p.setStyles(useStyle);
			if (!Browser.Engine.trident) {//ie doesn't like these mouseover behaviors...
				p.addEvent('mouseover', function(){ p.setStyles(hoverStyle); }.bind(this));
				p.addEvent('mouseout', function(){ p.setStyles(useStyle); });
			}
		}, this);
	},
	makeProductListEntry: function(name, value, index){
		var pDiv = new Element("div").addClass('productPickerProductDiv').adopt(
				new Element("div").set('html', name)
			).set('val', value);
		pDiv.addEvent('mouseenter', function(e){
			this.preview = true;
			this.sliderContent.empty();
			var content = this.getPreview(index);
			if ($type(content)=="string") this.sliderContent.set('html', content);
			else if ($(content)) this.sliderContent.adopt(content);
			this.showPreview.delay(200, this);
		}.bind(this));
		pDiv.addEvent('mouseleave', function(e){
			this.preview = false;
			(function(){if (!this.previewHover) this.hidePreview();}).delay(400, this);
		}.bind(this));
		pDiv.addEvent('click', function(){
			this.currentPicklet.options.updateInput(this.input, this.items[index]);
			this.fireEvent('onPick', [this.input, this.items[index], this]);
			this.hide();
			this.listStyles.delay(200, this);
		}.bind(this));
		return pDiv;
	},
	makeStickyWin: function(){
		if (document.compatMode == "BackCompat") this.options.stickyWinOptions.relativeTo = this.input;
		this.swin = new this.options.stickyWinToUse($merge(this.options.stickyWinOptions, {
			draggable: true,
			content: this.buildPicker()
		}));
	},
	focusInput: function(force){
		if ((!this.focused || $pick(force,false)) && this.form.getElement('input')) {
			this.focused = true;
			try { this.form.getElement('input').focus(); } catch(e){}
		}
	},
	show: function(){
		if (!this.swin) this.makeStickyWin();
		if (!this.slider) this.makeSlider();
		if (!this.swin.visible) this.swin.show();
		this.focusInput();
		return this;
	},
	hide: function(){
		$$('.tool-tip').hide();
		this.swin.hide();
		this.focused = false;
		return this;
	},
	setUpObservers: function(){
		try {
			if (this.options.showOnFocus) this.input.addEvent('focus', this.show.bind(this));
			if (this.options.additionalShowLinks.length>0) {
				this.options.additionalShowLinks.each(function(lnk){
					$(lnk).addEvent('click', this.show.bind(this));
				}, this);
			}
		}catch(e){dbug.log(e);}
	},
	showPreview: function(index){
		width = this.currentPicklet.options.previewWidth || 150;
		this.sliderContent.setStyle('width', (width-30));
		if (!this.sliderFx) this.sliderFx = new Fx.Elements([this.slider, this.swin.win]);
		this.sliderFx.clearChain();
		this.sliderFx.setOptions({
			duration: 1000, 
			transition: 'elastic:out'
		});
		if (this.preview && this.slider.getStyle('width').toInt() < width-5) {
			this.slider.show('block');
			this.sliderFx.start({
				'0':{//the slider
					'width':width
				},
				'1':{//the popup window (for ie)
					'width':width+this.options.stickyWinUiOptions.width
				}
			});
		}
	},
	hidePreview: function(){
		if (!this.preview) {
			this.sliderFx.setOptions({
				duration: 250, 
				transition: 'back:in'
			});
			this.sliderFx.clearChain();
			this.sliderFx.start({
				'0':{//the slider
					'width':[this.slider.getStyle('width').toInt(),0]
				},
				'1':{//the popup window (for ie)
					'width':[this.swin.win.getStyle('width').toInt(), this.options.stickyWinUiOptions]
				}
			}).chain(function(){
				this.slider.hide();
			}.bind(this));
		}
	},
	getPreview: function(index){
		return this.currentPicklet.options.previewHtml(this.items[index]);
	}
});


$extend(ProductPicker, {
	picklets: [],
	add: function(picklet){
		if (! picklet.className) {
			dbug.log('error: cannot add Picklet %o; missing className: %s', picklet, picklet.className);
			return;
		}
		this.picklets[picklet.className] = picklet;
	},
	addAllThese: function(picklets){
		picklets.each(function(picklet){
			this.add(picklet);
		}, this);
	},
	getPicklet: function(className){
		return ProductPicker.picklets[className]||false;
	}
});

var FormPickers = new Class({
	Implements: [Options],
	options: {
		inputs: 'input',
		additionalShowLinkClass: 'openPicker',
		pickletOptions: {}
	},
	initialize: function(form, options){
		this.setOptions(options);
		this.form = $(form);
		this.inputs = this.form.getElements(this.options.inputs);
		this.setUpInputs();
	},
	setUpInputs: function(inputs){
		inputs = $pick(inputs, this.inputs);
		inputs.each(this.addPickers.bind(this));
	},
	addPickers: function(input){
		var picklets = [];
		input.className.split(" ").each(function(clss){
			if (ProductPicker.getPicklet(clss)) picklets.push(ProductPicker.getPicklet(clss));
		}, this);
		if (input.getNext() && input.getNext().hasClass(this.options.additionalShowLinkClass))
			this.options.pickletOptions.additionalShowLinks = [input.getNext()];
		if (picklets.length>0)	new ProductPicker(input, picklets, this.options.pickletOptions);
	}
});
/*
Script: StickyWin.Modal.js

This script extends StickyWin and StickyWin.Fx classes to add Modalizer functionality.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Modal = new Class({

	Extends: StickyWin,

	Implements: Modalizer,

	initialize: function(options){
		options = options||{};
		this.setModalOptions($merge(options.modalOptions||{}, {
			onModalHide: function(){
					this.hide(false);
				}.bind(this)
			}));
		this.parent(options);
	},

	show: function(showModal){
		if ($pick(showModal, true)) {
			this.modalShow();
			if (this.modalOptions.elementsToHide) this.win.getElements(this.modalOptions.elementsToHide).setStyle('opacity', 1);
		}
		this.parent();
	},

	hide: function(hideModal){
		if ($pick(hideModal, true)) this.modalHide();
		else this.parent();
	}

});

/*
Script: StickyWin.Ajaxjs

Adds ajax functionality to all the StickyWin classes.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	var SWA = function(extend){
		return {
			Extends: extend,
			options: {
				url: '',
				showNow: false,
				requestOptions: {
					method: 'get',
					evalScripts: true
				},
				wrapWithUi: false, 
				caption: '',
				uiOptions:{},
				handleResponse: function(response){
					var responseScript = "";
					this.Request.response.text.stripScripts(function(script){	responseScript += script; });
					if (this.options.wrapWithUi) response = StickyWin.ui(this.options.caption, response, this.options.uiOptions);
					this.setContent(response);
					this.show();
					if (this.evalScripts) $exec(responseScript);
				}
			},
			initialize: function(options){
				var showNow;
				if (options && options.showNow) {
					showNow = true;
					options.showNow = false;
				}
				this.parent(options);
				this.evalScripts = this.options.requestOptions.evalScripts;
				this.options.requestOptions.evalScripts = false;
				this.createRequest();
				if (showNow) this.update();
			},
			createRequest: function(){
				this.Request = new Request(this.options.requestOptions).addEvent('onSuccess',
					this.options.handleResponse.bind(this));
			},
			update: function(url, options){
				this.Request.setOptions(options).send({url: url||this.options.url});
				return this;
			}
		};
	};
	try {	StickyWin.Ajax = new Class(SWA(StickyWin)); } catch(e){}
	try {	StickyWin.Modal.Ajax = new Class(SWA(StickyWin.Modal)); } catch(e){}
})();
/*
Script: Fupdate.Prompt.js
	Prompts the user with the contents of a form (retrieved via ajax) and updates a DOM element with the result of the submission.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	
	var prompter = function(ext){
		return {
			Extends: ext,
			options: {
				//onUpdate: $empty,
				stickyWinToUse: StickyWin.Modal,
				stickyWinOptions: {},
				useUi: true,
				stickyWinUiOptions: {
					width: 500
				},
				useWaiter: true
			},
			initialize: function(form, update, options){
				this.setOptions(options);
				this.update = $(update);
				this.makeStickyWin(form);
				this.swin.addEvent('close', function(){
					if (this.request && this.request.waiter) this.request.waiter.stop();
				});
				this.addEvent('success', this.hide.bind(this));
			},
			makeStickyWin: function(form){
				if ($(form)) form = $(form);
				this.swin = new this.options.stickyWinToUse({
					content: this.options.useUi?StickyWin.ui('Update Info', form, this.options.stickyWinUiOptions):form,
					showNow: false
				});
				this.element = this.swin.win.getElement('form');
				this.initAfterUpdate();
			},
			hide: function(){
				this.swin.hide();
				return this;
			},
			prompt: function(){
				this.swin.show();
				return this;
			},
			initAfterUpdate: function(){
				this.setOptions({
					requestOptions: {
						useWaiter: this.options.useWaiter,
						waiterTarget: $(this),
						waiterOptions: {
							layer: {
								styles: {
									zIndex: 10001
								}
							}
						}
					}
				});
				this.makeRequest();
				this.addFormEvent();
				$(this).store('fupdate', this);
			}
		};
	};
	
	Fupdate.Prompt = new Class(prompter(Fupdate));
	if (Fupdate.Append) Fupdate.Append.Prompt = new Class(prompter(Fupdate.Append));
	
	
	var ajaxPrompter = function(ext) {
		return {
			Extends: ext,
			options: {
				stickyWinToUse: StickyWin.Modal.Ajax
			},
			makeStickyWin: function(formUrl){
				if (this.swin) return this.swin;
				this.swin = new this.options.stickyWinToUse($merge({
					showNow: false,
					requestOptions: this.options.requestOptions,
					onHide: function(){
						this.win.empty();
					},
					url: formUrl,
					handleResponse: function(response) {
						var responseScript = "";
						this.swin.Request.response.text.stripScripts(function(script){	responseScript += script; });
						var content = this.options.useUi?StickyWin.ui('Update Info', response, this.options.stickyWinUiOptions):response;
						this.swin.setContent(content);
						this.element = this.swin.win.getElement('form');
						this.initAfterUpdate();
						this.swin.show();
						if (this.options.requestOptions.evalScripts) $exec(responseScript);
					}.bind(this)
				}, this.options.stickyWinOptions));
				return this.swin;
			},
			prompt: function(){
				this.makeStickyWin().update();
				return this;
			}
		};
	};

	Fupdate.AjaxPrompt = new Class(ajaxPrompter(Fupdate.Prompt));
	if (Fupdate.Append) Fupdate.Append.AjaxPrompt = new Class(ajaxPrompter(Fupdate.Append.Prompt));
})();
/*
Script: DatePicker.Extras.js
	Extends DatePicker to allow for range selection and time entry.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
DatePicker = Class.refactor(DatePicker, {
	options:{
		extraCSS: 'a.finish {position: relative;height: 13px !important;top: -31px !important;left: 85px !important;top: -34px;left: 77px;height: 16px;display:block;float: left;padding: 1px 12px 3px !important;}'+
			'div.calendarHolder div.time {border: #999 1px solid;width: 55px;position: relative;left: 3px;height: 17px;}'+
			'div.calendarHolder td.timeTD {width: 140px;} div.calendarHolder td.label{width:35px; text-align:right}'+
			'div.calendarHolder div.time select {font-size: 10px !important; font-size: 15px;padding: 0px;left:60px;position:absolute;top:-1px !important; width: auto !important;}'+
			'div.calendarHolder div.time input {width: 16px !important;width: 12px;padding: 2px;height: 13px;border: none !important;border: 1px solid #fff;}'+
			'div.calendarHolder div.timeSub {clear:both;position: relative;width: 65px;}'+
			'div.calendarHolder div.timeSub span {text-align: center;color: #999;margin: 5px;}'+
			'div.calendarHolder span.seperator {position:relative;top:-3px;}'+
			'div.calendarHolder table.stamp {position:relative;top: 35px !important;top: 50px;left: 0px;}'+
			'div.calendarHolder table.stamp a {left:123px;position:relative;top:9px;}'+
			'div.calendarHolder table.stamp td {border: none !important;}'+
			'div.calendarHolder td.selected_end {border-width: 1px 1px 1px 0px !important;margin: 0px 0px 0px 1px !important;}'+
			'div.calendarHolder td.selected_start {border-width: 1px 0px 1px 1px !important;margin: 0px 1px 0px 0px !important;}'+
			'div.calendarHolder table.datePicker td.range {background: #dcddef;border: solid #20397b;border-width: 1px 0px;margin: 0px 1px !important;}',
		range: false,
		time: false
	},
	initialize: function(inputs, options){
		if (options && (options.range || options.time)) {
			options = $merge({
				hideCalendarOnPick: false
			}, options);
		}
		if (options && options.time && !options.format) {
			options.format = "%x %X";
		}
		this.setOptions(options);
		this.whens = (this.options.range)?['start', 'end']:['start'];
		if ($type(inputs) == 'object') {
			this.inputs = $H(inputs);
		} else if ($type($(inputs)) == "element") {
			this.inputs = $H({'start': $(inputs)});
		} else if ($type(inputs) == "array"){
			inputs = $$(inputs);
			this.inputs = $H({});
			this.whens.each(function(when, i){
				this.inputs.set(when, inputs[i]);
			}, this);
		}
		if (this.options.time) this.calWidth = 460;
		this.previous(inputs, this.options);
		this.createStyle(this.options.extraCSS, 'datePickerPlusStyle');
		this.addEvent('rowDateEvaluated', function(atDate, td){
			if (this.options.range && this.selectedDates.start.diff(atDate, 'minute') > 0 
					&& this.selectedDates.end.diff(atDate, 'minute') < 0) td.addClass('range');
		}.bind(this));
		this.addEvent('selectedDateMatch', function(td, when){
			if (this.options.range) td.addClass('selected_'+when);
		}.bind(this));
	},
	updateInput: function(){
		this.previous();
		if (this.options.time) this.updateView();
	},
	updateView: function() {
		this.whens.each(function(when){
			var stamp = this.stamps[when];
			var date = this.getDates()[when];
			stamp.date.set('html', date?date.format("%b. %d, %Y"):"");
			if (stamp.hr) {
				stamp.hr.set('value', date?date.format("%I"):"");
				stamp.min.set('value', date?date.format("%M"):"");
			}
		}, this);
	},
	stamps: {},
	setupWideView: function(){
		var timeStampMap = {
			hr: '%I',
			'min': '%M'
		};
		timeSetMap = {
			hr: 'setHours',
			'min':'setMinutes'
		};
		var dates = this.getDates();
	
		if (!this.options.range && !this.options.time) return;
		this.stamps.table = new Element('table', {
			'class':'stamp'
		}).inject(this.container);
		this.stamps.tbody = new Element('tbody').inject(this.stamps.table);
		this.whens.each(function(when){
			this.stamps[when] = {};
			var s = this.stamps[when]; //saving some bytes
			s.container = new Element('tr').addClass(when+'_stamp').inject(this.stamps.tbody);
			s.label = new Element('td').inject(s.container).addClass('label');
			if (this.whens.length == 1) {
				s.label.set('html', 'date:');
			} else {
				s.label.set('html', when=="start"?"from:":"to:");
			}
			s.date = new Element('td').inject(s.container);
			if (this.options.time) {
				currentWhen = dates[when]||new Date();
				s.time = new Element('tr').inject(this.stamps.tbody);
				new Element('td').inject(s.time);
				s.timeTD = new Element('td').inject(s.time);
				s.timeInputs = new Element('div').addClass('time clearfix').inject(s.timeTD);
				s.timeSub = new Element('div', {'class':'timeSub'}).inject(s.timeTD);
				['hr','min'].each(function(t, i){
					s[t] = new Element('input', {
						type: 'text',
						'class': t,
						name: t,
						events: {
							focus: function(){
								this.select();
							},
							change: function(){
								this.selectedDates[when][timeSetMap[t]](s[t].get('value'));
								this.selectedDates[when].setAMPM(s.ampm.get('value'));
								this.updateInput();
							}.bind(this)
						}
					}).inject(s.timeInputs);
					s[t].set('value', currentWhen.format(timeStampMap[t]));
					if (i < 1) s.timeInputs.adopt(new Element('span', {'class':'seperator'}).set('html', ":"));
					new Element('span', {
						'class': t
					}).set('html', t).inject(s.timeSub);
				}, this);
				s.ampm = new Element('select').inject(s.timeInputs);
				['AM','PM'].each(function(ampm){
					var opt = new Element('option', {
						value: ampm,
						text: ampm.toLowerCase()
					}).set('html', ampm).inject(s.ampm);
					if (ampm == currentWhen.format("%p")) opt.selected = true;
				});
				s.ampm.addEvent('change', function(){
					var date = this.getDates()[when];
					var ampm = s.ampm.get('value');
					if (ampm != date.format("%p")) {
						date.setAMPM(ampm);
						this.updateInput();
					}
				}.bind(this));
			}
		}, this);
		new Element('tr').inject(this.stamps.tbody).adopt(new Element('td', {colspan: 2}).adopt(new Element('a', {
			'class':'closeSticky button',
			events: {
				click: function(){
					this.hide();
				}.bind(this)
			}
		}).set('html', 'Ok')));
	},
	show: function(){
		this.previous();
		if (this.options.time) {
			if (!this.stamps.table) this.setupWideView();
			this.updateView();
		}
	},
	startSet: false,
	onPick: function(){
		if ((this.options.range && this.selectedDates.start && this.selectedDates.end) || !this.options.range) {
			this.previous();
		}
	},
	setSelectedDates: function(e, newDate) {
		if (this.options.range) {
			if (this.selectedDates.start && this.startSet) {
				if (this.selectedDates.start.getTime() > newDate.getTime()){
					this.selectedDates.end = new Date(this.selectedDates.start);
					this.selectedDates.start = newDate;
				} else {
					this.selectedDates.end = newDate;
				}
				this.startSet = false;
			} else {
				this.selectedDates.start = newDate;
				if (this.selectedDates.end && this.selectedDates.start.getTime() > this.selectedDates.end.getTime())
					this.selectedDates.end = new Date(newDate);
				this.startSet = true;
			}
		} else {
			this.previous(e, newDate);
		}
		if (this.options.time) {
			this.whens.each(function(when){
				var hr = this.stamps[when].hr.get('value').toInt();
				if (this.stamps[when].ampm.get('value') == "PM" && hr < 12) hr += 12;
				this.selectedDates[when].setHours(hr);
				this.selectedDates[when].setMinutes(this.stamps[when]['min'].get('value')||"0");
				this.selectedDates[when].setAMPM(this.stamps[when].ampm.get('value')||"AM");
			}, this);
		}
	}
});
/*
Script: FixPNG.js
	Extends the Browser hash object to include methods useful in managing the window location and urls.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
$extend(Browser, {
	fixPNG: function(el) {
		try {
			if (Browser.Engine.trident4){
				el = $(el);
				if (!el) return el;
				if (el.get('tag') == "img" && el.get('src').test(".png")) {
					var vis = el.isDisplayed();
					try { //safari sometimes crashes here, so catch it
						dim = el.getSize();
					}catch(e){}
					if (!vis){
						var before = {};
						//use this method instead of getStyles 
						['visibility', 'display', 'position'].each(function(style){
							before[style] = this.style[style]||'';
						}, this);
						//this.getStyles('visibility', 'display', 'position');
						this.setStyles({
							visibility: 'hidden',
							display: 'block',
							position:'absolute'
						});
						dim = el.getSize(); //works now, because the display isn't none
						this.setStyles(before); //put it back where it was
						el.hide();
					}
					var replacement = new Element('span', {
						id:(el.id)?el.id:'',
						'class':(el.className)?el.className:'',
						title:(el.title)?el.title:(el.alt)?el.alt:'',
						styles: {
							display: vis?'inline-block':'none',
							width: dim.x,
							height: dim.y,
							filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='" 
								+ el.src + "', sizingMethod='scale');"
						},
						src: el.src
					});
					if (el.style.cssText) {
						try {
							var styles = {};
							var s = el.style.cssText.split(';');
							s.each(function(style){
								var n = style.split(':');
								styles[n[0]] = n[1];
							});
							replacement.setStyle(styles);
						} catch(e){ dbug.log('fixPNG1: ', e)}
					}
					if (replacement.cloneEvents) replacement.cloneEvents(el);
					replacement.replaces(el);
				} else if (el.get('tag') != "img") {
				 	var imgURL = el.getStyle('background-image');
				 	if (imgURL.test(/\((.+)\)/)){
				 		el.setStyles({
				 			background: '',
				 			filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='crop', src=" + imgURL.match(/\((.+)\)/)[1] + ")"
				 		});
				 	};
				}
			}
		} catch(e) {dbug.log('fixPNG2: ', e)}
	},
  pngTest: /\.png$/, // saves recreating the regex repeatedly
  scanForPngs: function(el, className) {
    className = className||'fixPNG';
    //TODO: should this also be testing the css background-image property for pngs?
    //Q: should it return an array of all those it has tweaked?
    if (document.getElements){ // more efficient but requires 'selectors'
      el = $(el||document.body);
      el.getElements('img[src$=.png]').addClass(className);
    } else { // scan the whole page
      var els = $$('img').each(function(img) {
        if (Browser.pngTest(img.src)){
          img.addClass(className);
        }
      });
    }
  }
});
if (Browser.Engine.trident4) window.addEvent('domready', function(){$$('img.fixPNG').each(Browser.fixPNG)});

/*
Script: Popup.js
	Defines the Popup class useful for making popup windows.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Browser.Popup = new Class({
	Implements:[Options, Events],
	options: {
		width: 500,
		height: 300,
		x: 50,
		y: 50,
		toolbar: 0,
		location: 0,
		directories: 0,
		status: 0,
		scrollbars: 'auto',
		resizable: 1,
		name: 'popup'
//	onBlock: $empty
	},
	initialize: function(url, options){
		this.url = url || false;
		this.setOptions(options);
		if (this.url) this.openWin();
	},
	openWin: function(url){
		url = url || this.url;
		var options = 'toolbar='+this.options.toolbar+
			',location='+this.options.location+
			',directories='+this.options.directories+
			',status='+this.options.status+
			',scrollbars='+this.options.scrollbars+
			',resizable='+this.options.resizable+
			',width='+this.options.width+
			',height='+this.options.height+
			',top='+this.options.y+
			',left='+this.options.x;
		this.window = window.open(url, this.options.name, options);
		if (!this.window) {
			this.window = window.open('', this.options.name, options);
			this.window.location.href = url;
		}
		this.focus.delay(100, this);
		return this;
	},
	focus: function(){
		if (this.window) this.window.focus();
		else if (this.focusTries<10) this.focus.delay(100, this); //try again
		else {
			this.blocked = true;
			this.fireEvent('onBlock');
		}
		return this;
	},
	focusTries: 0,
	blocked: null,
	close: function(){
		this.window.close();
		return this;
	}
});
/*
Script: PopupDetails.js
	Creates hover detail popups for a collection of elements and data.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var PopupDetail = new Class({
	Implements: [Options, Events],
	visible: false,
	observed: false,
	hasData: false,
	options: {
		observerAction: 'mouseenter', //or click
		closeOnMouseOut: true,
		linkPopup: false, //or true to use observer href, or url
		data: {}, //key/value parse to parse in to html
		templateOptions: {}, //see simple template parser
		useAjax: false,
		ajaxOptions:{
			method: 'get'
		},
		ajaxLink: false, //defaults to use observer.src
		ajaxCache: {},
		delayOn: 100,
		delayOff: 100,
		stickyWinOptions:{},
//	stickyWinToUse: null,
		showNow: false,
		htmlResponse: false,
		regExp: /\\?%([^%]+)%/g
/*	onPopupShow: $empty,
		onPopupHide: $empty */
	},
	initialize: function(html, observer, options){
		this.setOptions(options);
		try {
			this.options.stickyWinToUse = this.options.stickyWinToUse || StickyWin.Fx;
		} catch(e) {
			this.options.stickyWinToUse = StickyWin;
		}
		this.observer = $(observer);
		this.html = ($(html))?$(html).get('html'):html||'';
		if (this.options.showNow) this.show.delay(this.options.delayOn, this);
		this.setUpObservers();
	},
	setUpObservers: function(){
		var opt = this.options; //saving bytes here
		this.observer.addEvent(opt.observerAction, function(){
			this.observed = true;
			this.show.delay(opt.delayOn, this);
		}.bind(this));
		if ((opt.observerAction == "mouseenter" || opt.observerAction == "mouseover") && this.options.closeOnMouseOut){
			this.observer.addEvent("mouseleave", function(){
				this.observed = false;
				this.hide.delay(opt.delayOff, this);
			}.bind(this));
		}
		return this;
	},
	parseTemplate: function(string, values){
		return string.substitute(values, this.options.regExp);
	},
	makePopup: function(){
		if (!this.stickyWin){
			var opt = this.options;//saving bytes
			if (opt.htmlResponse) this.content = this.data;
			else this.content = this.parseTemplate(this.html, opt.data);
			this.stickyWin = new opt.stickyWinToUse($merge(opt.stickyWinOptions, {
				relativeTo: this.observer,
				showNow: false,
				content: this.content,
				allowMultipleByClass: true
			}));
			if ($(opt.linkPopup) || $type(opt.linkPopup)=='string') {
				this.stickyWin.win.setStyle('cursor','pointer').addEvent('click', function(){
					window.location.href = ($type(url)=='string')?url:url.src;
				});
			}
			this.stickyWin.win.addEvent('mouseenter', function(){
				this.observed = true;
			}.bind(this));
			this.stickyWin.win.addEvent('mouseleave', function(){
				this.observed = false;
				if (opt.closeOnMouseOut) this.hide.delay(opt.delayOff, this);
			}.bind(this));
		}
		return this;
	},
	getContent: function(){
		try {
			new Request($merge(this.options.ajaxOptions, {
					url: this.options.ajaxLink || this.observer.href,
					onSuccess: this.show.bind(this)
				})
			).send();
		} catch(e) {
			dbug.log('ajax error on PopupDetail: %s', e);
		}
	},
	show: function(data){
		var opt = this.options;
		if (data) this.data = data;
		if (this.observed && !this.visible) {
			if (opt.useAjax && !this.data) {
				var cachedVal = opt.ajaxCache[this.options.ajaxLink] || opt.ajaxCache[this.observer.href];
				if (cachedVal) {
					this.fireEvent('onPopupShow', this);
					return this.show(cachedVal);
				}
				this.cursorStyle = this.observer.getStyle('cursor');
				this.observer.setStyle('cursor', 'wait');
				this.getContent();
				return false;
			} else {
				if (this.cursorStyle) this.observer.setStyle('cursor', this.cursorStyle);
				if (opt.useAjax && !opt.htmlResponse) opt.data = JSON.decode(this.data);
				this.makePopup();
				this.fireEvent('onPopupShow', this);
				this.stickyWin.show();
				this.visible = true;
				return this;
			}
		}
		return this;
	},
	hide: function(){
		if (!this.observed){
			this.fireEvent('onPopupHide');
			if (this.stickyWin)this.stickyWin.hide();
			this.visible = false;
		}
		return this;
	}
});

var PopupDetailCollection = new Class({
	Implements: [Options],
	options: {
		details: {},
		links: [],
		ajaxLinks: [],
		useCache: true,
		template: '',
		popupDetailOptions: {}
	},
	cache: {},
	initialize: function(observers, options) {
		this.observers = $$(observers);
		this.setOptions(options);
		var ln = this.options.ajaxLinks.length;
		if (ln <= 0) ln = this.options.details.length;
		if (this.observers.length != ln) 
			dbug.log("warning: observers and details are out of sync.");
		this.makePopupDetails();
	},
	makePopupDetails: function(){
		this.popupDetailObjs = this.observers.map(function(observer, index){
			var opt = this.options.popupDetailOptions;//saving bytes
			var pd = new PopupDetail(this.options.template, observer, $merge(opt, {
				data: $pick(this.options.details[index], {}),
				linkItem: $pick(this.options.links[index], $pick(opt.linkItem, false)),
				ajaxLink: $pick(this.options.ajaxLinks[index], false),
				ajaxCache: (this.options.useCache)?this.cache:{},
				useAjax: this.options.ajaxLinks.length>0
			}));
			return pd;
		}, this);
	}
});

/*
Script: ObjectBrowser.js
	Creates a tree view of any javascript object.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var ObjectBrowser = new Class({
	Implements: [Options, Events],
	options: {
//	onLeafClick: $empty,
		onBranchClick: function(data){
			this.showLevel(data.path?data.path+'.'+data.key:data.key, data.nodePath);
		},
		initPath: '',
		buildOnInit: true,
		data: {},
		excludeKeys: [],
		includeKeys: []
	},
	initialize: function(container, options){
		this.container = $(container);
		this.setOptions(options);
		this.data = $H(this.options.data);
		this.levels = {};
		this.elements = {};
		if (this.options.buildOnInit) this.showLevel(this.options.initPath, this.container);
	},
	toElement: function(){
		return this.container;
	},
	//gets a member of the object by path; eg "fruits.apples.green" will return the value at that path.
	//path - the string path
	//parent - (boolean) if true, will return the parent of the item found ( in the example above, fruits.apples)
	getMemberByPath: function(path, parent){
		if (path === "" || path == "top") return this.data.getClean();
		var h = parent?$H(parent):this.data;
		return h.getFromPath(path);
	},
	//replaceMemberByPath will set the location at the path to the value passed in
	replaceMemberByPath: function(path, value){
		if (path === "" || path == "top") return this.data = $H(value);
		var parentObj = this.getMemberByPath( path, true );
		parentObj[path.split(".").pop()] = value;
		return this.data;
	},
	//gets the path for a given dom node.
	getPathByNode: function(el) {
		return $H(this.elements).keyOf(el);
	},
	//validates that a key is a valid node value
	//against options.includeKeys and options.excludeKeys
	validLevel: function(key){
		return (!this.options.excludeKeys.contains(key) && 
			 (!this.options.includeKeys.length || this.options.includeKeys.contains(key)));
	},
	//builds a level into the interface given a path
	buildLevel:function(path) {
		//if the path ends in a dot, remove it
		if (path.test(".$")) path = path.substring(0, path.length);
		//get the corresponding level for the path
		var level = this.getMemberByPath(path);
		//if the path already has been built, return
		if (this.levels[path]) return this.levels[path];
		//create the section
		var section = new Element('ul');
		switch($type(level)) {
			case "function":
					this.buildNode(level, "function()", section, path, true);
				break;
			case "string": case "number":
					this.buildNode(level, null, section, path, true);
				break;
			case "array":
				level.each(function(node, index){
					this.buildNode(node, index, section, path, ["string", "function"].contains($type(node)));
				}.bind(this));
				break;
			default:
				$H(level).each(function(value, key){
					var db = false;
					if (key == "element_dimensions") db = true;
					if (db) dbug.log(key);
					if (this.validLevel(key)) {
						if (db) dbug.log('is valid level');
						var isLeaf;
						if ($type(value) == "object") {
							isLeaf = false;
							$each(value, function(v, k){
								if (this.validLevel(k)) {
									if (db) dbug.log('not a leaf!');
									isLeaf = false;
								} else {
									isLeaf = true;
								}
							}, this);
							if (isLeaf) value = false;
						}
						if (db) dbug.log(value, key, section, path, $chk(isLeaf)?isLeaf:null);
						this.buildNode(value, key, section, path, $chk(isLeaf)?isLeaf:null);
					}
				}, this);
		}
		//set the resulting DOM element to the levels map
		this.levels[path] = section;
		//return the section
		return section;
	},
	//gets the parent node for an element
	getParentFromPath: function(path){
		return this.elements[(path || "top")+'NODE'];
	},
	//displays a level given a path
	//if the level hasn't been built yet,
	//the level is built and then injected
	//into the target using the given method
	//example:
	//showLevel("fruit.apples", "fruit", "injectInside");
	//note that target and method are set to the parent path and injectInside by default
	showLevel: function(path, target, method){
		target = target || path;
		if (! this.elements[path]) 
			this.elements[path] = this.buildLevel(path)[method||"inject"](this.elements[target]||this.container);
		else this.elements[path].toggle();
		dbug.log('toggle class');
		this.elements[path].getParent().toggleClass('collapsed');
		return this;
	},
	//builds a node given the arguments:
	//value - the value of the node
	//key - the key of the node
	//section - the container where this node goes; typically a section generated by buildLevel
	//path - the path to this node
	//leaf - boolean; true if this is a leaf node
	//note: if the key or the value is an empty string, leaf will be set to true.
	buildNode: function(value, key, section, path, leaf){
		if (key==="" || value==="") leaf = true;
		if (!this.validLevel(key)) return null;
		var nodePath = (path?path+'.'+key:key)+'NODE';
		var lnk = this.buildLink((leaf)?value||key:$chk(key)?key:value, leaf);
		var li = new Element('li').addClass((leaf)?'leaf':'branch collapsed').adopt(lnk).inject(section);
		lnk.addEvent('click', function(e){
			e.stopPropagation();
			if (leaf) {
				this.fireEvent('onLeafClick', {
					li: li, 
					key: key, 
					value: value, 
					path: path,
					nodePath: nodePath,
					event: e
				});
			} else {
				this.fireEvent('onBranchClick', {
					li: li, 
					key: key, 
					value: value, 
					path: path,
					nodePath: nodePath,
					event: e
				});
			}							
		}.bind(this));
		this.elements[nodePath] = li;
		return li;
	},
	//builds a link for a given key
	buildLink: function(key) {
		if ($type(key) == "function") {
			key = key.toString();
			key = key.substring(0, key.indexOf("{")+1)+"...";
		}
		return new Element('a', {
			href: "javascript: void(0);"
		}).set('html', key);
	}
});
/*
Script: IconMenu.js
	Defines IconMenu, a simple icon (img) based menu.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var IconMenu = new Class({
	Implements: [Options, Events],
	options: {
		container: document,
		images: ".iconImgs",
		captions: ".iconCaptions",
		removeLinks: false,
		clearLinks: false,
		useAxis: 'x',
		onFocusDelay: 0,
		initialFocusDelay: 250,
		onBlurDelay: 0,
		length: 'auto',
		iconPadding: 1,
		scrollFxOptions: {
			duration: 1800,
			transition: 'cubic:in:out'
		},
		backScrollButtons: '#scrollLeft',
		forwardScrollButtons: '#scrollRight',
		onSelect: function(index, img){
			img.morph({
					'border-top-color': '#00A0C6',
					'border-left-color': '#00A0C6',
					'border-right-color': '#00A0C6',
					'border-bottom-color': '#00A0C6'
			});
		},
		onDeSelect: function(index, img){
			img.morph({
					'border-top-color': '#555',
					'border-left-color': '#555',
					'border-right-color': '#555',
					'border-bottom-color': '#555'
			});
//		onFocus: $empty, //mouseover of target area
//		onBlur: $empty, //mouseout of target area
//		onEmpty: $empty,
//		onRemoveItem: $empty,
//		onRemoveItems: $empty,
//		onScroll: $empty,
//		onPageForward: $empty,
//		onPageBack: $empty,
		}
	},
	imgs: [],
	selected: [],
	initialize: function(options) {
		//set the options
		this.setOptions(options);
		//save a reference to the container
		this.container = $(this.options.container);
		//get the captions from the options
		var captions = ($type(this.options.captions) == "string")
			?this.container.getElements(this.options.captions)
			:this.options.captions;
		//get the images from the options
		var imgs = ($type(this.options.images) == "string")
			?this.container.getElements(this.options.images)
			:this.options.images;
		//loop through each one
		imgs.each(function(img, index) {
			//add it to the menu
			this.addItem(img, captions[index], null);
		}, this);
		
		this.fireEvent('onItemsAdded', this.imgs, 50);
		this.side = (this.options.useAxis == 'x')?'left':'top';
		this.container.setStyle(this.side, this.container.getStyle(this.side).toInt()||0);
		this.onFocusDelay = this.options.initialFocusDelay;
		//set up the events
		this.setupEvents();
	},
	toElement: function(){
		return this.container;
	},
	bound: {
			mouseover: {},
			mouseout: {}
	},
	scrollTo: function(index, useFx){
		//set useFx default to true
		useFx = $pick(useFx, true);
		//get the current range in view
		var currentRange = this.calculateRange();
		//if we're there, exit
		if (index == currentRange.start) return this;
		//get the range for the new position
		var newRange = this.calculateRange(index);
		//if this returns no items, exit
		if (!newRange.elements.length) return this; //no next page! >> Ajax here
		//make sure the container has a position set
		if (this.container.getStyle('position') == 'static') this.container.setStyle('position', 'relative');
		//create the scroll effects if not present already
		if (!this.scrollerFx) 
			this.scrollerFx = new Fx.Tween(this.container, $merge(this.options.scrollFxOptions, {property: this.side, wait: false}));
		//scroll to the new location
		if (useFx) {
			this.scrollerFx.start(-newRange.elements[0].offset).chain(function(){
			//set the index to be this new location
				this.fireEvent('onScroll', [index, newRange]);
			}.bind(this));
		} else {
			//we're not using effects, so just jump to the location
			this.scrollerFx.set(-newRange.elements[0].offset);
			this.fireEvent('onScroll', [index, newRange]);
		}
		this.currentOffset = index;
		return this;
	},
	pageForward: function(howMany){
		var range = this.calculateRange();
		return this.scrollTo(($type(howMany) == "number")?range.start+howMany:range.end);
	},
	pageBack: function(howMany) {
		return this.scrollTo(($type(howMany) == "number")?this.currentOffset-howMany:this.calculateRange(this.currentOffset, true).start);
	},
	addItem: function(img, caption, where) {
		if (caption) {
			img.store('caption', caption);
			caption.store('image', img);
		}
		//figure out where to put it
		where = ($defined(where))?where:this.imgs.length;
		//if we've already got this image in there, remove it before putting it in the right place
		if (this.imgs.contains(img)) this.removeItems([img], true);
		//insert the image and caption into the array of these things
		this.imgs.splice(where, 0, $(img));

		//set up the events for the element
		this.setupIconEvents(img, caption);
		this.fireEvent('onAdd', [img, caption]);
		return this;
	},
	removeItems: function(imgs, useFx){
		var range = this.calculateRange();
		if (!imgs.length) return this;;
		//create a copy; this is because
		//IconMenu.empty passes *this.selected*
		//which we modify in the process of removing things
		//so we must work on a copy of that so we don't change
		//the list as we iterate over it
		imgs = $A(imgs);
		//set the fx default
		useFx = $pick(useFx, true);
		//placeholder for the items we're removing; the effect will
		//only be applied to the dom element that contains the image and the caption
		var fadeItems = [];
		var fadeItemImgs = [];
		//the effect we'll use
		var effect = {
				width: 0,
				'border-width':0
		};
		//an object to store all the copies of the effect; one for each item to be passed
		//to Fx.Elements
		var fadeEffects = {};
		//for items that aren't in the current view, we're not going to use a transition
		var itemsToQuietlyRemove = {
			before: [],
			beforeImgs: [],
			after: [],
			afterImgs: []
		};
				
		//a list of all the icons by index
		var indexes = [];
		//for each image in the set to be removed
		imgs.each(function(image){
			var index = this.imgs.indexOf(image);
			//if the image is visible
			if (index >= range.end) {
				itemsToQuietlyRemove.after.push(image.getParent());
				itemsToQuietlyRemove.afterImgs.push(image);
			} else if (index < range.start) {
				itemsToQuietlyRemove.before.push(image.getParent());
				itemsToQuietlyRemove.beforeImgs.push(image);
			} else {
				//store the parent of the image
				fadeItems.push(image.getParent());
				fadeItemImgs.push(image);
				//copy the effect value for this item
				fadeEffects[fadeItems.length-1] = $unlink(effect);
			}
			//remove the reference in the selected array
			//because when it's gone, it won't be selected anymore
			this.selected.erase(image);
			//store the index of where this image was in the menu
			indexes.push(index);
		}, this);
		//for the list of images in the menu that were selected, remove them
		//we didn't do this earlier so we could avoid changing
		//the array while we were working on it
		this.imgs = this.imgs.filter(function(img, index){
			return !indexes.contains(index);
		});
		var removed = [];
		//items page left, remove them, but then we have to update the scroll offset to account
		//for their departure
		if (itemsToQuietlyRemove.before.length) {
			var scrollTo = this.imgs.indexOf(range.elements[0].image);
			itemsToQuietlyRemove.before.each(function(el, index){
				this.fireEvent('onRemoveItem', [el]);
				var img = itemsToQuietlyRemove.beforeImgs[index];
				removed.push(img);
				try {
					el.dispose();
					//scroll to the current offset again quickly
				}catch(e){ dbug.log('before: error removing element %o, %o', el, e); }
			}, this);
			this.scrollTo(scrollTo, false);
		}
		//for items page right, just remove them quickly and quietly
		itemsToQuietlyRemove.after.each(function(el, index){
			this.fireEvent('onRemoveItem', [el]);
			removed.push(itemsToQuietlyRemove.afterImgs[index]);
			try {
				el.dispose(); 
			}catch(e){ dbug.log('after: error removing element %o, %o', el, e); }
		});

		//define a function that removes all the items from the dom
		function clean(range, additionalItems){
			var items = [];
			//then fade out the items that are currently visible
			fadeItems.each(function(el, index){
				this.fireEvent('onRemoveItem', [el]);
				items.push(fadeItemImgs[index]);
				try {
					el.dispose(); 
				}catch(e){ dbug.log('fade: error removing element %o, %o', el, e); }
			}, this);
			items.combine(additionalItems);
			this.fireEvent('onRemoveItems', [items]);
			range = this.calculateRange();
			if (range.elements == 0 && range.start > 0) this.pageBack();
			//if there aren't any items left, fire the onEmpty event
			if (!this.imgs.length) this.fireEvent('onEmpty');
		}
		//if we're using effects, do the transition then call clean()
		if (useFx) new Fx.Elements(fadeItems).start(fadeEffects).chain(clean.bind(this, [range, removed]));
		//else just clean
		else clean.apply(this, [range, removed]);
		return this;
	},
	removeSelected: function(useFx){
		this.removeItems(this.selected, useFx);
		return this;
	},
	empty: function(suppressEvent){
		//placeholder for the effects and items
		var effect = {};
		var items = [];
		//loop through all the images in the icon menu
		this.imgs.each(function(img, index){
			//add the icon container to the list of items to remove
			items.push(img.getParent());
			//create a reference for each one to pass to Fx.Elements
			effect[index] = {opacity: 0};
		});
		//create an instance of Fx.Elements and fade them all out
		new Fx.Elements(items).start(effect).chain(function(){
			//then remove them all instantly
			this.removeItems(this.imgs, false);
			//and fire the onEmpty event
			if (!suppressEvent) this.fireEvent('onEmpty');
		}.bind(this));
		return this;
	},
	selectItem: function(index, select){
		//get the image to select
		var img = this.imgs[index];
		//add or remove the "selected" class
		if ($defined(select)) {
			if (select) img.addClass('selected');
			else img.removeClass('selected');
		} else {
			img.toggleClass('selected');
		}
		//if it has the class, then fade the border blue
		if (img.hasClass('selected')){
			//store this image in the index of selected images
			this.selected.push(img);
			this.fireEvent('select', [index, img]);
		} else {
			//else we're deselecting; remove the image from the index of selected images
			this.selected.erase(img);
			this.fireEvent('onDeSelect', [index, img]);
		}
		return this;
	},
	getDefaultWidth: function(){
		//if the user specified a width, just return it
		if ($type(this.options.length) == "number") return this.options.length;
		//if, on the other hand, they specified another element than the container
		//to calculate the width, use it
		var container = $(this.options.length);
		//otherwise, use the container
		if (!container) container = this.container.getParent();
		//return the width or height of that element, depending on the axis chosen in the options
		return container.getSize()[this.options.useAxis];
	},
	getIconPositions: function(){
		var offsets = [];
		var cumulative = 0;
		var prev;
		//loop through all the items
		this.imgs.each(function(img, index){
			//we're measuring the element that contains the image
			var parent = img.getParent();
			//get the width or height of that parent using the appropriate axis
			cumulative += (prev)?img['offset'+this.side.capitalize()] - prev['offset'+this.side.capitalize()]:0;
			prev = img;
			//var size = parent.getSize().size[this.options.useAxis]
			//store the data
			offsets.push({
				image: img,
				size: parent.getSize()[this.options.useAxis],
				offset: cumulative,
				container: parent
			});
		}, this);
		return offsets;
	},
	calculateRange: function(index, fromEnd){
		if (!this.imgs.length) return {start: 0, end: 0, elements: []};
		index = $pick(index, this.currentOffset||0);
		if (index < 0) index = 0;
		//dbug.trace();
		//get the width of space that icons are visible
		var length = this.getDefaultWidth();
		//get the positions of all the icons
		var positions = this.getIconPositions();
		var referencePoint;
		//if we're paginating forward the reference point is the left edge 
		//of the range is the left edge of the first icon
		//but if we're going backwards, the referencePoint is the left edge of the first icon currently in range
		//the problem is if the user removes the entire last page of icons, then this
		//item no longer exists, so...
		if (positions[index]) {
			//if the item exists, use it
			referencePoint = positions[index].offset;
		} else {
			//else the right edge of the last icon is the reference point
			//the last icon is the container of the last image
			var lastIcon = this.imgs.getLast().getParent();
			var coords = lastIcon.getCoordinates();
			//and the reference point is that icon's width plus it's left offset minus the offset 
			//of the parent (which gets offset negatively and positively for scrolling
			referencePoint = coords.width + coords.left - lastIcon.getParent().getPosition().x;
		}
		//figure out which ones are in range
		var range = positions.filter(function(position, i){
			//if the index supplied is the endpoint
			//then it's in range if the index of the icon is less than the index,
			//and the left side is less than that of the one at the end point
			//and if the left side is greater than or equal to the end point's position minus the length
			if (fromEnd) return i < index && 
				position.offset < referencePoint &&
				position.offset >= referencePoint-length;
			
			//else we go forward...
			//if the item is after the index start and the posision is 
			//less than or equal to the max width defined, include it
			else return i >= index && position.offset+position.size <= length+positions[index].offset;
		});
		//return the data
		return (fromEnd)?{start: index-range.length, end: index, elements: range}
					 :{start: index, end: range.length+index, elements: range};
	},
	inRange: function(index) {
		//calculate the range
		var range = this.calculateRange();
		//return the result
		return index < range.end && index >= range.start;
	},
	setupEvents: function(){
		$(this.options.container).addEvents({
			"mouseleave": function() {
				if (this.inFocus) this.inFocus = null;
				this.imgOut(null, true);
			}.bind(this)
		});
		
		$$(this.options.backScrollButtons).each(function(el){
			el.addEvents({
				click: this.pageBack.bind(this),
				mouseover: function(){ this.addClass('hover'); },
				mouseout: function(){ this.removeClass('hover'); }
			});
		}, this);
		$$(this.options.forwardScrollButtons).each(function(el){
			el.addEvents({
				click: this.pageForward.bind(this),
				mouseover: function(){ this.addClass('hover'); },
				mouseout: function(){ this.removeClass('hover'); }
			});
		}, this);

		$$(this.options.clearLinks).each(function(el){
			el.addEvent('click', this.empty.bind(this));
		}, this);
		$$(this.options.removeLinks).each(function(el){
			el.addEvent('click', this.removeSelected.bind(this));
		}, this);
	},
	imgOver: function(img){
		//set the value of what's in focus to be this image
		this.inFocus = img;
		//clear the overTimeout
		$clear(this.overTimeout);
		//delay for the duration of the onFocusDelay option
		this.overTimeout = (function(){
			this.onFocusDelay = this.options.onFocusDelay;
			//if the user is still focused on the image, fire the onFocus event
			if (this.inFocus == img) this.fireEvent("onFocus", [img, this.imgs.indexOf(img)]);
		}).delay(this.onFocusDelay, this);
	},
	imgOut: function(img, force){
		if (!$defined(img) && force) img = this.prevFocus||this.imgs[0];
		//if the focused image is this one
		if (this.inFocus == img && img) {
			//set it to null
			this.inFocus = null;
			//clear the delay timeout
			$clear(this.outTimeout);
			//wait the duration of the onBlurDelay
			this.outTimeout = (function(){
				this.prevFocus = img;
				//if we're not still focused on this image, fire onBlur
				if (this.inFocus != img || (img == null && force)) this.fireEvent("onBlur", [img, this.imgs.indexOf(img)]);
				if (!this.inFocus) this.onFocusDelay = this.options.initialFocusDelay;
			}).delay(this.options.onBlurDelay, this);
		}
	},
	setupIconEvents: function(img, caption){
		//add the click event
		img.addEvents({
			click: function(e){
				//if the user is holding down control, select the image
				if (e.control||e.meta) {
					this.selectItem(this.imgs.indexOf(img));
					e.stop();
				}
			}.bind(this)
		});
		img.getParent().addEvents({
			mouseover: this.imgOver.bind(this, img),
			mouseout: this.imgOver.bind(this, img)
		});
	}
});
/*
Script: StickyWin.Drag.js

	Implements drag and resize functionaity into StickyWin.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

if (window.Drag){

	StickyWin.implement({

		options: {
			draggable: false,
			dragOptions: {},
			dragHandleSelector: '.dragHandle',
			resizable: false,
			resizeOptions: {},
			resizeHandleSelector: ''
		},

		initialize: function(){
			this.previous.apply(this, arguments);
			if (this.options.draggable) this.makeDraggable();
			if (this.options.resizable) this.makeResizable();
		},

		positionShim: function(){
			if (this.shim) this.shim.position();
		},

		makeDraggable: function(){
			if (this.options.dragHandleSelector) {
				var handle = this.element.getElement(this.options.dragHandleSelector);
				if (handle) {
					handle.setStyle('cursor','move');
					this.options.dragOptions.handle = handle;
				}
			}
			this.win.makeDraggable(this.options.dragOptions).addEvent('complete', this.positionShim.bind(this));
		},

		makeResizable: function(){
			if (this.options.resizeHandleSelector) {
				var handle = this.win.getElement(this.options.resizeHandleSelector);
				if (handle) this.options.resizeOptions.handle = this.win.getElement(this.options.resizeHandleSelector);
			}
			this.win.makeResizable(this.options.resizeOptions).addEvent('complete', this.positionShim.bind(this));
		},

	});

}
/*
Script: StickyWin.alert.js
	Defines StickyWin.alert, a simple little alert box with a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.alert = function(msghdr, msg, baseHref) {
	baseHref = baseHref||"http://www.cnet.com/html/rb/assets/global/simple.error.popup";
	msg = '<p class="errorMsg SWclearfix" style="margin: 0px;min-height:10px">' +
						'<img src="'+baseHref+'/icon_problems_sm.gif"'+
						' class="bang clearfix" style="float: left; width: 30px; height: 30px; margin: 3px 5px 5px 0px;">'
						 + msg + '</p>';
	var body = StickyWin.ui(msghdr, msg, {width: 250});
	return new StickyWin.Modal({
		destroyOnClose: true,
		modalOptions: {
			modalStyle: {
				zIndex: 11000
			}
		},
		zIndex: 110001,
		content: body,
		position: 'center', //center, corner
		onClose: function(){
			this.destroy();
		}
	});
};
/*
Script: StickyWin.Fx.js

	Extends StickyWin to create popups that fade in and out.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

StickyWin.implement({

	options: {
		//fadeTransition: 'sine:in:out',
		fade: true,
		fadeDuration: 150
	},

	initialize: function(){
		this.parentShow = this.show;
		this.show = this.showWin;
		this.parentHide = this.hide;
		this.hide = this.hideWin;
		this.previous.apply(this, arguments);
	},

	hideWin: function(){
		if (this.options.fade) this.fade(0);
		else this.parentHide();
	},

	showWin: function(){
		if (this.options.fade) this.fade(1);
		else this.parentShow();
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
			if (to == 0) this.parentHide();
			else this.parentShow();
		}.bind(this));
		return this;
	}

});
/*
Script: Tips.Pointy.js
	Defines Tips.Pointy, An extension to Tips that adds a pointy style to the tip.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Tips.Pointy = new Class({
	Extends: Tips,
	options: {
		onShow: function(tip, stickyWin){
			stickyWin.show();
		},
		onHide: function(tip, stickyWin){
			stickyWin.hide();
		},
		pointyTipOptions: {
			point: 11,
			width: 150,
			pointyOptions: {
				closeButton: false
			}
		}
	},
	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		this.tip = new StickyWin.PointyTip($extend(this.options.pointyTipOptions, {
			showNow: false
		}));
		if (this.options.className) $(this.tip).addClass(this.options.className);
		if (params.elements) this.attach(params.elements);
	},
	elementEnter: function(event, element){

		var title = element.retrieve('tip:title');
		var text = element.retrieve('tip:text');
		this.tip.setContent(title, text);

		this.timer = $clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this);

		this.position(element);
	},

	elementLeave: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this);
	},

	elementMove: function(event){
		return; //always fixed
	},

	position: function(element){
		this.tip.setOptions({
			relativeTo: element
		});
		this.tip.position();
	},

	show: function(){
		this.fireEvent('show', [$(this.tip), this.tip]);
	},

	hide: function(){
		this.fireEvent('hide', [$(this.tip), this.tip]);
	}

});
$E = document.getElement.bind(document);
