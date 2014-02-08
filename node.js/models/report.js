var mongoose = require('mongoose');

var schema = mongoose.Schema({
				report:		[],
				duration:	Number,
				month:		Number,
				quarter:	Number,
				range:		String,
				year: 		Number,
				title:		String
			});

module.exports = mongoose.model("Report", schema);
