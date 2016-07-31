var myApp = angular.module('DynamicMeditation', ['ionic', 'ionic.animate.ratio','DynamicMeditation.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/side-menu.html"
  })

 .state('app.home', {
    url: "/home",
    views: {
      'content': {
        templateUrl: "templates/home.html"
      }
    }
  })
 

    .state('app.play', {
    url: "/play",
    views: {
      'content': {
        templateUrl: "templates/play.html",
         
      }
    }
  })
 .state('app.benefits', {
    url: "/benefits",
    views: {
      'content': {
        templateUrl: "templates/benefits.html",
      
      }
    }
  })

   .state('app.instructions', {
    url: "/instructions",
    views: {
      'content': {
        templateUrl: "templates/instructions.html",
       
      }
    }
  })

     .state('app.extranote', {
    url: "/extranote",
    views: {
      'content': {
        templateUrl: "templates/extranote.html",
         
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});



myApp.controller('InstructionsCtrl', function($scope, $state, $ionicHistory) {
  console.log("in Instructions control");
    $scope.Instructions = function() {
    console.log("Instructions");
    $state.go('app.instructions',{}, {reload: true});
    return $scope.firstName + " " + $scope.lastName;
    };
});



myApp.controller('extranoteCtrl', function($scope, $state, $ionicHistory) {
  console.log("in extranoteCtrl control");
     $scope.ExtraNote = function() {
    console.log("extranote");
    $state.go('app.extranote',{}, {reload: true});
    return $scope.firstName + " " + $scope.lastName;
     };
});

myApp.controller('initCtrl', function($scope, $state, $ionicHistory) {
  console.log("in init control");
      $scope.goBack = function(){
      console.log("pressed goback");
   $ionicHistory.goBack();
}

 $scope.isPlaying = false;

});

myApp.controller('slideCtrl', function($scope, $state, $ionicHistory) {
  console.log("in SlideCtrl");
   $scope.slides = [{name:"1",msg: "hello"},{name:"2", msg: "new"},{name:"3", msg:"what next"},{name:"4",msg: "hello"},{name:"5", msg: "new"},];



});

myApp.controller('BenefitsCtrl', function($scope, $state, $ionicHistory) {
  console.log("in BenefitsCtrl control");
     $scope.Benefits = function() {
    console.log("Benefits");
    $state.go('app.benefits',{}, {reload: true});
    return $scope.firstName + " " + $scope.lastName;
    };

});

myApp.controller('homeCtrl', function($scope, $state, $ionicHistory) {
  console.log("HomeCtrl");
//   $scope.slides = [{name:"1",msg: "hello"},{name:"2", msg: "new"},{name:"3", msg:"what next"},{name:"4",msg: "hello"},{name:"5", msg: "new"},];
 $scope.GoHome = function() {
    console.log("GoHome");
    $state.go('app.home',{}, {reload: true});
    return $scope.firstName + " " + $scope.lastName;
    };
});

myApp.controller('PlatformCtrl', function($scope, $rootScope, $state, $http) {
	console.log("plaform controller");
var currentPlatform = ionic.Platform.platform();
  var currentPlatformVersion = ionic.Platform.version();
 $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
 console.log($rootScope.devWidth);
 $rootScope.menuWidth = 0.85 * $rootScope.devWidth;
 console.log($rootScope.menuWidth);
});


myApp.controller('rightViewCtrl',function($scope, $ionicSideMenuDelegate, $stateParams) {

 $scope.$on('$ionicView.afterEnter', function(){
    console.log("right View controller");
/* $scope.$apply(function(){

  
    $scope.profile =angular.copy(JSON.parse(localStorage.getItem('profile')));
      console.log($scope.profile);
              $scope.userName =  $scope.profile.Studname;
              console.log($scope.userName);
});
*/
 });
});




myApp.controller('PlayCtrl', function($scope, $state, $ionicHistory) {
  console.log("in playCtrl");
    $scope.PlayMedia = function() {
    console.log("play");
    $state.go('app.play',{}, {reload: true});
    return $scope.firstName + " " + $scope.lastName;
    };

 


    
var progressTimer;

var playButton;
var stopButton;
var activityIndicator;
var textPosition;

myaudioURL = 'audio/OshoAudio.mp3';
myaudio = new Audio(myaudioURL);
readyStateInterval = null;

$scope.play= function()
{
	 console.log("entered here")
	$scope.isPlaying = true;
	myaudio.play();
	 playButton = document.getElementById('playbutton');
		  stopButton = document.getElementById('stopbutton');
		  activityIndicator = document.getElementById('activityindicator');
		  textPosition = document.getElementById('textposition');
		readyStateInterval = setInterval(function(){
			 if (myaudio.readyState <= 2) {
				 playButton.style.display = 'none';
				 activityIndicator.style.display = 'block';
				 textPosition.innerHTML = 'loading...';
			 }
		},1000);
		myaudio.addEventListener("timeupdate", function() {
			 var s = parseInt(myaudio.currentTime % 60);
			 var m = parseInt((myaudio.currentTime / 60) % 60);
			 var h = parseInt(((myaudio.currentTime / 60) / 60) % 60);
			 if ($scope.isPlaying && myaudio.currentTime > 0) {
		 textPosition.innerHTML = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
			 }
		}, false);
		myaudio.addEventListener("error", function() {
			 console.log('myaudio ERROR');
		}, false);
		myaudio.addEventListener("canplay", function() {
			 console.log('myaudio CAN PLAY');
		}, false);
		myaudio.addEventListener("waiting", function() {
			 //console.log('myaudio WAITING');
			 $scope.isPlaying = false;
			 playButton.style.display = 'none';
			 stopButton.style.display = 'none';
			 activityIndicator.style.display = 'block';
		}, false);
		myaudio.addEventListener("playing", function() {
			 $scope.isPlaying = true;
			 playButton.style.display = 'none';
			 activityIndicator.style.display = 'none';
			 stopButton.style.display = 'block';
		}, false);
		myaudio.addEventListener("ended", function() {
			 //console.log('myaudio ENDED');
			 html5audio.stop();
			 // navigator.notification.alert('Streaming failed. Possibly due to a network error.', null, 'Stream error', 'OK');
			 // navigator.notification.confirm(
			 //	'Streaming failed. Possibly due to a network error.', // message
			 //	onConfirmRetry,	// callback to invoke with index of button pressed
			 //	'Stream error',	// title
			 //	'Retry,OK'		// buttonLabels
			 // );
			 if (window.confirm('Streaming failed. Possibly due to a network error. Retry?')) {
			 	onConfirmRetry();
			 }
		}, false);
		
	};

function onError(error) 
{
	console.log(error.message);
	}

function onConfirmRetry(button) {
	if (button == 1) {
		html5audio.play();
	}
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number
}



	
	$scope.pause= function() {
		 playButton = document.getElementById('playbutton');
		  stopButton = document.getElementById('stopbutton');
		  activityIndicator = document.getElementById('activityindicator');
		  textPosition = document.getElementById('textposition');
		$scope.isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		stopButton.style.display = 'none';
		activityIndicator.style.display = 'none';
		playButton.style.display = 'block';
	};

	$scope.stop= function() {
		 playButton = document.getElementById('playbutton');
		  stopButton = document.getElementById('stopbutton');
		  activityIndicator = document.getElementById('activityindicator');
		  textPosition = document.getElementById('textposition');
		$scope.isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		stopButton.style.display = 'none';
		activityIndicator.style.display = 'none';
		playButton.style.display = 'block';
		myaudio = null;
		myaudio = new Audio(myaudioURL);
		textPosition.innerHTML = '';
	};



}); //end file;;



