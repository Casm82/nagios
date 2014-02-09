var getReport = require('../getReport');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', {title: ""});
	});
	
	app.get('/getReport', function(req, res) {
		getReport(res);
	});
};
