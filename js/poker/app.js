'use strict';

var app = angular.module('poker', [
	'ngRoute',
	'ngAnimate',
	'pokerControllers',
	'pokerServices',
	'ui-rangeSlider'
]);

app.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/hands', {
				templateUrl: 'tpl/hands.html',
				controller: 'HandsCtrl',
				name: 'hands'
			})
			.when('/blinds', {
				templateUrl: 'tpl/blinds.html',
				controller: 'BlindsCtrl',
				name: 'blinds'
			})
			.otherwise({
				redirectTo: '/hands'
			})
		;
	}
]);