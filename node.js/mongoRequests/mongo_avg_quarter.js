db.reports.aggregate([{"$unwind": "$report"}, {"$unwind": "$report.services"}, {$group: {"_id": {"year": "$year", "quarter": "$quarter", "month": "$month"}, "avg_timeOK": {$avg: "$report.services.timeOK"}}}]);


db.reports.aggregate([{"$unwind": "$report"}, {"$unwind": "$report.services"}, {$group: {"_id": {"year": "$year", "quarter": "$quarter"   , "month": "$month" }, "avg_timeOK": {$avg: "$report.services.timeOK"}}}, {$group: {"_id": null, "min": {"$min": "$avg_timeOK"}}}]);
