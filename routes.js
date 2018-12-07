// app/routes.js

var mysql = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('profile.ejs');
	});

	app.get('/notice', function(req, res) {
		res.render('notice.ejs');
	})

	app.get('/details', function(req, res) {
		if (req.query.t == "c") {
			connection.query("SELECT * FROM Classes where cid = ?", [req.query.cid], function(err1, rows1) {
				if (err1)
					console.log(err1);
				if (rows1.length == 0)
					res.redirect('/confirm?t=de');
				else {
					connection.query("SELECT * FROM Users where uid = ? and cid = ?", [req.user.uid, req.query.cid], function(err2, rows2) {
						if (err2)
							console.log(err2);
						var box_type = "bigbox";
						if (rows1[0].speaker == "연규운 목사")
							box_type += "1"
						else if (rows1[0].speaker == "VLM")
							box_type += "2"
						res.render('detail.ejs', {type : "class", box : box_type, classinfo : rows1[0], registered : (rows2.length > 0)});
					});
				}
			});
		}
		else {
			connection.query("SELECT * FROM Bible where bid = ?", [req.query.bid], function(err1, rows1) {
				if (err1)
					console.log(err1);
				if (rows1.length == 0)
					res.redirect('/confirm?t=de');
				else {
					connection.query("SELECT * FROM Users where uid = ? and bid = ?", [req.user.uid, req.query.bid], function(err2, rows2) {
						if (err2)
							console.log(err2);
						res.render('detail.ejs', {type : "bible", bibleinfo : rows1[0], registered : (rows2.length > 0)});
					});
				}
			});
		}
	});

	app.get('/cancel', function(req, res) {
		if (req.query.t == "c") {
			connection.query("SELECT cid from Users where uid = ?", [req.user.uid], function(err, rows) {
				if (err)
					res.redirect('/confirm?t=e');
				else if (rows[0].cid == null || rows[0].cid != req.query.cid)
					res.redirect('/confirm?t=cet');
				else {
					connection.query("UPDATE Classes SET current = (current - 1) where cid = ?", [req.query.cid], function(err1, rows1) {
						if (err1)
							res.redirect('/confirm?t=ce');
						else {
							connection.query("UPDATE Users SET cid = null where uid = ?", [req.user.uid], function(err, rows) {
								if (err)
									res.redirect('/confirm?t=e');
								else
									res.redirect('/confirm?t=cs');
							})
						}
					})
				}
			})
		}
		else {
			connection.query("SELECT bid from Users where uid = ?", [req.user.uid], function(err, rows) {
				if (err)
					res.redirect('/confirm?t=e');
				else if (rows[0].bid == null || rows[0].bid != req.query.bid)
					res.redirect('/confirm?t=cet');
				else {
					connection.query("UPDATE Bible SET current = (current - 1) where bid = ?", [req.query.bid], function(err1, rows1) {
						if (err1)
							res.redirect('/confirm?t=ce');
						else {
							connection.query("UPDATE Users SET bid = null where uid = ?", [req.user.uid], function(err, rows) {
								if (err)
									res.redirect('/confirm?t=e');
								else
									res.redirect('/confirm?t=cs');
							})
						}
					})
				}
			})
		}
	})

	app.get('/register', function(req, res) {
		if (req.query.t == "c") {
			connection.query("SELECT cid from Users where uid = ?", [req.user.uid], function(err, rows) {
				if (err)
					res.redirect('/confirm?t=e');
				else if (rows[0].cid == req.query.cid)
					res.redirect('/confirm?t=ret');
				else if (rows[0].cid != null)
					res.redirect('/confirm?t=red');
				else {
					connection.query("UPDATE Classes SET current = (current + 1) where cid = ?", [req.query.cid], function(err1, rows1) {
						if (err1)
							res.redirect('/confirm?t=ref');
						else {
							connection.query("UPDATE Users SET cid = ? where uid = ?", [req.query.cid, req.user.uid], function(err, rows) {
								if (err)
									res.redirect('/confirm?t=e');
								else
									res.redirect('/confirm?t=rs');
							})
						}
					})
				}
			})
		}
		else {
			connection.query("SELECT bid from Users where uid = ?", [req.user.uid], function(err, rows) {
				if (err)
					res.redirect('/confirm?t=e');
				else if (rows[0].bid == req.query.bid)
					res.redirect('/confirm?t=ret');
				else if (rows[0].bid != null)
					res.redirect('/confirm?t=red');
				else {
					connection.query("UPDATE Bible SET current = (current + 1) where bid = ?", [req.query.bid], function(err1, rows1) {
						if (err1)
							res.redirect('/confirm?t=ref');
						else {
							connection.query("UPDATE Users SET bid = ? where uid = ?", [req.query.bid, req.user.uid], function(err, rows) {
								if (err)
									res.redirect('/confirm?t=e');
								else
									res.redirect('/confirm?t=rs');
							})
						}
					})
				}
			})
		}
	})

	app.get('/confirm', function(req, res){
		res.render('confirm.ejs', {t : req.query.t});
	});

	app.get('/my', function(req, res) {
		connection.query("SELECT cid, bid FROM Users where uid = ?", [req.user.uid], function(err, rows) {
			connection.query("SELECT * FROM Classes where cid = ?", [rows[0].cid], function(err1, rows1) {
				connection.query("SELECT * FROM Bible where bid = ?", [rows[0].bid], function(err2, rows2) {
					if (err || err1 || err2)
						res.redirect('/confirm?t=e');
					var creg = true;
					var breg = true;
					if (!rows1.length)
						creg = false;
					if (!rows2.length)
						breg = false;
					res.render('my.ejs', {creg : creg, breg : breg, classinfo : rows1[0], bibleinfo : rows2[0]});
				})
			})
		})
	});

	app.get('/overview', function(req, res) {
		res.render('overviewauthenticate.ejs', {wrong : false});
	});

	app.post('/overview', function(req, res) {
		if (req.body.password == overview_pw) {
			connection.query("SELECT cid, title FROM Classes", function(err1, classes) {
				if (err1) console.log(err1);
				connection.query("SELECT bid, title FROM Bible", function(err2, bibles) {
					if (err2) console.log(err2);
					connection.query("SELECT name, campus, cid, bid FROM Users", function(err, rows) {
						var classlist = [["미신청"]];
						var biblelist = [["미신청"]];
						for (i in classes)
							classlist.push([classes[i].title]);
						for (i in bibles)
							biblelist.push([bibles[i].title]);
						for (p in rows) {
							var assert = require('assert');
							assert(rows[p].cid != 19);
							var cid = rows[p].cid
							if (rows[p].cid > 19)
								cid -= 1;
							classlist[cid==null ? 0 : cid].push({name : rows[p].name, campus : rows[p].campus});
							biblelist[rows[p].bid==null ? 0 : rows[p].bid].push({name : rows[p].name, campus : rows[p].campus});
						}
						// for (c in classlist)
						// 	classlist[c] = classlist[c].sort(nameCompare);
						// for (b in biblelist)
						// 	biblelist[b] = biblelist[b].sort(nameCompare);
						res.render('overview.ejs', {classlist : classlist, biblelist : biblelist});
					})	
				})
			})
		}
		else {
			res.render('overviewauthenticate.ejs', {wrong : true});
		}
	})

};

function nameCompare(a, b){
	if (a.name == undefined || b.name == undefined)
		return 0;
	if (a.name < b.name)
		return -1 
	if (a.name > b.name)
		return 1
	return 0
}
