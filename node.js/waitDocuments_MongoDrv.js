var MongoClient = require('mongodb').MongoClient,
	calcAvgTimeOK = require('./calcAvgTimeOK');

var docs = 0;
// Ожидаем когда в базу данных будут записаны все три отчёта за квартал

function waitDocuments(quarter, cyear, app) {
	console.log("waitDocuments app>> " + app);
	console.log("count>> Считаем документы в БД за " + quarter + " квартал " + cyear + " года");

	MongoClient.connect('mongodb://localhost:27017/nagios', function(err, db) {
		if (err) throw err ;

		var query = {"date.quarter" : quarter, "date.year" : cyear};
		
		db.collection('reports').find(query).count(function(err, mongodocs) {
				docs = mongodocs;
				console.log("count>> Документов в БД на текущий момент: " + mongodocs);
				db.close();
		});
		
		
		if ( docs < 3) {
			console.log("count>> Документов меньше 3");
			setTimeout( function () {
					console.log("count>> Ждём выполнения запросов в Nagios и записи отчёта в БД");
					waitDocuments(quarter, cyear, app);
				}, 1500)
		} else {
//			console.log("Документов в БД на текущий момент: " + mongodocs);
			console.log("count>> Документов больше 3");
console.log("waitDocuments count app>> " + app);
			calcAvgTimeOK(app);
		}
	});		// <--- Reports.count mongoose
};		// <--- waitDocuments()

module.exports = waitDocuments;		// <-- запуск waitDocuments();
