var sendRequest = require('./sendRequest'),
	mongoose = require('mongoose');

function checkExistingReports(url, authparam, reqId, forceReq){
if (forceReq) 
  { 
	console.log('\ncheckExistingReports>>> Принудительно отправляем запрос в nagios %j', reqId);
	sendRequest(url, authparam, reqId, forceReq);			// <--- sendRequest
  } else {
	console.log('\ncheckExistingReports>>> Получаем отчёт из БД: %j', reqId);
	var Reports = mongoose.model("Report");
	Reports.count({
		'date.month':	reqId.month,
		'date.quarter':	reqId.quarter,
		'date.year': 	reqId.year
	}, function(err, numDocs) {
		console.log("checkExistingReports>>> В БД обнаружено %d документов, %j", numDocs, reqId);
		// Если отчётов нет, то выполняем запрос в Nagios
		if (numDocs == 0) { 
			sendRequest(url, authparam, reqId, forceReq); // <--- sendRequest
		};
	});
  } // <--- if
} // <--- checkExistingReports

module.exports = checkExistingReports;
