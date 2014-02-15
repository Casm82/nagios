var request = require('request'),
	tidy = require('htmltidy').tidy,
	htmlparse = require('./htmlparse'),
	mongoose = require('mongoose');

// Функция выполняет запрос на страницу
function sendRequest(url, authparam, reqId, forceReq) {
	request.get(url, authparam, function(err, res, nagiosOutput) {
		if (err) throw err;
		if (!err && res.statusCode == 200) {
			// Приводим HTML страницу вывода nagios к стандартам W3C
			// с помощью htmltidy
			tidy(nagiosOutput.toString(), function(err, body)
				{ 
					console.log("\n htmlparse #exec %j", reqId);

					var report = htmlparse(body, url, reqId.quarter, reqId.year); 
						report.forceReq = forceReq;
					var Reports = mongoose.model("Report");

					Reports.findOneAndUpdate({date: reqId}, report, {upsert: true}, 
							function (err) { if (err) { throw err; } } ); 
				});
			}
	});
}

module.exports = sendRequest;
