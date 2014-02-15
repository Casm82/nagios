// Определяем минимальное значение доступности служб по месяцам за квартал
var mongoose = require('mongoose'),
	publishReport = require('./publishReport'),
	writeAvgTimeOK = require('./writeAvgTimeOK.js');

function calcAvgTimeOK (res, reqId) {
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

	report.query = {'date.quarter': reqId.quarter, 'date.year': reqId.year } ;

	// Выполняем свертку
	// Получаем месяц и среднее значение доступности служб в этот месяц в виде массива
	// Для каждого элемента массива вызываем функцию writeAvgTimeOK, которая записывает в БД
	// среднее значение доступности служб за месяц и помечает отчёт с наименьшими показателями
	// меткой leastQuarterly = true;
	// После вызываем publishReport, которая публикует отчёт
	Reports.mapReduce(report, function (err, mapOut) {
		console.log("\nmapOut>> %j", mapOut);
		writeAvgTimeOK((mapOut), publishReport(res, reqId)); 
	});

};		// <--- calculateMin()

module.exports = calcAvgTimeOK;
