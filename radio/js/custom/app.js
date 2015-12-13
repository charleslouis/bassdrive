'use strict';

var appRadio = angular.module('appRadio', [
	'ui.router',
	'ngAnimate',
	'foundation.core',
	'foundation.core.animation',	
	'foundation.accordion',
	'foundation.tabs',
    'foundation.iconic',
    'foundation.popup'
	// 'foundation.dynamicRouting.animations'
])
	.config(config)
	.run(run);

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
	$urlProvider.otherwise('/');

	$locationProvider.html5Mode({
	  enabled: false,
	  requireBase: false
	});

	$locationProvider.hashPrefix('!');
  }
  

  function run() {
	FastClick.attach(document.body);
  }
	


appRadio.controller('PlayerCtrl', function ($scope, audio){
	
	// Get shows and songs from local storage
	var showDaysJSON = JSON.parse(localStorage.getItem('showDays'));
	$scope.showDays = showDaysJSON;

	// Current song is empty for now
	$scope.currentSong = {};

	// Since were opening for the first time,
	// user has not chose a track
	// so let's play the radio
	var radio = true;
	$scope.currentSong.text = 'Live Radio';
	$scope.currentSong.url = 'http://shouthost.com.80-1.streams.bassdrive.com:80/;stream.mp3&12762816470';
	$scope.playerTimer = '00:00:00';



	// If the volume was already set, get it from localStorage
	// Else, we set it
	if (localStorage.getItem('volume')){
		$scope.volume = localStorage.getItem('volume');
	} else {
		var volume = 0.5;
		$scope.volume = volume;
		localStorage.setItem('volume', volume);
	}


	// Now let's play the music
	audio.play( $scope.currentSong.url, $scope.volume);


	setTimeout(function(){
		showDaysJSON = JSON.parse(localStorage.getItem('showDays'));
		$scope.showDays = showDaysJSON;
		// $scope.$apply();
	}, 5000);  
	
	$scope.setCurrentSong = function(song){
		console.log(song);
		$scope.currentSong = song;
		audio.play(song.url);
		radio = false;
		$scope.playerTimer = '50:00:00';
	}

	$scope.pause = function() {
		audio.pause();
		$scope.isPlaying = false;

		console.log('isPlaying = ' + $scope.mediaStatePlay);
	} 
	
	$scope.play = function() {
		
		console.log('$scope.volume = ' + $scope.volume);

		if($scope.currentSong){
			audio.play($scope.currentSong.url, $scope.volume);
		} else {
			audio.play('http://shouthost.com.80-1.streams.bassdrive.com:80/;stream.mp3&12762816470', $scope.volume);
			$scope.playerTimer = 0;
		}

		$scope.isPlaying = true;

		console.log('isPlaying = ' + $scope.isPlaying);
	}   
   
});

appRadio.factory('audio',function ($document) {
	var audioElement = $document[0].createElement('audio'); // <-- Magic trick here
	var trackVol = null;
	var trackPos = null;   
	
	return {
		audioElement: audioElement,

		play: function(filename, volume) {
			
			console.log('Volume : ' + volume);

			audioElement.src = filename;
			audioElement.volume = volume;
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
					console.log(trackVol);
					console.log(trackPos);
		}
	}
});