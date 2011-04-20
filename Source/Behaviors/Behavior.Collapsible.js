// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/*
---
description: Instantiates a Collapsible class.
provides: [Behavior.Collapsible]
requires: [Behavior/Behavior, /Collapsible]
script: Behavior.Collapsible.js

...
*/

Behavior.addGlobalFilters({

	Collapsible: {
		defaults: {
			target: '+'
		},
		setup: function(element, api) {
			var target = element.getElement(api.get('target'));
			var col = new Collapsible(element, target);
			api.onCleanup(col.detach.bind(col));
			return col;
		},
		returns: Collapsible
	}

});