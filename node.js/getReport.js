var getRequest = require('./getRequest'),
	getLastMonthDay = require('./getLastMonthDay'),
	mongoose = require('mongoose'),
	models = require('./models');

var countDocuments = require('./countDocuments');

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


// Подключаемся к MongoDB
mongoose.connect("mongodb://localhost/nagios", function (err) {
if (err) throw err;

// Цикл по месяцам квартала
for ( var i = 1; i <= 3; i++)
{
	var smon = emon = i + 3*(quarter - 1);	// Месяц
	var eday = getLastMonthDay(smon);		// Последний день месяца
	// Адрес запроса
	var url =	"http://nagios.kupol.ru/nagios/cgi-bin/avail.cgi?" + 
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
getRequest(url, authparam, quarter, cyear );

}	// <---	for

countDocuments(quarter, cyear);		// <-- запуск countDocuments();


});		// <--- mongoose.connect()
