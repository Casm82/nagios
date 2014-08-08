var mongoose = require('mongoose'),
	Reports = mongoose.model("Report"),
	publishReport = require('./publishReport');

function writeAvgPercentOK(array, res, reqId){
	// Получаем массив пар {_id: дата, value: "среднее percentOK"} как mapOut
	// 
	// [
	// 	{ _id: { month: 1, quarter: 1, year: 2013 }, value: {"avgPercentOK":99.98851219512194,"avgTimeIdle":[0,2]} },
	// 	{ _id: { month: 2, quarter: 1, year: 2013 }, value: {"avgPercentOK":99.98851219512194,"avgTimeIdle":[0,3]} },
	// 	{ _id: { month: 3, quarter: 1, year: 2013 }, value: {"avgPercentOK":99.98851219512194,"avgTimeIdle":[0,4]} },
	// ]
	//
	// Месяц с минимальными показателями сохраним в minTimeReport
	var minTimeReport = { "_id": null, "value": {"avgPercentOK": Infinity, "avgTimeIdle": []}};
	// Для каждого месяца в квартале
	for ( var i in array) 
		{
			// Сохраняем среднее значение в БД
			var docId = array[i]._id;
			var avgPercentOK = (array[i].value.avgPercentOK).toFixed(4);
			var avgTimeIdle =(array[i].value.avgTimeIdle);
			Reports.findOneAndUpdate( 
				{'date': docId}, 
				{$set: {avgTime: avgPercentOK, avgTimeIdle: avgTimeIdle}},
				function (err) { if (err) return err; }
			);

			// Ищем минимальное значение доступности служб за месяц
			if (avgPercentOK < minTimeReport.value.avgPercentOK) { minTimeReport = array[i]; };
		};	// <--- for ( var i in array)

	// Для месяца с минимальными показателями сохраняем в БД метку
	// Предварительно, очищаем старые метки
	Reports.count( {"leastQuarterly": true}, function(err, nums) {
		if (err) return err;
		if (nums) {
		console.log(nums);
			Reports.update({"leastQuarterly": true}, {$set: {"leastQuarterly": false}}, 
				function (err) {
					if (err) return err;
					Reports.update({date: minTimeReport._id}, {$set: {"leastQuarterly": true}}, 
						function (err) {
							if (err) return err;
							publishReport(res, reqId);
					});
			});
			}
		}
	);


};		// <--- writeAvgPercentOK()

module.exports = writeAvgPercentOK;
