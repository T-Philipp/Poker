'use strict';

var pokerServices = angular.module('pokerServices', []);

pokerServices
	.factory('Socket', function ($rootScope) {
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				if (typeof data == 'function') {
					callback = data;
					data = {};
				}
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			},
			emitAndListen: function (eventName, data, callback) {
				this.emit(eventName, data, callback);
				this.on(eventName, callback);
			}
		};
	})

	.factory('Game', function (Socket) {
		return {
			startServerTimer: function (dauer) {
				Socket.emit('startTimer', dauer);
			},
			stopServerTimer: function () {
				Socket.emit('stopTimer');
			},
			berechneSpiel: function (config) {
				var jetzt = new Date(),
					calcRunden = 20,
					zaehler,
					runden = [],
					letzterSmallBlind = config.kleinste,
					multip = config.multip / 10;

				for (zaehler = 1; zaehler <= calcRunden; zaehler++) {
					letzterSmallBlind = config.kleinste * Math.round(zaehler * multip);
					var runde = {
						runde: zaehler,
						smallBlind: letzterSmallBlind,
						bigBlind: letzterSmallBlind * 2
					};
					runden.push(runde);
				}

				config.game = {
					started: jetzt,
					aktRunde: 1,
					runden: runden
				};
				return config;
			},
			beendeSpiel: function (config) {
				delete config.game;
				return config;
			},
			naechsteRunde: function (config) {
				config.game.aktRunde+= 1;
				return config;
			}
		};
	})
;