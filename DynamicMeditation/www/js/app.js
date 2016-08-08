var myApp = angular.module('DynamicMeditation', ['ionic','ngCordova','ionic.animate.ratio', 'ion-fab-button','DynamicMeditation.controllers','azure-mobile-service.module', 'azureBlobUpload'])

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


   .state('app.instructions', {
    url: "/instructions",
    views: {
      'content': {
        templateUrl: "templates/instructions.html",
       
      }
    }
  })

  


  .state('app.settings', {
    url: "/settings",
    views: {
      'content': {
        templateUrl: "templates/settings.html",
         
      }
    }
  })


   .state('app.profile', {
    url: "/profile",
    views: {
      'content': {
        templateUrl: "templates/profile.html",
         
      }
    }
  })

    

  .state('app.readView', {
    url: "/readView",
    views: {
      'content': {
        templateUrl: "templates/readView.html",
         
      }
    }
  })

 .state('app.newsfeed', {
    url: "/newsfeed",
    views: {
      'content': {
        templateUrl: "templates/newsfeed.html",
         
      }
    }
  })

   .state('app.newsPostEditor', {
    url: "/newsPostEditor",
    views: {
      'content': {
        templateUrl: "templates/newsPostEditor.html",
         
      }
    }
  })


.state('app.logout', {
    url: "/logout",
    views: {
      'content': {
        templateUrl: "templates/logout.html",
         
      }
    }
  })

   .state('login', {
    url: "/login",
    templateUrl: "templates/login.html"
  })

   .state('splash', {
    url: "/splash",
    templateUrl: "templates/splash.html"
  })




  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');
});

myApp.controller('PlatformCtrl2', function($scope, $rootScope, $state, $http) {


  ionic.Platform.ready(function(){
    // will execute when device is ready, or immediately if the device is already ready.
   
   //gcmapp will deprecated from here 
 // gcmapp.Initialize();



  pushNotification = PushNotification.init({
    "android": { "senderID": "805533023268" },
    "ios": { "alert": "true", "badge": "false", "sound": "true" }
});

pushNotification.on('notification', function (data) {
    // Display the alert message in an alert.
   console.log(data);
    alert(data.message);
    console.log(data.info);
var doc2req = {};
doc2req.channels = data.message.replace("newsfeed from edumobi channel: ", "");
doc2req.docID = data.title;

  Object.toparams = function ObjecttoParams(obj) 
{
  var p = [];
  for (var key in obj) 
  {
    p.push(key + '=' + encodeURIComponent(obj[key]));
  }
  return p.join('&');
};
  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/getPostM/",
    data: Object.toparams(doc2req),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
console.log(req.data);
      //  var defer = $q.defer();
      //  $ionicLoading.show({
   //   template: 'Loading...'
    //});
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data.fetchedNews.messages);

     
var  messages  = JSON.parse(data.fetchedNews.messages);
console.log(messages);
//ading the data to storage
$scope.test = localStorage.getItem('test') ?
              JSON.parse(localStorage.getItem('test')) : 
              $scope.test=[],$scope.testInfo=[];   
      $scope.test.push(angular.extend({}, messages));  
 
 //creating list preview  
for(var i=0;i<messages.length;i++)
{
 if( messages[i].indexOf('<h1>')>-1)
 {
 $scope.testInfo[testinfo.length].heading= messages[i].replace('<h>','').replace('</h1>','');
 break;
 }
}

for(var i=0;i<messages.length;i++)
{
if(messages[i].indexOf('<img>')>-1)
{
 $scope.testinfo[testinfo.length].image=messages[i];
break;
}
}
for(var i=0;i<messages.length;i++)
{
 if(messages[i].indexof('<p>')>-1)
 {
 $scope.testinfo[testinfo.length].image=message[i];
 break
 }
}
console.log($scope.test);
console.log($scope.testinfo);
   //  defer.resolve(data);
 //$ionicLoading.hide();
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          //  defer.reject();
        });
    //
    // pull the data from here

    // Reload the items list.
   // app.Storage.getData();
});

//  pushNotification.on('registration', function (data) {
  //    mobileServiceClient = new WindowsAzure.MobileServiceClient(
    //                'https://edumobi1.azure-mobile.net',
      //              'ZDdASZhSitsYsklwZYlRqIDdxjdWAp17');
console.log("registering push notification");

 pushNotification.on('registration', function (data) {
  $scope.mobileServiceClient = new WindowsAzure.MobileServiceClient(
                   'https://edum.azure-mobile.net',
                     'yVQPRKXxocEazjPjDXGSnmIpyCBTYc97');
         

               //https://edum.azure-mobile.net/
    // Get the native platform of the device.
    var platform = device.platform;
    // Get the handle returned during registration.
    var handle = data.registrationId;
    // Set the device-specific message template.
    if (platform == 'android' || platform == 'Android') {
        // Template registration.
var template = "{ \"data\" : {\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\", \"additionalData\":\"$(additionalData)\"}}"
      //  var template = '{ "data" : {"message":"$(message)"}}';
        // Register for notifications.

        $rootScope.mobileServiceClient.push.gcm.registerTemplate(handle,
            'myTemplate', template,  ["Chungling-Global", "Chungling-Class1"])
            .done(registrationSuccess, registrationFailure);
             console.log($scope.mobileServiceClient);
    } else if (device.platform === 'iOS') {
        // Template registration.
        //var template = '{"aps": {"alert": "$(message)"}}';
        var alertTemplate = "{\"aps\":{\"alert\":\"$(message)\",\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\", \"additionalData\":\"$(additionalData)\"}}";
        // Register for notifications.      
        console.log(handle);      
     //  mobileServiceClient.push.apns.registerTemplate(handle,
       //     'myTemplate', template, null)
         //  .done(registrationSuccess, registrationFailure);
            $rootScope.mobileServiceClient.push.apns.registerNative(data.registrationId, ["Chungling-Global", "Chungling-Class1"]).done(registrationSuccess, registrationFailure);
    }
});

  
var registrationSuccess = function () {
    alert('Registered with Azure!');
}

var registrationFailure = function (error) {
    alert('Failed registering with Azure: ' + error);
}

  });

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


myApp.controller('readPageCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet) {
$scope.readFunc= function(){

}
$scope.goBack = function(){
   $ionicHistory.goBack();
}

$scope.readFunc();


$scope.messages = JSON.parse(localStorage.getItem('recievedMessage'));
console.log($scope.messages);

});


myApp.controller('EditorCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet) {
 


  $scope.addText= function(){
  $scope.tag='p'
  $scope.tPlaceholder = " enter content";

  }
   $scope.addHeading = function() {
     $scope.tag='h1';
     $scope.tPlaceholder= " enter heading";
  }
      $scope.addText();
  $scope.showActionsheet = function() {
      
    $ionicActionSheet.show({
      titleText: 'Add/remove content to Newsfeed',
      buttons: [
        { text: '<i class="icon ion-image"></i> Add Image' },
          { text: '<i class="icon ion-android-film"></i> Add Video' },
        { text: '<i class="icon ion-edit"></i> Add Heading' },
         { text: '<i class="icon ion-edit"></i> Add Text' },
      ],
      destructiveText: 'Delete Last Modification',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        console.log('BUTTON CLICKED', index);
        if(index==0)
        $scope.addImage();
        if(index==2)
        $scope.addHeading();
        if(index==3)
        $scope.addText();
        return true;
      },
      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        $scope.messages.pop();
        return true;
      }
    });
  };
  //console.log($stateParams.movieid);
 //console.log ($scope.profile.Studname);
 //console.log($scope.data);
  $scope.goBack = function(){
    console.log("reached here");

    $ionicHistory.goBack();
  }    

 $scope.myInput='';
  var messageOptions = [
   
  //   { content: '' }
     /* { content: '<p>I think I like Ionic jhkgkjhkjh kjhgkjhg kjgkjhgk khkh kjhgkg kjhkjh kjhgk more than I like ice cream!</p>' }*/
  ];
 
  var messageIter = 0;
  $scope.messages = messageOptions.slice(0, messageOptions.length);
//$scope.messages[0].content=$sce.trustAsHtml('<meter value="82" max="100"></meter>');


$scope.postMessage =function(){
console.log("im inside the postMessage");
console.log($scope.messages);

var doc2send = {};
 doc2send.subGroup = "chungling";//req.body.subGroup;
      doc2send.docType = "NewsFeed";//req.body.docType;
      doc2send.channels = "test";//req.body.channels;
   var d = new Date();
var curr_time = d.getTime();
 console.log(curr_time);
 var newID = $rootScope.userName + curr_time.toString()+'.news';
 newID=newID.replace(/ /g,"");
      doc2send.docID = newID;
      doc2send.messages= JSON.stringify($scope.messages);
      console.log(doc2send.messages);
  localStorage.setItem('recievedMessage', doc2send.messages);
  
  Object.toparams = function ObjecttoParams(obj) 
{
  var p = [];
  for (var key in obj) 
  {
    p.push(key + '=' + encodeURIComponent(obj[key]));
  }
  return p.join('&');
};
  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/addPostM/",
    data: Object.toparams(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
console.log(req.data);
      //  var defer = $q.defer();
      //  $ionicLoading.show({
   //   template: 'Loading...'
    //});
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          //  defer.resolve(data);
 //$ionicLoading.hide();
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          //  defer.reject();
        });
   
//var variabled = JSON.parse(stringified);
//console.log(variabled);
}

$scope.discardMessage = function(){
  console.log($scope.messages);
console.log("discarding messages");
$scope.messages = [];

}
  $scope.add = function() {
    var nextMessage ={};
    nextMessage.content = '<'+$scope.tag + '>' +$scope.myInput+'</'+$scope.tag+'>';
    if($scope.myInput!='')
    $scope.messages.push( angular.extend({}, nextMessage));
    $scope.myInput='';
  /* var nextMessage = messageOptions[messageIter++ % messageOptions.length];
   if($scope.myInput!='')
   {
    console.log($scope.myInput);
    nextMessage.content=$scope.myInput;
    $scope.messages.push(angular.extend({}, nextMessage));
    $scope.myInput='';
console.log("testing new mobile service hosted in second account");
  mobileServiceClient = new WindowsAzure.MobileServiceClient(
                    'https://edumobi1.azure-mobile.net',
                     'ZDdASZhSitsYsklwZYlRqIDdxjdWAp17');
 mobileServiceClient.invokeApi("post_news", {
    body: { Size: 'Large', Flavor: 'Four Cheeses', UserPhone: '555-555-1234' },
    method: "post"
}).done(function (response) {
    
   console.log(response);
}, function(error) {
    alert(error.result);
});
  }*/
  $ionicScrollDelegate.scrollBottom();
//$ionicDelegate.scrollBottom(true);
    console.log($scope.messages);
  };
  

  
function fileEntryfail(message){
          console.log("in fileEntryfail");
          console.log(message);
        }
function failLocalResolve(message){
      console.log("in failLocalResolve");
      console.log(message);
    }

function readFail(ErrMessage){
  console.log("readFail");
  console.log(ErrMessage);
}
function xhrfail(message){
  console.log("xhr fail");
  console.log(message);
}
function uploadCompleted(){
   
  console.log("uploadCompleted");
  console.log($scope.messages[$scope.messages.length-1].content);
  $scope.messages.pop();
  var newMessage = {};
  newMessage = $scope.tempImageHtml;
    $scope.messages.push(angular.extend({}, newMessage));
    $scope.$apply();

  //$scope.messages[$scope.messages.length-1].content=   $scope.tempImageHtml.slice();
       $scope.myInput='';
       $scope.add();
          $ionicScrollDelegate.scrollBottom();
}

    var readCompleted = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
    console.log("read completed so im here");
        // The binary data is the result.
        var requestData = evt.target.result;

        // Build the request URI with the SAS, which gives us permissions to upload.
    //    var uriWithAccess = insertedItem.imageUri + "?" + insertedItem.sasQueryString;
        console.log($rootScope.mobileServiceClient);
  $rootScopecope.mobileServiceClient.invokeApi("getuploadblobsas", {
    body: { fileName: $scope.newFileName, Type: 'jpeg', UserPhone: '555-555-1234' },
    method: "put"
}).done(function (response) {
    
   console.log(response);
   console.log(response.result.sasUrl);
   var uriWithAccess = response.result.sasUrl;
    var xhr = new XMLHttpRequest();
        xhr.onerror = xhrfail;
        xhr.onloadend = uploadCompleted;
        xhr.open("PUT", uriWithAccess, true);
      

        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');
$ionicScrollDelegate.scrollBottom();
        var progressBar = document.querySelector('progress');
        
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
        
      progressBar.value = (e.loaded / e.total) * 100;
      progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
   console.log(progressBar.value);
  // $scope.$apply();
    }
  };

        xhr.send(requestData);
}, function(error) {
    alert(error.result);
});

     

   
    console.log($scope.messages);
       
    }
}


function readImage(imageURI) {
     // Get the URL of the image on the local device.  
     console.log("inside readImage");
     console.log(imageURI);   
     var localFileSytemUrl = imageURI.fullPath;
         var localFileSytemUrl = imageURI;
     if (device.platform == 'iOS') {
         // We need the file:/ prefix on an iOS device.
        // localFileSytemUrl = "file://" + localFileSytemUrl; 
        console.log("from ios");
         console.log(localFileSytemUrl);
     }
     console.log("reached before call window resolve fileentry");
     window.resolveLocalFileSystemURL(localFileSytemUrl, function (fileEntry) {

       console.log("inside relsolve local filesystem");
        fileEntry.file(function (file) {
          console.log("can you see this message");
            // We need a FileReader to read the captured file.
            var reader = new FileReader();
            reader.onloadend = readCompleted;
            reader.onerror = readFail;

            // Read the captured file into a byte array.
            // This function is not currently supported on Windows Phone.
            reader.readAsArrayBuffer(file);
        }, fileEntryfail);
        
    },failLocalResolve);
    

}

$scope.gcmButton = function()
{
  console.log("in button func");
  gcmapp.Initialize();
}
 
$scope.addImage = function() {
   //var nextMessage = messageOptions[messageIter++];
   var nextMessage ={};
 var options = {
 destinationType : navigator.camera.DestinationType.FILE_URI,
 sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
 allowEdit : false,
 encodingType: navigator.camera.EncodingType.JPEG,
 popoverOptions: CameraPopoverOptions,
 };
  var date = new Date();  var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth();
var curr_year = d.getFullYear();
var curr_time = d.getTime();
 console.log(curr_time);
 var newFileName = $rootScope.userName + curr_time.toString()+'.jpg';
 newFileName=newFileName.replace(/ /g,"");
 console.log(newFileName);
 $scope.newFileName = newFileName;


 navigator.camera.getPicture(onSuccess, onFail, options);
 function onFail(ErrMessage){
   console.log(ErrMessage)
 }
 
 function onSuccess(ImageData){
//from here copy new file starts
createFileEntry(ImageData);

function createFileEntry(fileURI) {
			window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
		}

function copyFile(fileEntry) {
			var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
			var newName = newFileName;
 
			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
				fileEntry.copyTo(
					fileSystem2,
					newName,
					onCopySuccess,
					fail
				);
			},
			fail);
		}
		
function onCopySuccess(entry) {
        console.log("copy successful");
        console.log(entry.nativeURL);
        $scope.ImageData = entry.nativeURL;

console.log($scope.ImageData);
    window.resolveLocalFileSystemURL($scope.ImageData, gotFileEntry, 
            function(error){
                alert("Error get fullPath");
            }
        );

function gotFileEntry(imageURI) { 
  // alert("imageURI: "+JSON.stringify(imageURI));
  console.log("imageURI: "+imageURI.nativeURL);
 $scope.loading =$ionicLoading.show({content: $scope.TextLoading,
  // The animation to use
  animation: 'fade-in',
  // Will a dark overlay or backdrop cover the entire view
  showBackdrop: true,
  // The maximum width of the loading indicator
  // Text will be wrapped if longer than maxWidth
  maxWidth: 200,
  // The delay in showing the indicator
  showDelay: 100});

  readImage(imageURI.nativeURL);
      $ionicLoading.hide();
 //  $scope.add();
 
   }

 var nextMessage ={};


      // nextMessage.content='<img src="' + ImageData+'"></img>' + '<progress max="100" value="75"> </progress>';
     // nextMessage.content= $sce.trustAsHtml('<img src="' + ImageData+'"></img><br> Loading.. <meter value="2" max="100"></meter>');
    //  $scope.tempImageHtml ='<img src="' +ImageData+'"></img><br>';
            
nextMessage.content= $sce.trustAsHtml('<img src="' + $scope.ImageData+'"></img><br> Loading.. <progress value="2" max="100"></progress>');
     $scope.tempImageHtml = {};
      $scope.tempImageHtml.content ='<img src="' + $scope.ImageData+'"></img><br>';
       $scope.messages.push(angular.extend({}, nextMessage));  
			$scope.$apply(function () {
				//$scope.images.push(entry.nativeURL);
			});
		}

		function fail(error) {
			console.log("fail: " + error.code);
		}


//copy ends
 //  var nextMessage = messageOptions[messageIter++ % messageOptions.length];

       //'<progress max="100" value="80" class="html5"> <div class="progress-bar"> <span style="width: 80%">80%</span></div></progress>'
		
		
   
 

 }
 

   
}

    $scope.addPic = function() {
   var nextMessage = messageOptions[messageIter++ % messageOptions.length];
   
 $rootScope.mobileServiceClient.invokeApi("getuploadblobsas", {
    body: { fileName: $scope.newFileName, Fileype: 'jpeg', UserPhone: '555-555-1234' },
    method: "get"
}).done(function (response) {
    
   console.log(response);
   console.log(response.result.sasUrl);
   var uriWithAccess = response.result.sasUrl;
}, function(error) {
    alert(error.result);
});

     

console.log("nextmessage content is" + nextMessage.content);
   
    console.log($scope.messages);
  };

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

myApp.controller('initCtrl', function($scope, $state, $ionicPopover, $ionicHistory) {
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
   // $scope.demo = p;
 	console.log("setting platform as ios for popup alwasy");
    //document.body.classList.add('platform-ios');
    $scope.demo = p;
  }

 $scope.setPlatform('ios');

  console.log("in init control");
      $scope.goBack = function(){
      console.log("pressed goback");
   $ionicHistory.goBack();
}

 $scope.isPlaying = false;

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
  
  
if(window.localStorage.getItem("setting") != undefined) //default settings;;
{

$rootScope.Language = window.localStorage.getItem("language");

}
else
{
$rootScope.Language = 0;

}


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



