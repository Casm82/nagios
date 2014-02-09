// Получаем из БД отчёты по месяцам
var mongoose = require('mongoose');
var app = require('express');

function publishReport(res) {
	console.log("\npublishReport>> Публикуем отчёты по месяцам");

	var Reports = mongoose.model("Report");
	Reports.find({}, function (err, Reports) {
/*		for ( var i in Reports) {
			console.log("\n  >> средняя доcтупность");
			console.log(Reports[i].averageOK);
			res.render('publishReport.jade', Reports[i]);
		}
	});
*/
//	console.log(Reports);
	var JadeObject = {title: "Отчёт о доступности служб за " + Reports[0].date.quarter + " квартал " +
			Reports[0].date.year + " года", Documents: Reports};
	res.render('publishReports.jade', JadeObject);

	});
};

module.exports = publishReport;
