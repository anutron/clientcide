var UnitTester = {
	site: 'Clientcide',
	title: 'Unit Tests',
	path: 'UnitTester/',
	ready: function(){
		var sources = {
			mootoolsCore: '../../core',
			mootoolsMore: '../../more',
			clientcide: '..'
		};
		if (window.location.href.contains("http://www.clientcide.com/tests")) {
			sources = {
				mootoolsCore: '/cnet.gf/Mootools/mootools-core',
				mootoolsMore: '/cnet.gf/Mootools/mootools-more',
				clentcide: '/cnet.gf/svn'
			};
		}
		new UnitTester(sources, {
			Clientcide: 'UserTests/'
		}, {
			autoplay: true
		});
	}
};
