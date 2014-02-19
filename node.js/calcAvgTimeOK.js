// Определяем минимальное значение доступности служб по месяцам за квартал
var mongoose = require('mongoose'),
	writeAvgTimeOK = require('./writeAvgTimeOK.js');

function calcAvgTimeOK (res, reqId) {
//	console.log("\ncalcAvg>> Считаем средние значение доступности по месяцам");
	var Reports = mongoose.model("Report");

	var report = {};

	// Функция выпускает значения {дата, [{отчёт},{отчёт},{отчёт}...] }
	report.map = function () { 
	var duration = this.duration;
	for (var host in this.report) {		//  <--- сервер со службами
		var hostservices =  this.report[host];	//<--- службы сервера
		for (var oneservice in hostservices.services) {
			var unwindservice = {
				host: hostservices.host,
				servicename: hostservices.services[oneservice].servicename,
				timeOK: hostservices.services[oneservice].timeOK,
				duration: duration
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
	
		var avgTimeOK = timeOK/reports.length;		// Среднее значение timeOK сервисов за месяц

		var avgTimeIdleSec = (1 - avgTimeOK/100)*reports[0].duration;	// Простой в секундах
		var avgTimeIdleHrs = Math.floor(avgTimeIdleSec/3600);			// Часы простоя
		var avgTimeIdleMin = Math.round(avgTimeIdleSec/60 - avgTimeIdleHrs*60); // Минуты простоя
		var avgTimeIdle = avgTimeIdleHrs + "ч" + avgTimeIdleMin + "м";

	return {avgTimeOK: avgTimeOK, avgTimeIdle: avgTimeIdle};
//	return avgTimeOK;
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
		writeAvgTimeOK(mapOut, res, reqId); 
	});

};		// <--- calculateMin()

module.exports = calcAvgTimeOK;
