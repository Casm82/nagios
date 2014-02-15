var mongoose = require('mongoose'),
	calcAvgTimeOK = require('./calcAvgTimeOK'),
	clearForceLabel = require('./clearForceLabel');

var docs = 0;
// Ожидаем когда в базу данных будут записаны все отчёты за квартал

function waitDocuments(res, reqId, expectedDocs, forceReq) {
	console.log("\nwaitDocuments>> date: %j, expectedDocs: %d, forceReq: %d", reqId, expectedDocs, forceReq);

	var Reports = mongoose.model("Report");
	
	Reports.count({
		'date.quarter': reqId.quarter, 
		'date.year':	reqId.year},
	  function (err, mongodocs) {
		if (err) throw err ;
		docs = mongodocs;

		console.log("\nwaitDocuments>> Документов в БД на текущий момент: " + mongodocs);
		console.log("waitDocuments>> Ожидали документов: %d , запрос %j", expectedDocs, reqId);

		if (mongodocs < expectedDocs) {
			setTimeout( function () {
		console.log("waitDocuments>> недостаточно документов, повторный запрос подсчёта");
				waitDocuments(res, reqId, expectedDocs, forceReq);
			}, 1500);
		} else { // <--- документов ожидаемое кол-во
		console.log('waitDocuments>> Проверяем на forceReq %d', forceReq);
			// Если был отправлен повторной запрос, то ждём появления отчёта по нему
			if (forceReq) {
				Reports.count({
					'date.quarter': reqId.quarter,
					'date.year': 	reqId.year,
					forceReq:		forceReq},
				  function(err, forceCount){
						if (forceCount) {
							clearForceLabel(reqId);		// Очищаем метку forceReq для квартала
							calcAvgTimeOK(res, reqId);	// все документы в наличии, считаем среднее timeOK
						} else {
							setTimeout( function () {
		console.log("waitDocuments>> принудительный запрос ещё не отбработан, повторный запрос подсчёта");
								waitDocuments(res, reqId, expectedDocs, forceReq);  // повторный запрос
							}, 1500);
						}; // <--- if(forceCount)
				  }
				);
				
			} else { calcAvgTimeOK(res, reqId) }; // если принудительных запросов не было, посчитываем среднее

		}	// <--- (mongodocs < expectedDocs)
	});		// <--- Reports.count mongoose
};		// <--- waitDocuments()

module.exports = waitDocuments;		// <-- запуск waitDocuments();
