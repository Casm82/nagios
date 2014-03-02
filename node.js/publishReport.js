// Получаем из БД отчёты по месяцам
var mongoose = require('mongoose');
var app = require('express');

function publishReport(res, reqId) {
	var Reports = mongoose.model("Report");
	Reports.find(
		{'date.quarter': reqId.quarter,
		 'date.year': reqId.year},
		null, 
		{sort: {'date.month': 1}},
		function (err, reports) {
			var JadeObject = {
				title: "Отчёт о доступности служб за " + reports[0].date.quarter + 
				" квартал " +	reports[0].date.year + " года", 
				documents: reports,
				state: "publishedQuarter",
				date: {quarter: reqId.quarter, year: reqId.year}
			};

			res.render('publishReports', JadeObject);
		});
};

module.exports = publishReport;
