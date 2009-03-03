Class: PostEditor {#PostEditor}
===============================

Enables rich formatting of text areas with pattern completion and tabs.

### Authors
* Daniel Mota aka IceBeat, [http://icebeat.bitacoras.com][]
* Sergio Álvarez aka Xergio, [http://xergio.net][]
* Jordi Rivero aka Godsea, [http://godsea.dsland.org][]
* Aaron Newton, [http://www.clientcide.com][] (upgraded PostEditor to MooTools 1.2)

### License:

MIT-style license.

### Syntax

	new PostEditor(textarea[, options]);

### Arguments

1. el - (*mixed*) A string of the id for an Element or an Element reference to enhance; a textarea.
2. options - (*object*) a key/value set of options
	
### Options

* snippets - (*object*) Snippets like in TextMate.
* smartTypingPairs - (*object*) auto fill pairs (quotes and whatnot).
* selections - (*object*) functions to execute with selections.

### Example

	new PostEditor($('myTextarea'), {
		//translates to tags
		snippets: {
			"strong" : ["<strong>\n		","something here","\n</strong>"],
			"em" : ["<em>\n		","something here","\n</em>"],
			"blockquote" : ["<blockquote>\n		","something here","\n</blockquote>"],
		},
		//auto completes pairs
		smartTypingPairs: {
			'"' : '"',
			'(' : ')',
			'{' : '}',
			"'" : {
				scope:{
					"<javascript>":"</javascript>",
					"<code>":"</code>",
					"<html>":"</html>"
				},
				pair:"'"
			}
		},
		//ctrl+shift+<key>
		selections: {
			"0": function(sel){
				return ['<strong>',sel,'</strong>'];
			},
			"1": function(sel){
				return ['<em>',sel,'</em>'];
			},
			"2": function(sel){
				return ['<blockquote>',sel,'</blockquote>'];
			},
			"3": function(sel){
				return ['<code>',sel,'</code>'];
			},
			"4": function(sel){
				return ['<javascript>',sel,'</javascript>'];
			}
		}
	});

[http://icebeat.bitacoras.com]: http://icebeat.bitacoras.com
[http://xergio.net]: http://xergio.net
[http://godsea.dsland.org]: http://godsea.dsland.org
[http://www.clientcide.com]: http://www.clientcide.com
