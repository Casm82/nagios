var mongoose = require('mongoose'),
	calcAvgTimeOK = require('./calcAvgTimeOK');

var docs = 0;
// Ожидаем когда в базу данных будут записаны все отчёты за квартал

function waitDocuments(res, reqId, expectedDocs, forceReq) {

	console.log("\nwaitDocuments>> Считаем документы в БД за " + reqId.quarter + " квартал " + reqId.year + " года");

	var Reports = mongoose.model("Report");
	
	Reports.count({
		'date.quarter': reqId.quarter, 
		'date.year':	reqId.year},
	  function (err, mongodocs) {
		if (err) throw err ;
		docs = mongodocs;

		console.log("\nwaitDocuments>> Документов в БД на текущий момент: " + mongodocs);
		console.log("\nwaitDocuments>>Ожидали документов: %d , запрос %d, %d", expectedDocs, reqId.quarter, reqId.year);

		if (mongodocs < expectedDocs) {
			setTimeout( function () {
				waitDocuments(res, reqId, expectedDocs, forceReq);
			}, 1500);
		} else { // <--- документов ожидаемое кол-во
		console.log('\n waitDocuments>> проверяем на forceReq %d', forceReq);
			// Если был отправлен повторной запрос, то ждём появления отчёта по нему
			if (forceReq) {
				Reports.count({
					'date.quarter': reqId.quarter,
					'date.year': 	reqId.year,
					forceReq:		forceReq},
				  function(err, forceCount){
						if (forceCount) {calcAvgTimeOK(res, reqId)
						} else {
							setTimeout( function () {
								waitDocuments(res, reqId, expectedDocs, forceReq);
							}, 1500);
						}; // <--- forceCount = 0
				  }
				);
				
			} else { calcAvgTimeOK(res, reqId) };

		}	// <--- (mongodocs < expectedDocs)
	});		// <--- Reports.count mongoose
};		// <--- waitDocuments()

module.exports = waitDocuments;		// <-- запуск waitDocuments();
