var mongoose = require('mongoose'),
	calcAvgTimeOK = require('./calcAvgTimeOK');

var docs = 0;
// Ожидаем когда в базу данных будут записаны все три отчёта за квартал

function waitDocuments(quarter, cyear, res) {
	console.log("\ncount>> Считаем документы в БД за " + quarter + " квартал " + cyear + " года");
	var Reports = mongoose.model("Report");
	Reports.count({'date.quarter': quarter, 'date.year': cyear }, function (err, mongodocs) {
		docs = mongodocs;
		console.log("\ncount>> Документов в БД на текущий момент: " + mongodocs);
		if (err) throw err ;
		if ( mongodocs < 3) {
			console.log("\ncount>> Документов меньше 3");
			setTimeout( function () {
					console.log("\ncount>> Ждём выполнения запросов в Nagios и записи отчёта в БД");
					waitDocuments(quarter, cyear, res);
				}, 1500)
		} else {
//			console.log("Документов в БД на текущий момент: " + mongodocs);
			console.log("\ncount>> Документов 3 или больше");
			calcAvgTimeOK(res);
		}
	});		// <--- Reports.count mongoose
};		// <--- waitDocuments()

module.exports = waitDocuments;		// <-- запуск waitDocuments();
