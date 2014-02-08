var request = require('request'),
	tidy = require('htmltidy').tidy,
	htmlparse = require('./htmlparse'),
	mongoose = require('mongoose');

// Функция выполняет запрос на страницу
function getRequest(url, authparam, quarter, cyear) {
	request.get(url, authparam, function(err, res, nagiosOutput) {
		if (!err && res.statusCode == 200) {
			// Приводим HTML страницу вывода nagios к стандартам W3C
			// с помощью htmltidy
			tidy(nagiosOutput.toString(), function(err, body)
				{ 
					var report = htmlparse(body, quarter, cyear); 
					var Reports = mongoose.model("Report");
					Reports.create(report, function (err, saved) {
						console.log("nagios>> В БД сохранён отчет за период " + saved.range);
						})
				} )
			}
	})
return;
}

module.exports = getRequest;
