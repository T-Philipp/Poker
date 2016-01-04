//define a global application
var app = angular.module('poker', [
	'ngRoute',
	'ngAnimate',
	'pokerControllers',
	'pokerServices',
	'ui-rangeSlider'
]);

//create an app router for url management and redirect
app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/hands', {
				templateUrl: 'tpl/hands.html',
				controller: 'HandsCtrl'
			})
			.when('/blinds', {
				templateUrl: 'tpl/blinds.html',
				controller: 'BlindsCtrl'
			})
			.otherwise({
				redirectTo: '/hands'
			})
		;
	}
]);