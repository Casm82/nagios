// Получаем из БД отчёты по месяцам
var mongoose = require('mongoose');
var app = require('express');

function publishReport(res, reqId) {
	console.log("\npublishReport>> Публикуем отчёты по месяцам");
	var Reports = mongoose.model("Report");
	Reports.find(
		{'date.quarter': reqId.quarter,
		 'date.year': reqId.year},
		null, 
		{sort: {'date.month': 1}},
		function (err, Reports) {
			console.log("publishReport.js>>> Отчёты");
			//console.log(Reports); 
			var JadeObject = {title: "Отчёт о доступности служб за " + 
				Reports[0].date.quarter + " квартал " +	Reports[0].date.year + " года", 
				Documents: Reports};

			res.render('publishReports.jade', JadeObject);
		});
};

module.exports = publishReport;
