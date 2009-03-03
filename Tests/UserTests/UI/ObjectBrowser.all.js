{
	tests: [
		{
			title: "ObjectBrowser",
			description: "Creates a tree of data that you can browse.",
			verify: "Can you open and close the various branches?",
			before: function(){
				var data = {
				  fruits: {
				    apples: ['red','yellow','green','fuji','granny smith'],
				    grapes: [
				      {
				        fun: 'green',
				        notFun: 'purple'
				      },
				      {
				        wine: ['merlot', 'caberney'],
				        jelly: 'concord'
				      }
				    ]
				  },
				  veggies: {
				    apples: ['test'],
				    summer: {
				      tomatoes: ['big','small'],
				      melons: ['watermelon','canteloupe']
				    },
				    winter: ['potatoes', 'carots'],
				    someFunction: function(someVariable){
				      alert(someVariable);
				    }
				  }
				};
				new ObjectBrowser($('foo'), {
				  data: data
				});
			
			}
		}
	]
}