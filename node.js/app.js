var express = require('express'),
	mongoose = require('mongoose'),
	http = require('http'),
	path = require('path'),
	routes = require('./routes'),
	app = express();

// переменные окружения
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('x-powered-by', false);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Подключаемся к MongoDB
mongoose.connect("mongodb://localhost/nagios", function (err) {
	if (err) throw err;
	routes(app);
});		// <--- mongoose.connect()


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on http://localhost:' + app.get('port'));
});

//app.listen(app.get('port'));
