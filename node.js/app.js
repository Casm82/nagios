var express = require('express'),
	expressMiddlewares = require('express-middlewares'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	models = require('./models'),
	http = require('http'),
	path = require('path'),
	routes = require('./routes'),
	app = express();

// переменные окружения
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('x-powered-by', false);
app.use(expressMiddlewares.favicon());
app.use(expressMiddlewares.bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'static')));


// Подключаемся к MongoDB
mongoose.connect("mongodb://localhost/nagios", function (err) {
	if (err) throw err;
	routes(app);
});		// <--- mongoose.connect()


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on http://localhost:' + app.get('port'));
});