// Определяем минимальное значение доступности служб по месяцам за квартал
var mongoose = require('mongoose'),
	app = require('express'),
	publishReport = require('./publishReport');

function calcAvgTimeOK (quarter, year, res) {
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

	function writeAvgTimeOK(array){
		// Месяц с минимальными показателями сохраним в minTimeReport
		var minTimeReport = { "_id": null, "value": Infinity};

		// Для каждого месяца в квартале
		for ( var i in array) 
			{
				// Сохраняем среднее значение в БД
				Reports.update({date: array[i]._id}, {$set: {averageOK: array[i].value}}, 
					function (err, numberAffected) {
					  if (err) return err;
						console.log('The number of updated documents averageOK was %d', numberAffected);
					});

				// Ищем минимальное значение доступности служб за месяц
				if (array[i].value < minTimeReport.value) { minTimeReport = array[i]; };
			
			};	// <--- for ( var i in array)

		// Для месяца с минимальными показателями сохраняем в БД метку
		Reports.update({date: minTimeReport._id}, {$set: {leastQuarterly: true}}, 
			function (err, numberAffected) {
			  if (err) return err;
				console.log('The number of updated documents minTimeReport was %d', numberAffected);
			});
				
		};		// <--- writeAvgTimeOK()

	// Выполняем свертку
	// Получаем месяц и среднее значение доступности служб в этот месяц в виде массива
	// Для каждого элемента массива вызываем функцию writeAvgTimeOK, которая записывает в БД
	// среднее значение доступности служб за месяц и помечает отчёт с наименьшими показателями
	// меткой leastQuarterly = true;
	// После вызываем publishReport, которая публикует отчёт
	Reports.mapReduce(report, function (err, mapOut) { writeAvgTimeOK(mapOut), publishReport(quarter, year, res); });

};		// <--- calculateMin()

module.exports = calcAvgTimeOK;
