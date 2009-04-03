UnitTester.site = 'Clientcide';
UnitTester.title = 'Unit Tests';

window.addEvent('load', function(){
	var sources = {
		mootoolsCore: '../../core',
		mootoolsMore: '../../more',
		clientside: '..'
	};
	if (window.location.href.contains("http://www.clientcide.com/tests")) {
		sources = {
			mootoolsCore: '/cnet.gf/svn/Mootools/mootools-core',
			mootoolsMore: '/cnet.gf/svn/Mootools/mootools-more',
			clentcide: '/cnet.gf/svn'
		};
	}
	
	new UnitTester(sources, {
		Clientcide: 'UserTests/'
	}, {
		autoplay: true
	});
});