var mongoose = require('mongoose');
var Reports = mongoose.model("Report");

function clearForceLabel(reqId) 
{
	Reports.update(
	{ 'date.quarter': reqId.quarter,
	  'date.year':    reqId.year },
	{$set: {"forceReq": false}},
		function(err, cleared) {
			if (err) return err;
			console.log("\nclearForceLabel>>> Очищено меток %d", cleared);
		}
	);
};

module.exports = clearForceLabel;
