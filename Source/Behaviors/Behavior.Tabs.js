/*
---
name: Behavior.Tabs
description: Adds a tab interface (TabSwapper instance) for elements with .css-tab_ui. Matched with tab elements that are .tabs and sections that are .tab_sections.
provides: [Behavior.Tabs]
requires: [Behavior/Behavior, /TabSwapper]
script: Behavior.Tabs.js

...
*/

Behavior.addGlobalFilters({

	Tabs: function(element, api) {
		var tabs = element.getElements(element.getData('tabs-selector') || '.tabs>li');
		var sections = element.getElements(element.getData('sections-selector') || '.tab_sections>li');
		if (tabs.length != sections.length || tabs.length == 0) {
			api.error('warning; sections and sections are not of equal number. tabs: %o, sections: %o', tabs, sections);
			return;
		}
		var ts = new TabSwapper({
			tabs: tabs,
			sections: sections,
			smooth: true,
			smoothSize: true,
			rearrangeDOM: false
		});
		element.store('TabSwapper', ts);
		return ts;
	}

});
