var getReport = require('../getReport');
var dateNow = new Date();
var yearNow = dateNow.getFullYear();
var monthNow = dateNow.getMonth() + 1;	// Текущий месяц, начало отсчёта с нуля
var quarterNow = Math.ceil(monthNow/3);	// Текущий квартал года

var yearsArray = []; 
for (var i = yearNow; i >= 2012; i--) { yearsArray.push(i) };

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index',
		  {	title: "Анализ отчётов Nagios", 
			quarter: quarterNow, years: yearsArray
		  });
	});
	
	app.post('/getReport', function(req, res, next) {
		console.log('\nindex>>> get user request');
		console.log(req.body);
		if (( req.body.year < yearNow ) || ( req.body.quarter <= quarterNow ))
		{
			getReport(res, monthNow, yearNow, Number(req.body.quarter), Number(req.body.year)); 
		} else {
			res.render('msg', {msg: "Статистика по будущему отсутствует"});
		}
	});
};
