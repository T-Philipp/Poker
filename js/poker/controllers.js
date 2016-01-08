'use strict';

var pokerControllers = angular.module('pokerControllers', []);

pokerControllers.controller('HandsCtrl',
	function ($scope, $rootScope, $http, $route) {
		$scope.$parent.page = $route.current.$$route.name;

		$http.get('/timer').success(function (data) {
			if(parseInt(data) === 0) {
				$rootScope.darfWeiter = true;
			}
		});
	}
);

pokerControllers.controller('BlindsCtrl',
	function ($scope, $rootScope, $http, $route, Socket, Game) {
		$scope.$parent.page = $route.current.$$route.name;

		var configFile = 'config.json';

		/**
		 * Hole JSON und binde sie an $scope
		 */
		var getConfigJson = function () {
			$http.get(configFile).success(function (data) {
				$scope.config = data;
			});
		};

		/**
		 * Sendet an den Server via POST mit URL/Name '/config' die config-JSON
		 * Dieser speichert den Wert in die JSON mit 'nJS fs'
		 * Anschließend wird dem Server gesagt, er soll alle Clients updaten - durch senden an Socket
		 */
		var setConfigJson = function () {
			$http.post('/config', {filename: configFile, data: $scope.config}).then(function () {
				Socket.emit('configUpdated');
			});
		};

		/**
		 * Server schickt Restzeit in s bei laufendem Timer
		 */
		var getRundenrest = function () {
			$http.get('/timer').success(function (data) {
				$scope.restzeit = parseInt(data);

				$scope.$broadcast('timer-set-countdown', $scope.restzeit);
				$scope.$broadcast('timer-start');

				if($scope.restzeit === 0) {
					$rootScope.darfWeiter = true;
				}
			});
		};

		/**
		 * Hole JSON, wenn vom ServerSocket ein 'configUpdated' kommt
		 */
		Socket.on('configUpdated', function () {
			getConfigJson();
		});

		/**
		 * Bei Klick wwerdne Spieldaten berechnet und diese in die JSON geschrieben
		 * Erste Runde wird gesartet
		 */
		$scope.start = function () {
			$scope.config = Game.berechneSpiel($scope.config);
			setConfigJson();
			Game.startServerTimer($scope.config.dauer);
		};

		/**
		 * Klick auf 'stop' entfernt 'game' aus config und beendet ServerTimer
		 */
		$scope.stop = function () {
			$scope.config = Game.beendeSpiel($scope.config);
			setConfigJson();
			Game.stopServerTimer();
		};

		/**
		 * Klick auf 'next' startet nächste Runde
		 */
		$scope.next = function () {
			if($rootScope.darfWeiter) {
				$scope.config = Game.naechsteRunde($scope.config);
				setConfigJson();
				Game.startServerTimer($scope.config.dauer);
			}
		};

		/**
		 * Aktueller Timer durchgelaufen
		 */
		Socket.on('timerDurch', function () {
			$rootScope.darfWeiter = true;
			console.log('durch nach ' + $scope.config.dauer + ' s!');
		});

		/**
		 * Server-Timer ging los
		 */
		Socket.on('timerGestartet', function () {
			getRundenrest();
			$rootScope.darfWeiter = false;
		});

		/**
		 * Werte für Config-Slider setzen
		 * @type {number}
		 */
		$scope.dauer = {
			min: 10,
			max: 30
		};
		$scope.kleinste = {
			min: 5,
			max: 100,
			step: 5
		};
		$scope.multip = {
			min: 10,
			max: 30,
			step: 1
		};

		// Initiales Holen der JSON
		getConfigJson();

		// Initiales Holen der Restzeit
		getRundenrest();
	}
);