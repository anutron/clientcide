UnitTester.site = 'Clientcide'; //title of your site
UnitTester.title = 'Unit Test Demo'; //title of this test group

window.addEvent('load', function(){
	new UnitTester({
		demo: 'DemoScripts/' //path to Source/scripts.json
	}, {
		DemoScripts: 'DemoTests/' //path to tests.json
	});
});