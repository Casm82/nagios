use nagios;

db.reports.aggregate([
		{"$unwind": "$report"},
		{"$unwind": "$report.services"},
		{$group: 
			{	"_id": 			{"year": "$year", "quarter": "$quarter", "month": "$month" },
				"avg_timeOK":	{$avg: "$report.services.timeOK"}
			}
		}
]);
