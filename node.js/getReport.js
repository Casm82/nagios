function getReport(res){

var sendRequest = require('./sendRequest'),
	getLastMonthDay = require('./getLastMonthDay'),
	waitDocuments = require('./waitDocuments'),
	mongoose = require('mongoose'),
	models = require('./models');

//mongoose.set('debug', true);

// Параметры запроса в Nagios
  // Период отчёта
	var service_grp = "Production_services"
	var rpttimeperiod = "workhours"
	var cdate = new Date();
	var cyear = cdate.getFullYear();
	var cyear = 2013;
	var cmonth = cdate.getMonth() + 1 ;  // Текущий месяц, начало отсчёта с нуля
	var quarter = Math.ceil(cmonth/3);   // Квартал года
	var sday=1,syear=cyear,shour=0,smin=0,ssec=0,		// Временные интервалы запроса
		eyear=cyear,ehour=23,emin=59,esec=59;
  // Аутентификация	
	var authparam = {'auth': 
					{
						'user': 'user',
						'pass': 'monitor',
						'sendImmediately': true
					}
				}

// Цикл по месяцам квартала
for ( var i = 1; i <= 3; i++)
{
	var smon = emon = i + 3*(quarter - 1);	// Месяц
	var eday = getLastMonthDay(smon);		// Последний день месяца
	// Адрес запроса
	var url =	"http://nagios.domain.ru/nagios/cgi-bin/avail.cgi?" + 
			"show_log_entries=&servicegroup=" + service_grp +
			"&timeperiod=custom" + 
			"&smon=" + smon + "&sday=" + sday + "&syear=" + syear + "&shour=" + shour + "&smin=" + smin + "&ssec=" + ssec + 
			"&emon=" + emon + "&eday=" + eday + "&eyear=" + eyear + "&ehour=" + ehour + "&emin=" + emin + "&esec=" + esec + 
			"&rpttimeperiod=" + rpttimeperiod + 
			"&assumeinitialstates=yes&assumestateretention=yes" +
			"&assumestatesduringnotrunning=yes" + 
			"&includesoftstates=no" +
			"&initialassumedhoststate=3" + 
			"&initialassumedservicestate=6" + 
			"&backtrack=4";

// Выполняем запрос в Nagios для каждого месяца квартала
//sendRequest(url, authparam, quarter, cyear );

}	// <---	for

waitDocuments(quarter, cyear, res);		// <-- запуск waitDocuments(месяц, квартал, год, express);

};		// <--- getReport

module.exports = getReport;
