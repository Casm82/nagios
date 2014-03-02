var mongoose = require('mongoose'),
	calcAvgPercentOK = require('./calcAvgPercentOK'),
	clearForceLabel = require('./clearForceLabel');

var docs = 0;
// Ожидаем когда в базу данных будут записаны все отчёты за квартал

function waitDocuments(res, reqId, expectedDocs, forceReq) {
	var Reports = mongoose.model("Report");
	
	Reports.count({
		'date.quarter': reqId.quarter, 
		'date.year':	reqId.year},
	  function (err, mongodocs) {
		if (err) throw err ;
		docs = mongodocs;

		if (mongodocs < expectedDocs) {
			setTimeout( function () {
				waitDocuments(res, reqId, expectedDocs, forceReq);
			}, 1500);
		} else { // <--- документов ожидаемое кол-во
			// Если был отправлен повторной запрос, то ждём появления отчёта по нему
			if (forceReq) {
				Reports.count({
					'date.quarter': reqId.quarter,
					'date.year': 	reqId.year,
					forceReq:		forceReq},
				  function(err, forceCount){
						if (forceCount) {
							clearForceLabel(reqId);		// Очищаем метку forceReq для квартала
							calcAvgPercentOK(res, reqId);	// все документы в наличии, считаем среднее percentOK
						} else {
							setTimeout( function () {
								waitDocuments(res, reqId, expectedDocs, forceReq);  // повторный запрос
							}, 1500);
						}; // <--- if(forceCount)
				  }
				);
				
			} else { calcAvgPercentOK(res, reqId) }; // если принудительных запросов не было, посчитываем среднее

		}	// <--- (mongodocs < expectedDocs)
	});		// <--- Reports.count mongoose
};		// <--- waitDocuments()

module.exports = waitDocuments;		// <-- запуск waitDocuments();
