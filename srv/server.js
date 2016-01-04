'use strict';

var connect = require('connect'), // http-Server
	bodyParser = require('body-parser'), // Nimmt POST-Parameter aus body an
	serveStatic = require('serve-static'), // http-Server kann statische html-file senden
	socket = require('socket.io'), // webSocket
	fs = require('fs'), // Zum Beschreiben einer Textdatei
	app = connect(),
	server = app
		.use(bodyParser.json())
		.use(serveStatic('./'))
		.listen(80),
	io = socket.listen(server)
	;

app
	.use('/config', function(req, res) {
		var filePath = __dirname + '\\..\\' + req.body.filename;

		fs.writeFile(filePath, JSON.stringify(req.body.data), function (err) {
			if (err) throw err;
			res.end('ok');
		});
	})
;

io.sockets.on('connection', function(socket) {
	socket.on('configUpdated', function() {
		io.sockets.emit('configUpdated');
	});
});

console.log("Server started and listen to localhost:80");