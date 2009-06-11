{
	tests: [
		{
			title: "Autocompleter.JSONP: single value",
			description: "Creates an auto completed input using data retrieved with JSONP.",
			verify: "Can you use the input to type in values that are autocompleted?",
			before: function(){
				var ac =  new Autocompleter.JSONP($('foo'), 'http://api.cnet.com/restApi/v1.0/techProductSearch',	{
					jsonpOptions: {
						//this data gets added to the query string using JsonP's options
						data: {
							viewType: 'json',
							partKey: '19926949750937665684988687810562', //this is my code, user your own!
							iod:'none',
							start:0,
							results:40
						}
					},
					width: 350,
					//require at least a key stroke from the user
					minLength: 1,
					//this function filters the results based on the input
					filter: function(resp) {
						try {
							//this structure is unique to the CNET API
							choices = resp.CNETResponse.TechProducts.TechProduct;
						//test it
						if(!choices || choices.length == 0) return [];
						//filter it and return it
						return choices.filter(function(choice){
							return (choice.Name.$.test(this.queryValue, 'i')
								|| choice['@id'].test(this.queryValue), 'i');
							}.bind(this));
						} catch(e){dbug.log('filterResponse error: ', e);}
					},
					injectChoice: function(choice){
					  //again, the structure of these items is unique to the CNET API
						if(! choice.Name.$)return;
						var el = new Element('li', {
							html: this.markQueryValue(choice.Name.$)
						}).adopt(new Element('span', {'class': 'example-info'}).set('html',this.markQueryValue(choice['@id'])));
						el.inputValue = choice.Name.$;
						this.addChoiceEvents(el).inject(this.choices);
					}
				});
			}
		},
		{
			title: "Autocompleter.JSONP: multiple values",
			description: "Creates a multiple auto completed input using data retrieved with JSONP.",
			verify: "Can you use the input to type in values that are autocompleted (<b>note:</b> semi-colons are used as the delimiter)?",
			before: function(){
				var ac =  new Autocompleter.JSONP($('foo2'), 'http://api.cnet.com/restApi/v1.0/techProductSearch',	{
				  jsonpOptions: {
				    //this data gets added to the query string using JsonP's options
				    data: {
				      viewType: 'json',
				      partKey: '19926949750937665684988687810562', //this is my code, user your own!
				      iod:'none',
				      start:0,
				      results:10
				    }
				  },
					selectMode: 'type-ahead', // Instant completion,
					multiple: true,
					separator: '; ',
					width: 350,
				  //require at least a key stroke from the user
				  minLength: 1,
				  //this function filters the results based on the input
				  filter: function(resp) {
						try {
							//this structure is unique to the CNET API
							choices = resp.CNETResponse.TechProducts.TechProduct;
							//test it
							if(!choices || choices.length == 0) return [];
							//filter it and return it
							return choices.filter(function(choice){
								return (choice.Name.$.test(this.queryValue, 'i')
								 || choice['@id'].test(this.queryValue), 'i');
							}.bind(this));
						} catch(e){dbug.log('filterResponse error: ', e);}
				  },
					injectChoice: function(choice){
					  //again, the structure of these items is unique to the CNET API
						if(! choice.Name.$)return;
						var el = new Element('li', {
							html: this.markQueryValue(choice.Name.$)
						});
						el.inputValue = choice.Name.$;
						this.addChoiceEvents(el).inject(this.choices);
					}
				});
			}
		}
	],
	otherScripts: ['Autocompleter.Clientcide']
}