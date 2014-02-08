// Получаем из БД отчёт по месяцу с минимальным временем доступности служб
var mongoose = require('mongoose');
var app = require('express');

function publishMinreport(report, res) {
	console.log("\npublishMinreport>> Ищем месяц с доступностью служб ");
	console.log(report);

	var Reports = mongoose.model("Report");
	Reports.findOne({date: report._id}, function (err, minReport) {
		
		minReport.leastQuarterly = true;
		minReport.save(function(err) {
			if (err) throw err;
			console.log("\npublishMinreport>> Публикуем отчёт:");
			console.log(minReport);
			res.render('index.jade', minReport);
		});
	});
	
};

module.exports = publishMinreport;
