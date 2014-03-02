var sendRequest = require('./sendRequest'),
	mongoose = require('mongoose');

function checkExistingReports(url, authparam, reqId, forceReq){
if (forceReq) 
  { 
	sendRequest(url, authparam, reqId, forceReq);			// <--- sendRequest
  } else {
	var Reports = mongoose.model("Report");
	Reports.count({
		'date.month':	reqId.month,
		'date.quarter':	reqId.quarter,
		'date.year': 	reqId.year
	}, function(err, numDocs) {
		// Если отчётов нет, то выполняем запрос в Nagios
		if (numDocs == 0) { 
			sendRequest(url, authparam, reqId, forceReq); // <--- sendRequest
		};
	});
  } // <--- if
} // <--- checkExistingReports

module.exports = checkExistingReports;
