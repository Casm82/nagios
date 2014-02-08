use nagios;

db.reports.aggregate([
		{"$unwind": "$report"},
		{"$unwind": "$report.services"}
]);
