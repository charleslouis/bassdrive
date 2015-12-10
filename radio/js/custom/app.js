'use strict';

var appRadio = angular.module('appRadio', [
	// 'ui.router',
	// 'ngAnimate',
	// 'foundation',
	// 'foundation.dynamicRouting',
	// 'foundation.dynamicRouting.animations'
]);
	// .config(config)
	// .run(run)
 //  ;

 //  config.$inject = ['$urlRouterProvider', '$locationProvider'];

 //  function config($urlProvider, $locationProvider) {
	// $urlProvider.otherwise('/');

	// $locationProvider.html5Mode({
	//   enabled: false,
	//   requireBase: false
	// });

	// $locationProvider.hashPrefix('!');
 //  }
  

 //  function run() {
	// FastClick.attach(document.body);
 //  }
	


appRadio.controller('PlayerCtrl', function ($scope, audio){
	
	var showDaysJSON = JSON.parse(localStorage.getItem('showDays'));
	$scope.currentSong = {};
	$scope.currentSong.text = 'Live Radio';
	$scope.currentSong.url = 'http://shouthost.com.80-1.streams.bassdrive.com:80/;stream.mp3&12762816470';
	var radio = true;
	
	audio.play( $scope.currentSong.url );
	$scope.playerTimer = '00:00:00';
	
	setTimeout(function(){
		showDaysJSON = JSON.parse(localStorage.getItem('showDays'));
		$scope.showDays = showDaysJSON;
		$scope.$apply();
	}, 10000);  
	
	$scope.setCurrentSong = function(song){
		console.log(song);
		$scope.currentSong = song;
		audio.play(song.url);
		radio = false;
		$scope.playerTimer = '50:00:00';
		$scope.$apply();
	}

	$scope.pause = function() {
		audio.pause();
	} 
	
	$scope.play = function() {
		
		console.log('play');
		
		if($scope.currentSong){
			audio.play($scope.currentSong.url);
		} else {
			console.log('play 3');
			audio.play('http://shouthost.com.80-1.streams.bassdrive.com:80/;stream.mp3&12762816470');
			$scope.playerTimer = 0;
			$scope.$apply();		
		}
	}   
   
});

appRadio.factory('audio',function ($document) {
	var audioElement = $document[0].createElement('audio'); // <-- Magic trick here
	var trackVol = null;
	var trackPos = null;   
	
	return {
		audioElement: audioElement,

		play: function(filename) {
			
			audioElement.src = filename;
			audioElement.volume = 0.5;
			console.log( audioElement.src );
			
	/*        if( trackPos!=null && trackVol!=null ){
				audioElement.currentTime = trackPos;
				audioElement.volume = trackVol;
				trackVol = null;
				trackPos = null;      
			}*/
			
			audioElement.play();     //  <-- Thats all you need
		},
		pause: function(){
			audioElement.pause();     //  <-- Thats all you need      
			audioElement.volume = 0;      
			trackPos = audioElement.currentTime;
			trackVol = audioElement.volume;
		}
	}
});