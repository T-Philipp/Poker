'use strict';

var connect = require('connect'), // http-Server
	bodyParser = require('body-parser'), // Nimmt POST-Parameter aus body an
	serveStatic = require('serve-static'), // http-Server kann statische html-file senden
	socket = require('socket.io'), // webSocket
	fs = require('fs'), // Zum Beschreiben einer Textdatei
	isWin = /^win/.test(process.platform),
	port = (isWin)? 80 : 8989,
	app = connect(),
	server = app
		.use(bodyParser.json())
		.use(serveStatic('./'))
		.listen(port),
	io = socket.listen(server),
	serverTimer,
	timeLeft = 0,
	timeLeftInterval
;

app
	.use('/config', function(req, res) {
		var oneBack = (isWin)? '\\..\\': '/../',
			filePath = __dirname + oneBack + req.body.filename;

		fs.writeFile(filePath, JSON.stringify(req.body.data), function (err) {
			if (err) throw err;
			res.end('ok');
		});
	})
	.use('/timer', function(req, res) {
		res.end('' + timeLeft);
	})
;

io.sockets.on('connection', function(socket) {

	/**
	 * Client sagt, es hat sich was geändert - sage den anderen bescheid
	 */
	socket.on('configUpdated', function() {
		io.sockets.emit('configUpdated');
	});

	/**
	 * Startet Game Server-Timer - broadcaste an alle nach Ablauf
	 */
	socket.on('startTimer', function(dauer) {
		io.sockets.emit('timerGestartet');
		serverTimer = setTimeout(function() {
			io.sockets.emit('timerDurch');
		}, dauer * 1000);
		timeLeft = dauer;
		timeLeftInterval = setInterval(function() {
			if(timeLeft > 0) {
				timeLeft -= 1;
			}
		}, 1000)
	});

	/**
	 * Stoppt Timer
	 */
	socket.on('stopTimer', function() {
		clearTimeout(serverTimer);
		serverTimer = false;
		clearInterval(timeLeftInterval);
		timeLeft = 0;
	});
});

console.log("Server started and listen to localhost:80");