Class: SimpleEditor {#SimpleEditor}
===================================

A simple HTML editor for wrapping text with links and whatnot.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/09-forms/07-simpleeditor

### Implements

* [Class.ToElement][], [Class.Occlude][]

### Syntax

	new SimpleEditor(input, buttons[, commands]);

### Arguments

1. input - (*mixed*) A string of the id for an Element or an Element reference of the input this editor modifies
2. buttons - (*mixed*) an *array*  of all the links and/or buttons/images, or a css selector (*string*) to select them, that make changes to the text when clicked.
3. commands - (*object*, optional) a commands object (see below) for this editor.

### Commands

[SimpleEditor][] comes with a handful of common commands to wrap text with bold tags or italics, etc. You can define your own and add them to all [SimpleEditor][]s or to a specific instance.

A command is made up of a shortcut key and a function (that will have a reference to the input passed to it as an argument).

### Command Example
	bold: {
		shortcut: 'b',
		command: function(input){
			input.insertAroundCursor({before:'<b>',after:'</b>'});
		}
	}

When the user clicks the button or hits ctrl+b, the tag will be inserted around the selected text.
	See [SimpleEditor:addCommand][] and [SimpleEditor:addCommands][] on how to add your own.

### Note

Shortcuts can be capital letters (so you can map *ctrl+b* to bold and *ctrl+shift+b* to bullet points).

### Buttons/Links

The buttons passed in must have a property "rel" equal to the key of the command they execute.

### Button Example

	<img src="bold.gif" alt="Bold (ctrl+b)" title="Bold (ctrl+b)" rel="bold"/>
	In the example above, the rel="bold" will map this image to the bold command.

SimpleEditor Method: addCommand {#SimpleEditor:addCommand}
----------------------------------------------------------

Inserts a single command to the [SimpleEditor][].

**Note**: You can use this method on your instance of this class to add the command to that instance, or you can execute it on the class namespace and **all** SimpleEditor instances created after this will get these commands.

### Syntax

	SimpleEditor.addCommand(key, command, shortcut);
	//or on an instance:
	mySimpleEditor.addCommand(key, command[, shortcut]);

### Arguments

1. key - (*string*) the unique identifier for this command ("bold", "italics", etc.)
2. command - (*function*) executed on the input when the user clicks the button; the function is passed the input as an argument
3. shortcut - (*character*, optional) a shortcut key that, when pressed in conjunction with *ctrl*, will execute the function

### Example

	//all instances will get bold tags as <strong></strong>
	SimpleEditor.addCommand('bold', function(input) {
		input.insertAroundCursor({before:'<strong>',after:'</strong>'});
	}, 'b')
	//but this instance will get bold tags as <b></b>
	var myEditor = new SimpleEditor(input, $$('img.editbuttons'));
	myEditor.addCommand('bold', function(input){
		input.insertAroundCursor({before:'<b>',after:'</b>'});
	}, 'b');

SimpleEditor Method: addCommands {#SimpleEditor:addCommands}
-----------------------------------------------------------

Inserts a collection of commands to the [SimpleEditor][].

*Note*: You can use this method on your instance of this class to add the command to that instance, or you can execute it on the class namespace and all [SimpleEditor][] instances created after this will get these commands.

### Syntax

	SimpleEditor.addCommands(commands);

### Arguments

1. commands - (*object*) a key/value set of commands (see below)

### Commands

This is an object whose key is the command key. Its members are key/values for the shortcut value and the command function. The example below should illustrate this more clearly.

### Example
	//all instances will get bold tags as <strong></strong> and italics as <em></em>
	SimpleEditor.addCommands({
		bold: {
			shortcut: 'b',
			command: function(input){
				input.insertAroundCursor({before:'<strong>',after:'</strong>'});
			}
		},
		italics: {
			shortcut: 'i',
			command: function(input){
				input.insertAroundCursor({before:'<em>',after:'</em>'});
			}
		}
	));
	//but this instance will get bold tags as <b></b> and italics as <i></i>
	var myEditor = new SimpleEditor(input, $$('img.editbuttons'));
	myEditor.addCommands(SimpleEditor.addCommands({
		bold: {
			shortcut: 'b',
			command: function(input){
				input.insertAroundCursor({before:'<b>',after:'</b>'});
			}
		},
		italics: {
			shortcut: 'i',
			command: function(input){
				input.insertAroundCursor({before:'<i>',after:'</i>'});
			}
		}
	});

Default Commands {#Commands}
============================

* bold - shortcut key: b
* underline - shortcut key: u
* anchor - shortcut key: l
* copy - no shortcut; requires [Clipboard.js][]
* cut - no shortcut; requires [Clipboard.js][]
* hr - shortcut key: - (dash)
* img - shortcut key: g
* stripTags - shortcut key: \
* supertext - no shortcut
* subtext - no shortcut
* paragraph - shortcut key: enter
* strike - shortcut key: k
* italics - shortcut key: i
* bullets - shortcut key: 8 (a.k.a. asterisk)
* numberList - shortcut key: =
* clean - removes non-asci MS Word style characters with [Element.tidy][]
* preview - uses [StickyWin.Modal][]	and [StickyWin.UI][] to display a preview

Localization {#Localizaion}
===========================

SimpleEditor includes instruction to the user when certain commands are executed. For instance, when an anchor is selected, the user is prompted to provide the link. These instructions are in English by default but these can be overridden. You can download language files for some languages on [Clientcide's Download Page][] or you can write your own. If you author your own, please [send it in][] so we can add it to our offering.

### Exmaple

	SimpleEditor.language = "enUS";

See language files and their docs for the setting to use for a specific language.

Native: Element {#Element}
==========================

Extends the native Element object with a reference to its [SimpleEditor][] instance.


Element property: SimpleEditor {#Element:SimpleEditor}
------------------------------------------

### Syntax

	myInput.retrieve('SimpleEditor'); //the instance of SimpleEditor for the element


[SimpleEditor]: #SimpleEditor
[SimpleEditor:addCommands]: #SimpleEditor:addCommands
[SimpleEditor:addCommand]: #SimpleEditor:addCommand
[Clipboard.js]: /docs/Forms/Clipboard
[Element.tidy]: /docs/Element/Element.Forms
[StickyWin.Modal]: /docs/UI/StickyWin.Modal
[StickyWin.UI]: /docs/UI/StickyWin.UI
[Clientcide's Download Page]: http://www.clientcide.com/js
[send it in]: http://code.google.com/p/cnetjavascript/issues/list
[Class.ToElement]: /docs/Class/Class.ToElement
[Class.Occlude]: http://mootools.net/docs/more/Class/Class.Occlude