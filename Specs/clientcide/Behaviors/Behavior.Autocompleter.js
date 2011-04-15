/*
---
name: Behavior.Autocompleter Tests
description: n/a
requires: [Clientcide/Behavior.Autocompleter, Behavior-Tests/Behavior.SpecsHelpers]
provides: [Behavior.Autocompleter.Tests]
...
*/

(function(){

	var str = '<input data-filters="Autocomplete" data-autocomplete-tokens="[\'foo\', \'bar\', \'baz\']"/>';
	Behavior.addFilterTest({
		filterName: 'Autocomplete',
		desc: 'Creates an instance of Autocomplete (local)',
		content: str,
		returns: Autocompleter.Local,
		expectations: [
			function(element, instance){
				expect(instance.tokens).toEqual(['foo', 'bar', 'baz']);
			}
		]
	});
	Behavior.addFilterTest({
		filterName: 'Autocomplete',
		desc: 'Creates an instance of Autocomplete (local) (10x)',
		content: str,
		returns: Autocompleter.Local,
		multiplier: 10,
		noSpecs: true
	});

	var remote = '<input data-filters="Autocomplete" data-autocomplete-url="/some/API/for/autocomplete"/>';
	Behavior.addFilterTest({
		filterName: 'Autocomplete',
		desc: 'Creates an instance of Autocomplete (remote)',
		content: remote,
		returns: Autocompleter.Ajax.Json,
		expectations: [
			function(element, instance){
				expect(instance.request).toBeDefined();
			}
		]
	});
	Behavior.addFilterTest({
		filterName: 'Autocomplete',
		desc: 'Creates an instance of Autocomplete (remote) (10x)',
		content: remote,
		returns: Autocompleter.Ajax.Json,
		multiplier: 10,
		noSpecs: true
	});


})();