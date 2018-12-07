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
		res.render('profile.ejs');
	})

	app.get('/prayer', function(req, res) {
		connection.query("SELECT * FROM Prayers", [req.query.cid], function(err, rows) {
			if (err)
				console.log(err);
			else {
				res.render('prayer.ejs', {prayerlist : rows});
			}
		});
	})

	app.get('/ccc', function(req, res){
		res.render('ccc.ejs');
	});

	app.post('/addprayer', function(req, res){
		var detail = req.body.pray_detail;
		var user = req.body.pray_name;
		if (user == "")
			user = "익명";
		connection.query("INSERT INTO Prayers (user, detail, post_date) values (?,?,NOW());", [user, detail], function(err, rows) {
			if (err)
				console.log(err);
			else {
				res.redirect('/prayer');
			}
		});
	});
};
