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

			// get the element to delegate clicks to - defaults to the container
			var delegationTarget = element;
			if (api.get('delegationTarget')) delegationTarget = element.getElement(api.get('delegationTarget'));
			if (!delegationTarget) api.fail('Could not find delegation target for tabs');

			// delegate watching click events for any element with an #href
			delegationTarget.addEvent('click:relay([href^=#])', function(event, link){
				if (link.get('href') == "#") return;
				// attempt to find the target for the link within the page
				var target = delegationTarget.getElement(link.get('href'));
				// if the target IS a tab, do nothing; valid targets are *sections*
				if (ts.tabs.contains(target)) return;
				// if no target was found at all, warn
				if (!target) api.warn('Could not switch tab; no section found for ' + link.get('href'));
				// if the target is a section, show it.
				if (ts.sections.contains(target)) {
					event.preventDefault();
					var delegator = api.getDelegator();
					if (delegator) delegator._eventHandler(event, ts.tabs[ts.sections.indexOf(target)]);
					ts.show(ts.sections.indexOf(target));
				}
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