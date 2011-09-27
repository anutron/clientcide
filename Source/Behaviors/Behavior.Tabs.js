/*
---
name: Behavior.Tabs
description: Adds a tab interface (TabSwapper instance) for elements with .css-tab_ui. Matched with tab elements that are .tabs and sections that are .tab_sections.
provides: [Behavior.Tabs]
requires: [Behavior/Behavior, /TabSwapper, More/String.QueryString]
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
			rearrangeDOM: false
		},
		setup: function(element, api) {
			var tabs = element.getElements(api.get('tabs-selector'));
			var sections = element.getElements(api.get('sections-selector'));
			if (tabs.length != sections.length || tabs.length == 0) {
				api.fail('warning; sections and sections are not of equal number. tabs: %o, sections: %o', tabs, sections);
			}
			var getHash = function(){
				return window.location.hash.substring(1, window.location.hash.length).parseQueryString();
			};

			var ts = new TabSwapper(
				Object.merge(
					{
						tabs: tabs,
						sections: sections,
						initPanel: api.get('hash') ? getHash()[api.get('hash')] : null
					},
					Object.cleanValues(
						api.getAs({
							smooth: Boolean,
							smoothSize: Boolean,
							rearrangeDOM: Boolean,
							selectedClass: String,
							initPanel: Number
						})
					)
				)
			);
			ts.addEvent('active', function(index){
				if (api.get('hash')) {
					var hash = getHash();
					hash[api.get('hash')] = index;
					window.location.hash = Object.cleanValues(Object.toQueryString(hash));
				}
				api.fireEvent('layout:display', sections[0].getParent());
			});
			element.store('TabSwapper', ts);
			return ts;
		}
	}
});
