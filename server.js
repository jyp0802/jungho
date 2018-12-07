//server0.js
var express = require('express');
var session  = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

//app.use(morgan('dev'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(flash());

//
app.use(express.static('static'));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);


require('./routes.js')(app);

/* 서버를 port 8080로 실행 */
var server = app.listen(8080, function() {
	console.log("Server running");
});
