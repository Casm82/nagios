// Корректируем отчёт для печати
var mongoose = require('mongoose');
var app = require('express');

function prePrintReport(res, reqId) {
	var Reports = mongoose.model("Report");
	Reports.findOne(
		{'date.quarter': reqId.quarter,
		 'date.year': reqId.year,
		 leastQuarterly: true
		},
		function (err, report) {
			var jadeObject = {
				title: "Отчёт о доступности служб за " + report.date.month + 
				" месяц " +	report.date.year + " года", 
				document: report,
				state: "prePrinted",
			};
			res.render("prePrintReport", jadeObject);
		});
};

module.exports = prePrintReport;
