var mongoose = require('mongoose');
var Reports = mongoose.model("Report");
function writeAvgTimeOK(array){
	// Получаем массив пар {_id: дата, value: "среднее timeOK"} как mapOut
	// 
	// [
	// 	{ _id: { month: 1, quarter: 1, year: 2013 }, value: 99.76364285714284 },
	// 	{ _id: { month: 2, quarter: 1, year: 2013 }, value: 99.99869047619048 },
	// 	{ _id: { month: 3, quarter: 1, year: 2013 }, value: 99.99097619047619 }
	// ]
	//
	// Месяц с минимальными показателями сохраним в minTimeReport
	var minTimeReport = { "_id": null, "value": Infinity};
	// Для каждого месяца в квартале
	for ( var i in array) 
		{
			// Сохраняем среднее значение в БД
			var docId = array[i]._id;
			var docValue = array[i].value;
		console.log('\nwriteAvgTimeOK >>> записываем среднее значение для %j <--- %d', docId, docValue);
			Reports.findOneAndUpdate( 
				{'date': docId}, 
				{$set: {avgTime: docValue}},
				function (err) { if (err) return err; }
			);

			// Ищем минимальное значение доступности служб за месяц
			if (array[i].value < minTimeReport.value) { minTimeReport = array[i]; };
		
		};	// <--- for ( var i in array)

	// Для месяца с минимальными показателями сохраняем в БД метку
	console.log('\n writeAvgTimeOK >>> записываем метку минимального значения для %j', minTimeReport._id);
	Reports.update({date: minTimeReport._id}, {$set: {leastQuarterly: true}}, 
		function (err, numberAffected) {
			if (err) return err;
			console.log('записано значений minTimeReport: %d', numberAffected);
	});
};		// <--- writeAvgTimeOK()

module.exports = writeAvgTimeOK;
