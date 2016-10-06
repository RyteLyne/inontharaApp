var myApp = angular.module('Vidhyaan', ['ionic','ngCordova','elastichat' , 'Global.controllers', 'Menus.controllers','Vidhyaan.controllers','azure-mobile-service.module', 'azureBlobUpload','angularImgFallback','Editor.controllers','ionic.contrib.ui.tinderCards2','cards', 'elastichat', 'monospaced.elastic','angularMoment', 'ion-floating-menu','Attendance.controllers'])


.run(function($ionicPlatform,$rootScope) {
	 console.log("this is the grand begin");
  $ionicPlatform.ready(function() {

  	  if (window.plugin) {
                map = window.plugin.google.maps.Map;//.getMap(div);
            }

	

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
     
     setTimeout(function() {
        navigator.splashscreen.hide();
    }, 100);
    
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {

    

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
 

    
  .state('settings', {
    url: "/settings",
     templateUrl: "templates/settings.html"
    
  })

   .state('Payments', {
    url: "/Payments",
     templateUrl: "templates/Payments.html"
    
  })

    .state('Events', {
    url: "/Events",
     templateUrl: "templates/Events.html"
    
  })

    .state('Gallery', {
    url: "/Gallery",
     templateUrl: "templates/Gallery.html"
    
  })

   .state('galleryEditor', {
    url: "/galleryEditor",
     templateUrl: "templates/galleryEditor.html"
    
  })

   .state('profile', {
    url: "/profile",
    templateUrl: "templates/profile.html"
         
  
  })

    

  .state('readView', {
    url: "/readView",
     templateUrl: "templates/readView.html"
   
  })

 .state('newsfeed', {
    url: "/newsfeed",
   templateUrl: "templates/newsfeed.html"
            
  })

   .state('newsPostEditor', {
    url: "/newsPostEditor",
    templateUrl: "templates/newsPostEditor.html"

  })

.state('UserMessages', {
    url: "/UserMessages",
     templateUrl: "templates/UserMessages.html"
   
  })

  .state('dashboardApps', {
    url: "/dashboardApps",
     templateUrl: "templates/dashboardApps.html"
   
  })


.state('logout', {
    url: "/logout",
    templateUrl: "templates/logout.html"
         
  
  })

   .state('login', {
    url: "/login",
    templateUrl: "templates/login.html"
  })

  /*.state('feedinput', {
    url: "/feedinput",
    templateUrl: "templates/feedinput.html"
  })*/

   .state('splash', {
    url: "/splash",
    templateUrl: "templates/splash.html"
  })

   .state('Attendance', {
    url: "/Attendance",
    templateUrl: "templates/Attendance.html"
  })

  .state('AttendanceWrite', {
    url: "/AttendanceWrite",
    templateUrl: "templates/AttendanceWrite.html"
  })

.state('mapview', {
    url: "/mapview",
    templateUrl: "templates/mapview.html"
  })




  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');
      $ionicConfigProvider.navBar.alignTitle('left');
    $ionicConfigProvider.views.maxCache(5);

  // note that you can also chain configs
  $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left');
   $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
});

myApp.controller('PlatformCtrl2', function($scope, $rootScope, $state, $http) {



  var deviceInformation = ionic.Platform.device();

  var isWebView = ionic.Platform.isWebView();
  if(isWebView)
  {

    console.log("in web veiw");
  }
  var isIPad = ionic.Platform.isIPad();
if(isIPad)
{
  console.log("in iPad");
}
  var isIOS = ionic.Platform.isIOS();
  if(isIPad)
  {
    console.log("in ios");
  }
  var isAndroid = ionic.Platform.isAndroid();
  if(isAndroid)
  {
    console.log("in Android");
  }
  var isWindowsPhone = ionic.Platform.isWindowsPhone();
if(isAndroid)
{
console.log("in windows phone");

}
  var currentPlatform = ionic.Platform.platform();
  var currentPlatformVersion = ionic.Platform.version();
 $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
 console.log($rootScope.devWidth);
 $rootScope.menuWidth = 0.85 * $rootScope.devWidth;
 console.log($rootScope.menuWidth);
 // ionic.Platform.exitApp(); // stops the app
$scope.logoutFunc = function(){
  console.log("removing localStorage");
  localStorage.removeItem('profile');
    $state.go('menu.main/first',{}, {reload: true});
}
});



myApp.controller('initCtrl', function($scope, $state, $ionicPopover, $ionicHistory,$rootScope) {
  
//$scope.feedNotificationBadge = false;
//$scope.appNotificationBadge = false;

$rootScope.$on('NotificationBadgeEvent', function(event, data) {

	console.log("NotificationBadge",data);
var typ = data[0];
console.log("NotificationBadge",typ);

if(typ[0] == "left")
{
if(typ[1] == "0")
$scope.rootfeedNotificationBadge = false;
else
{
$scope.rootfeedNotificationBadge = true;
console.log("kkk");
}

}
else
{
if(typ[1] == "0")
$scope.rootappNotificationBadge = false;
else
$scope.rootappNotificationBadge = true; 
}

})




  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
 
  $scope.demo = 'ios';
	
  $scope.setPlatform = function(p) {
    document.body.classList.remove('platform-ios');
    document.body.classList.remove('platform-android');
    document.body.classList.add('platform-' + p);

 	console.log("setting platform as ios for popup alwasy");
    //document.body.classList.add('platform-ios');
    $scope.demo = p;
  }

// $scope.setPlatform('ios');

  console.log("in init control");
  /*    $scope.goBack = function(){
      console.log("pressed goback");
   $ionicHistory.goBack();
}*/

 $scope.isPlaying = false;

});




/*
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

*/



