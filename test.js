var route = require('./rb');
route.route('search/:query/p:num', function(query, num){
			console.log(query);
			console.log(num);
		});
route.checkUrl('search/test/p101');
