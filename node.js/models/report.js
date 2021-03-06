var mongoose = require('mongoose');

var schema = mongoose.Schema({
				date: {	month:		Number,
						quarter:	Number,
						year: 		Number
					  },
				forceReq:		{type:	Boolean, default: false},
				url:			String,
				report	:		[],
				avgTime:		Number,
				avgTimeIdle:	[],
				duration:		Number,
				leastQuarterly:	{type:	Boolean, default: false}
			});

module.exports = mongoose.model("Report", schema);
