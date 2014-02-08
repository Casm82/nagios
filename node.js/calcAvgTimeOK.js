// Определяем минимальное значение доступности служб по месяцам за квартал
var mongoose = require('mongoose'),
	publishMinreport = require('./publishMinreport');

function calcAvgTimeOK (res) {
//	console.log("\ncalcAvg>> Считаем средние значение доступности по месяцам");
	var Reports = mongoose.model("Report");

	var report = {};

	// Функция выпускает значения {дата, [{отчёт},{отчёт},{отчёт}...] }
	report.map = function () { 
	for (var host in this.report) {
		var hostservices =  this.report[host];
		for (var oneservice in hostservices.services) {
			var unwindservice = {
				host: hostservices.host,
				servicename: hostservices.services[oneservice].servicename,
				timeOK: hostservices.services[oneservice].timeOK
				};
			emit ( this.date, unwindservice) 
		}
	}
	};

	// Функция для каждого значения {дата, [{отчёт},{отчёт},{отчёт}...] }
	// считает среднее значение {отчёт}
	report.reduce = function(date, reports) { 
		var timeOK = 0;
		for (var report in reports)
		{
			timeOK += reports[report].timeOK;	// Сумма timeOK сервисов из месяц
		};
	return timeOK/reports.length;	 			// Среднее значение timeOK сервисов за месяц
	};

	report.verbose = false;

	// Получаем массив пар {_id: дата, value: "среднее timeOK"} как mapOut
	// 
	// [
	// 	{ _id: { month: 1, quarter: 1, year: 2013 }, value: 99.76364285714284 },
	// 	{ _id: { month: 2, quarter: 1, year: 2013 }, value: 99.99869047619048 },
	// 	{ _id: { month: 3, quarter: 1, year: 2013 }, value: 99.99097619047619 }
	// ]
	//
	// Для каждой пары вызываем функцию

	function findMinReport(array){
		var minTimeReport = { "_id": null, "value": Infinity};
		for ( var i in array) 
			{
				if (array[i].value < minTimeReport.value) { minTimeReport = array[i]; };
			};
		return minTimeReport;
		};

// TODO: 	сохранить среднее значение

Reports.mapReduce( report, function (err, mapOut) {
		var minTimeOKReport = findMinReport(mapOut);
		publishMinreport(minTimeOKReport, res);
	});

};		// <--- calculateMin()

module.exports = calcAvgTimeOK;
