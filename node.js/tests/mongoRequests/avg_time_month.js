use nagios;

db.reports.aggregate([
		{"$unwind": "$report"},
		{"$unwind": "$report.services"},
		{$group: 
			{	"_id": 			{"year": "$year", "quarter": "$quarter", "month": "$month" },
				"avg_timeOK":	{$avg: "$report.services.timeOK"},
				"month":		{$avg: "$month"},
				"year":			{$avg: "$year"}
			}
		},
		{$group: 
			{	"_id": 			null, 
				"min" : 		{"$min": "$avg_timeOK"},
				"month":		{$avg: "$month"},
				"year":			{$avg: "$year"}
			}
		}
]);
