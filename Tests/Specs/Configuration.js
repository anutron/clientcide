// Put this file in the parent directory of the runner folder. Also rename the file to Configuration.js

(function(context){

var Configuration = context.Configuration = {};

// Runner name
Configuration.name = 'Clientcide';


// Presets - combine the sets and the source to a preset to easily run a test
Configuration.presets = {

	'clientcide': {
		sets: ['clientcide'],
		source: ['clientcide']
	}

};

// An object with default presets
Configuration.defaultPresets = {
	browser: 'clientcide',
	nodejs: 'clientcide',
	jstd: 'clientcide'
};


/*
 * An object with sets. Each item in the object should have an path key', '
 * that specifies where the spec files are and an array with all the files
 * without the .js extension relative to the given path
 */
Configuration.sets = {

	'clientcide': {
		path: 'clientcide/',
		files: [
			'../behavior/Specs/Behavior/Behavior.SpecsHelpers',
			'Behaviors/Behavior.Autocompleter',
			'Behaviors/Behavior.Tabs',
			'Behaviors/Behavior.Tips'
		]
	}

};


/*
 * An object with the source files. Each item should have an path key,
 * that specifies where the source files are and an array with all the files
 * without the .js extension relative to the given path
 */

Configuration.source = {

	'clientcide': {
		path: '',
		files: [
			'mootools-core/Source/Core/Core',
			'mootools-core/Source/Types/Array',
			'mootools-core/Source/Types/String',
			'mootools-core/Source/Types/Function',
			'mootools-core/Source/Types/Number',
			'mootools-core/Source/Types/Object',
			'mootools-core/Source/Types/Event',
			'mootools-core/Source/Class/Class',
			'mootools-core/Source/Class/Class.Extras',
			'mootools-core/Source/Browser/Browser',
			'mootools-core/Source/Slick/Slick.Parser',
			'mootools-core/Source/Slick/Slick.Finder',
			'mootools-core/Source/Element/Element',
			'mootools-core/Source/Element/Element.Event',
			'mootools-core/Source/Element/Element.Style',
			'mootools-core/Source/Element/Element.Dimensions',
			'mootools-core/Source/Fx/Fx',
			'mootools-core/Source/Fx/Fx.CSS',
			'mootools-core/Source/Fx/Fx.Tween',
			'mootools-core/Source/Fx/Fx.Morph',
			'mootools-core/Source/Utilities/JSON',
			'mootools-core/Source/Utilities/DomReady',
			'mootools-core/Source/Request/Request',
			'mootools-core/Source/Request/Request.HTML',
			'mootools-core/Source/Request/Request.JSON',
			'mootools-more/Source/More/More',
			'mootools-more/Source/Class/Class.Binds',
			'mootools-more/Source/Class/Class.Occlude',
			'mootools-more/Source/Class/Class.Refactor',
			'mootools-more/Source/Types/String.Extras',
			'mootools-more/Source/Element/Element.Forms',
			'mootools-more/Source/Element/Element.Measure',
			'mootools-more/Source/Element/Element.Position',
			'mootools-more/Source/Element/Element.Pin',
			'mootools-more/Source/Element/Element.Shortcuts',
			'mootools-more/Source/Fx/Fx.Elements',
			'mootools-more/Source/Fx/Fx.Accordion',
			'mootools-more/Source/Interface/Tips',
			'mootools-more/Source/Utilities/IframeShim',
			'mootools-more/Source/Utilities/Table',
			'behavior/Source/Behavior',
			'behavior/Source/Element.Data',
			'behavior/Source/BehaviorAPI',
			'../Source/Core/Clientcide',
			'../Source/Core/dbug',
			'../Source/UI/StyleWriter',
			'../Source/3rdParty/Autocompleter',
			'../Source/3rdParty/Autocompleter.Observer',
			'../Source/3rdParty/Autocompleter.Local',
			'../Source/3rdParty/Autocompleter.Remote',
			'../Source/Layout/TabSwapper',
			'../Source/UI/StickyWin',
			'../Source/UI/StickyWin.UI',
			'../Source/UI/StickyWin.UI.Pointy',
			'../Source/UI/StickyWin.PointyTip',
			'../Source/UI/Tips.Pointy',
			'../Source/Behaviors/Behavior.Autocompleter',
			'../Source/Behaviors/Behavior.Tabs',
			'../Source/Behaviors/Behavior.Tips'
		]
	}

};

})(typeof exports != 'undefined' ? exports : this);
