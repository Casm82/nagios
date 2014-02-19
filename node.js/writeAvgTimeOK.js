var mongoose = require('mongoose'),
	Reports = mongoose.model("Report"),
	publishReport = require('./publishReport');

function writeAvgTimeOK(array, res, reqId){
	// Получаем массив пар {_id: дата, value: "среднее timeOK"} как mapOut
	// 
	// [
	// 	{ _id: { month: 1, quarter: 1, year: 2013 }, value: {"avgTimeOK":99.98851219512194,"avgTimeIdle":"0ч2м"} },
	// 	{ _id: { month: 2, quarter: 1, year: 2013 }, value: {"avgTimeOK":99.98851219512194,"avgTimeIdle":"0ч2м"} },
	// 	{ _id: { month: 3, quarter: 1, year: 2013 }, value: {"avgTimeOK":99.98851219512194,"avgTimeIdle":"0ч2м"} },
	// ]
	//
	// Месяц с минимальными показателями сохраним в minTimeReport
	var minTimeReport = { "_id": null, "value": {"avgTimeOK": Infinity, "avgTimeIdle": null}};
	// Для каждого месяца в квартале
	for ( var i in array) 
		{
			// Сохраняем среднее значение в БД
			var docId = array[i]._id;
			var avgTimeOK = (array[i].value.avgTimeOK).toFixed(4);
			var avgTimeIdle =(array[i].value.avgTimeIdle);
		console.log('\nwriteAvgTimeOK >>> записываем среднее значение для %j <--- %d', docId, avgTimeOK);
			Reports.findOneAndUpdate( 
				{'date': docId}, 
				{$set: {avgTime: avgTimeOK, avgTimeIdle: avgTimeIdle}},
				function (err) { if (err) return err; }
			);

			// Ищем минимальное значение доступности служб за месяц
			if (avgTimeOK < minTimeReport.value.avgTimeOK) { minTimeReport = array[i]; };
	console.log(minTimeReport);	
		};	// <--- for ( var i in array)

	// Для месяца с минимальными показателями сохраняем в БД метку
	console.log('\n writeAvgTimeOK >>> записываем метку минимального значения для %j', minTimeReport._id);
	Reports.update({date: minTimeReport._id}, {$set: {leastQuarterly: true}}, 
		function (err, numberAffected) {
			if (err) return err;
			console.log('writeAvgTimeOK>> записано значений minTimeReport: %d', numberAffected);
			console.log('writeAvgTimeOK>> публикуем отчёт');
			publishReport(res, reqId);
	});
};		// <--- writeAvgTimeOK()

module.exports = writeAvgTimeOK;
