// Печатаем отчёт с минимальной доступностью
var app = require('express');

function printReport(res, reqBody) {
	if (reqBody) {
	// Получаем форму
	// {
	// "quarter":"1","year":"2014",
	// "1C82_Webserver; Production web servers":["1","55"],
	// "2xLoadBalancer; Terminal Services Port":["0","30"],
	// .....
	// "term-pool-x64; Terminal Services Port":["0","0"],
	// "term-pool-x86; Terminal Services Port":["0","0"]
	// }
		var reports = [];
		for (property in reqBody) {
			var values = property.match(/service;(.*);(.*)/)	// Ищем только свойства с service
			if (values) {
			  var svcReport = 
				{
					host: 		values[1],
					service: 	values[2],
					timeIdle:	reqBody[property][0] + "ч " + reqBody[property][1] + "м"
				}
			  reports.push(svcReport);
			}
		}
	}

	var jadeObject = {
		title: "Отчёт о доступности служб за " + reqBody.quarter + " квартал " + reqBody.year + " года", 
		document: reports
	};
	res.render("printReport", jadeObject);
};

module.exports = printReport;
