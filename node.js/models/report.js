var mongoose = require('mongoose');

var schema = mongoose.Schema({
				_id:		String,
				url:		String,
				report:		[],
				date:		{	month:		Number,
							 	quarter:	Number,
								year: 		Number
							},
				duration:	Number,
				title:		String,
				leastQuarterly: {type:	Boolean, default: false}
			});

module.exports = mongoose.model("Report", schema);
