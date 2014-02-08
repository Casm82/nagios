var getReport = require('../getReport');

module.exports = function(app) {

	app.get('/', function(req, res) {
		getReport(res);
	});
};
