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

};
