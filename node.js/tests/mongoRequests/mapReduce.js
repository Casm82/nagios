use nagios;

var map = function () { 
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

var reduce = function(date, reports) { 
	var timeOK = 0;
	for (var report in reports)
	{
		timeOK += reports[report].timeOK;	// Сумма timeOK сервисов из месяц
	};
	return timeOK/reports.length; 			// Среднее значение timeOK сервисов за месяц
};

db.reports.mapReduce(
	map,
	reduce,
	{out: {inline: 1}}
);
