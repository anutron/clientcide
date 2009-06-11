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
		this.element = document.id(input);
		if (this.occlude()) return this.occluded;
		this.commands = new Hash($extend(SimpleEditor.commands, commands||{}));
		this.buttons = $$(buttons);
		this.buttons.each(function(button){
			button.addEvent('click', function() {
				this.exec(button.get('rel'));
			}.bind(this));
		}.bind(this));
		document.id(this).addEvent('keydown', function(e){
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
			var ch = (value.shortcut ? value.shortcut.toLowerCase() : value.shortcut);
			if (value.shortcut == shortcut || (shift && ch == shortcut)) returnKey = key;
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
		if (document.id(this).scrollTop || document.id(this).scrollLeft) {
			currentScrollPos = {
				scrollTop: document.id(this).getScroll().y,
				scrollLeft: document.id(this).getScroll().x
			};
		}
		if (this.commands.has(key)) this.commands.get(key).command(document.id(this));
		if (currentScrollPos) {
			document.id(this).set('scrollTop', currentScrollPos.getScroll().y);
			document.id(this).set('scrollLeft', currentScrollPos.getScroll().x);
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
SimpleEditor.getMsg = function(key, language){
	return MooTools.lang.get('SimpleEditor', key, args);
};