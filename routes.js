// app/routes.js

var mysql = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('profile.ejs');
	});

	app.get('/profile', function(req, res) {
		res.redirect('/');
	});

	app.get('/prayer', function(req, res) {
		connection.query("SELECT * FROM MyPrayers", function(err1, row1) {
			if (err1)
				console.log(err1);
			else {
				connection.query("SELECT * FROM OtherPrayers", function(err2, row2) {
					if (err2)
						console.log(err2);
					else {
						res.render('prayer.ejs', {myprayers : row1, otherprayers : row2});
					}
				});
			}
		});
	});

	app.get('/prayer_edit', function(req, res) {
		connection.query("SELECT * FROM MyPrayers", function(err1, row1) {
			if (err1)
				console.log(err1);
			else {
				connection.query("SELECT * FROM OtherPrayers", function(err2, row2) {
					if (err2)
						console.log(err2);
					else {
						res.render('prayer_edit.ejs', {myprayers : row1, otherprayers : row2});
					}
				});
			}
		});
	});

	app.get('/ccc', function(req, res){
		res.render('ccc.ejs');
	});

	app.post('/addotherprayer', function(req, res){
		var detail = req.body.pray_detail;
		var user = req.body.pray_name;
		if (user == "")
			user = "익명";
		connection.query("INSERT INTO OtherPrayers (user, detail, post_date) values (?,?,NOW());", [user, detail], function(err, rows) {
			if (err)
				console.log(err);
			else {
				res.redirect('/prayer');
			}
		});
	});
	
	app.post('/addmyprayer', function(req, res){
		var detail = req.body.pray_add;
		connection.query("INSERT INTO MyPrayers (detail) values (?);", [detail], function(err, rows) {
			if (err)
				console.log(err);
			else {
				res.redirect('/prayer_edit');
			}
		});
	});
};
