var pokerControllers = angular.module('pokerControllers', []);

pokerControllers.controller('HandsCtrl',
	function ($scope, $route) {
		$scope.$parent.page = $route.current.$$route.name;
	}
);

pokerControllers.controller('BlindsCtrl',
	function ($scope, $http, $route, Socket) {
		$scope.$parent.page = $route.current.$$route.name;

		var configFile = 'config.json';

		/**
		 * Hole JSON und binde sie an $scope
		 */
		var getJson = function() {
			$http.get(configFile).success(function (data) {
				$scope.config = data;
			});
		};

		/**
		 * Hole JSON, wenn vom ServerSocket ein 'configUpdated' kommt
		 */
		Socket.on('configUpdated', function() {
			getJson();
		});

		/**
		 * Bei Klick wird an den Server via POST mit URL/Name '/config' config-JSON gesendet
		 * Dieser Speichert den Wert in die JSON mit 'fs'
		 * Anschließend wird dem Server gesagt, er soll alle Clients updaten - durch senden an Socket
		 */
		$scope.save = function() {
			$http.post('/config', {filename: configFile, data: $scope.config}).then(function() {
				Socket.emit('configUpdated');
			});
		};

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
			min: 50,
			max: 200,
			step: 25
		};

		/**
		 * Initiles Holen der JSON
		 */
		getJson();

		/**
		 * Sofortiges Änderungs-Broadcasting bei Sliden
		 * Sehr Buggy :-)
		 window.setTimeout(function() {
			$scope.$watch('config', function() {
				$scope.save();
			}, true);
		}, 1);
		 */

	}
);