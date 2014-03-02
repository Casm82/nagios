use nagios;

var map = function () { 
	for (var host in this.report) {
		var hostservices =  this.report[host];
		for (var oneservice in hostservices.services) {
			var unwindservice = {
				host: hostservices.host,
				servicename: hostservices.services[oneservice].servicename,
				timeOK: hostservices.services[oneservice].timeOK,
				timeIdle: hostservices.services[oneservice].timeIdle
				};
			emit ( this.date, unwindservice) 
		}
	}
};

var reduce = function(date, reports) {
	var timeOK = 0;
	var timeIdleHrs = 0;
	for (var report in reports)
	{
		var a=reports[report];
		timeOK += a.timeOK;
		timeIdleHrs += a.timeIdle[0];
	};
	return timeOK/reports.length; 			// Среднее значение timeOK сервисов за месяц
};

db.reports.mapReduce(
	map,
	reduce,
	{out: {inline: 1}}
);
