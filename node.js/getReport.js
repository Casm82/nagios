function getReport(res, monthNow, yearNow , quarterReq, yearReq){

var getLastMonthDay = require('./getLastMonthDay'),
	waitDocuments = require('./waitDocuments'),
	checkExistingReports = require('./checkExistingReports'),
	mongoose = require('mongoose');

//mongoose.set('debug', true);

// Параметры запроса в Nagios
  // Аутентификация	
	var authparam = {'auth': 
					{
						'user': 'user',
						'pass': 'monitor',
						'sendImmediately': true
					}
				}

  // Период отчёта
	var service_grp = "Production_services"
	var rpttimeperiod = "workhours"
	var sday=1,syear=yearReq,shour=0,smin=0,ssec=0,		// Временные интервалы запроса
		eyear=yearReq,ehour=23,emin=59,esec=59;

// Переменная,expectedDocs хранит ожидаемое кол-во документов в БД
// если расчёт выполняется для текущего квартала
// когда нет полной статистики
// Переменная forceReq - метка, что повторно выполняется запрос для текущего месяца
	var expectedDocs = 0;
	var forceReq = false;

// Цикл по месяцам квартала
for ( var i = 1; i <= 3; i++)
{
	var smon = emon = i + 3*(quarterReq - 1);	// Месяц расчёта
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

	// Создаём идентификатор документа по введённым данным квартала и года
	// forceReq - если выполняется запрос для текущего месяца, то принудительно 
	// отправить запрос в Nagios и обновить существующий документ в БД
	var reqId = { month: smon, quarter: quarterReq, year: yearReq };
	forceReq = ((smon == monthNow) && (syear == yearNow));

	// Ищем существующие отчёты в БД
	// Выполняем запрос в Nagios для каждого месяца квартала
	// если запращиваемый момент времени не больше текущего 
	// и увеличиваем счётчик ожидаемых в БД документов
	if ( (yearReq < yearNow) || (smon <= monthNow) ) {
		
		console.log("\n checkExistingReports #exec month: %d, year: %d", smon, yearReq);
		console.log("\n forceCheck %s", forceReq);
		
		checkExistingReports(url, authparam, reqId, forceReq);

		expectedDocs++;
	};

}  // <---	for

console.log("\nwaitDocuments #exec, force %d", forceReq);
waitDocuments(res, reqId, expectedDocs, forceReq); // <-- запуск waitDocuments(express, {квартал, год}, кол-во док);

};		// <--- getReport

module.exports = getReport;
