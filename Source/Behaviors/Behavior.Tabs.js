/*
---
name: Behavior.Tabs
description: Adds a tab interface (TabSwapper instance) for elements with .css-tab_ui. Matched with tab elements that are .tabs and sections that are .tab_sections.
provides: [Behavior.Tabs]
requires: [Behavior/Behavior, /TabSwapper.Hash]
script: Behavior.Tabs.js

...
*/

Behavior.addGlobalFilters({

	Tabs: {
		defaults: {
			'tabs-selector': '.tabs>li',
			'sections-selector': '.tab_sections>li',
			smooth: true,
			smoothSize: true,
			rearrangeDOM: false,
			preventDefault: true
		},
		setup: function(element, api) {
			var tabs = element.getElements(api.get('tabs-selector'));
			var sections = element.getElements(api.get('sections-selector'));
			if (tabs.length != sections.length || tabs.length == 0) {
				api.fail('warning; sections and sections are not of equal number. tabs: ' + tabs.length + ', sections: ' + sections.length);
			}

			var ts = new TabSwapper.Hash(
				Object.merge(
					{
						tabs: tabs,
						sections: sections
					},
					Object.cleanValues(
						api.getAs({
							initPanel: Number,
							hash: String,
							cookieName: String,
							smooth: Boolean,
							smoothSize: Boolean,
							rearrangeDOM: Boolean,
							selectedClass: String,
							initPanel: Number,
							preventDefault: Boolean
						})
					)
				)
			);
			ts.addEvent('active', function(index){
				api.fireEvent('layout:display', sections[0].getParent());
			});
			element.store('TabSwapper', ts);
			api.onCleanup(function(){
				ts.destroy();
				element.eliminate('TabSwapper');
			});
			return ts;
		}
	}
});