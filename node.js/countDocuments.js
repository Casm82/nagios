var mongoose = require('mongoose'),
	calcAvgTimeOK = require('./calcAvgTimeOK');

var docs = 0;
// Ожидаем когда в базу данных будут записаны все три отчёта за квартал

function countDocuments(quarter, cyear) {
	console.log("count>> Считаем документы в БД за " + quarter + " квартал " + cyear + " года");
	var Reports = mongoose.model("Report");
	Reports.count({quarter: quarter, year: cyear }, function (err, mongodocs) {
		docs = mongodocs;
		console.log("count>> Документов в БД на текущий момент: " + mongodocs);
		if (err) throw err ;
		if ( mongodocs < 3) {
			console.log("count>> Документов меньше 3");
			setTimeout( function () {
					console.log("count>> Ждём выполнения запросов в Nagios и записи отчёта в БД");
					calcAvgTimeOK(quarter, cyear);
				}, 1500)
		} else {
//			console.log("Документов в БД на текущий момент: " + mongodocs);
			calcAvgTimeOK();
		}
	});		// <--- Reports.count mongoose
};		// <--- countDocuments()

module.exports = countDocuments;		// <-- запуск countDocuments();
