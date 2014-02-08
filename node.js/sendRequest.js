var request = require('request'),
	tidy = require('htmltidy').tidy,
	htmlparse = require('./htmlparse'),
	mongoose = require('mongoose');

// Функция выполняет запрос на страницу
function sendRequest(url, authparam, quarter, cyear) {
	request.get(url, authparam, function(err, res, nagiosOutput) {
		if (!err && res.statusCode == 200) {
			// Приводим HTML страницу вывода nagios к стандартам W3C
			// с помощью htmltidy
			tidy(nagiosOutput.toString(), function(err, body)
				{ 
					var report = htmlparse(body, url, quarter, cyear); 
					var Reports = mongoose.model("Report");
					Reports.create(report, function (err, saved) {
						if (err) {
							if ((err.code == 11000) && (err.name == "MongoError")) {
								console.log(err);
								throw new Error("Дубликат отчёта");
							} else {
								throw new Error("Ошибка сохранения записи в БД");
							}

						}
						console.log("\nnagios>> В БД сохранён отчет за период " + saved._id);
						})
				} )
			}
	})
return;
}

module.exports = sendRequest;
