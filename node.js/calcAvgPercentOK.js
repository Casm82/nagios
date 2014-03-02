// Определяем минимальное значение доступности служб по месяцам за квартал
var mongoose = require('mongoose'),
	writeAvgPercentOK = require('./writeAvgPercentOK.js');

function calcAvgPercentOK (res, reqId) {
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
				percentOK: hostservices.services[oneservice].percentOK,
				timeIdle: hostservices.services[oneservice].timeIdle,
				duration: duration
				};
			emit ( this.date, unwindservice) 
		}
	}
	};

	// Функция для каждого значения {дата, [{отчёт},{отчёт},{отчёт}...] }
	// считает среднее значение {отчёт}
	report.reduce = function(date, reports) { 
		var percentOK = 0;
		var timeIdleSec = 0;
		for (var report in reports)
		{
			percentOK += reports[report].percentOK;				// Сумма percentOK сервисов за месяц
			timeIdleSec += reports[report].timeIdle[2];
		};
	
		var avgPercentOK = percentOK/reports.length;			// Среднее значение percentOK сервисов за месяц
		var avgTimeIdleSec = timeIdleSec/reports.length;

		var avgTimeIdleHrs = Math.floor(avgTimeIdleSec/3600);
		var avgTimeIdleMin = Math.round(avgTimeIdleSec/60 - avgTimeIdleHrs*60);
		var avgTimeIdle = [avgTimeIdleHrs, avgTimeIdleMin];		// Время простоя [часы, минуты]

	return {avgPercentOK: avgPercentOK, avgTimeIdle: avgTimeIdle};
	};

	report.verbose = false;

	report.query = {'date.quarter': reqId.quarter, 'date.year': reqId.year } ;

	// Выполняем свертку
	// Получаем месяц и среднее значение доступности служб в этот месяц в виде массива
	// Для каждого элемента массива вызываем функцию writeAvgPercentOK, которая записывает в БД
	// среднее значение доступности служб за месяц и помечает отчёт с наименьшими показателями
	// меткой leastQuarterly = true;
	// После вызываем publishReport, которая публикует отчёт
	Reports.mapReduce(report, function (err, mapOut) {
		writeAvgPercentOK(mapOut, res, reqId); 
	});

};		// <--- calculateMin()

module.exports = calcAvgPercentOK;
