// Определяем минимальное значение доступности служб по месяцам за квартал
var mongoose = require('mongoose'),
	getIdleMonth = require('./getIdleMonth');

function calcAvgTimeOK () {
	console.log("calcAvg>> Считаем средние значение доступности по месяцам");
	var Reports = mongoose.model("Report");

	var queryAvgValues = [
		{"$unwind": "$report"},
		{"$unwind": "$report.services"},
		{$group: 
			{	"_id": 			{"year": "$year", "quarter": "$quarter", "month": "$month" },
				"avg_timeOK":	{$avg: "$report.services.timeOK"}
			}
		}
	];
	
	Reports.aggregate(queryAvgValues, function (err, avgValues) {
		console.log(avgValues[1].avg_timeOK);
//		getIdleMonth(minValue[0].min);
	});

};		// <--- calculateMin()

module.exports = calcAvgTimeOK;
