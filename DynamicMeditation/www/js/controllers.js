angular.module('DynamicMeditation.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('RightMenuCtrl', function($scope, $stateParams, $rootScope) {
 console.log("inJquery start");

 jQuery.getJSON('json/rightPanel.json', function(data) {
  console.log("inJquery Right");
   var items = data;
   console.log(items);
       $scope.rightItems = [];
       var lang ="";

   for (var i=0; i<items.items.length; i++) 
   {
    
     
    $scope.rightItems[i] = {
      icon: items.items[i].mIcon,
      ref: items.items[i].mRef,
      text: items.items[i].mText[$rootScope.Language]
    };
   
    
  }
  console.log( items.items[0].mIcon);
   
    })

})


//load json profile;;
.controller('ProfileLoad',function($scope,$rootScope) {
  
  console.log("in Profile Load xxx");

  jQuery.getJSON('json/profile.json', function(data) {
  console.log("in Profile Load yyy");

   //var basicprofile = data;
   
   
   $scope.profile=data.profile[$rootScope.Language];

   /*
   $scope.profile=
   {
   mName: data.profile[i].mName,
   mGender: data.profile[i].mGender,
   mDOB: data.profile[i].mDOB,
   mBloodGroup:data.profile[i].mBloodGroup,	
   mClass : data.profile[i].mClass,
   mDivision : data.profile[i].mDivision,
   mClassTeacher :data.profile[i].mClassTeacher,
   mEnrollmentNo : data.profile[i].mEnrollmentNo,
   mMomName : data.profile[i].mMomName,
   mFatherName : data.profile[i].mFatherName,
   mMomMobileNo : data.profile[i].mMomMobileNo,
   mFatherMobileNo : data.profile[i].mFatherMobileNo,
   mHomeAddress : data.profile[i].mHomeAddress
   }*/
  
   console.log($scope.profile.mName);
       
    }) //end of function($data);;


jQuery.getJSON('json/UiLanguage.json', function(data) {

 $scope.UiLanguageProfile = data.ProfilePage[$rootScope.Language];
 $scope.UiProfileReady=1;
 console.log("In uiLanguage zzz");
 //console.log("title", UiLanguageProfile.Title);

   });

}) //end of function($scope);;



.controller('SideMenuCtrl', function($scope, $rootScope, $timeout, $stateParams, $ionicSideMenuDelegate) {

  /*!
   * Expects number from 0.0 -> 1.0
   * Returns absolute value
   * 
   * @param {Number}
   * @return {Number}
   */
    //var groups={};

   console.log("inside 456");
   //$scope.tree =[10];

  /* jQuery.getJSON('json/leftPanel.json', function(data) {
   console.log("inside 123");
  
   $scope.tree = data.group;

   
    $scope.theme = 'ionic-sidemenu-blue';
    $scope.load = 1;

   console.log(data);
 
    });*/



  jQuery.getJSON('json/leftPanel.json', function(data) {
  console.log("inJquery");
 // console.log(data);
   var groups = data;
   console.log(groups);
       $scope.groups = [];
 
   console.log(groups.groups);
   for (var i=0; i<groups.groups.length; i++) {
    $scope.groups[i] = {
      name: groups.groups[i].mName[$rootScope.Language],
      icon: groups.groups[i].mIcon,
      ref: groups.groups[i].mRef,
      items: []
    };
     if(groups.groups[i].mItems !== undefined)
    for (var j=0; j<groups.groups[i].mItems.length; j++) 
    {
    //  console.log(groups.groups.[i].name)
   
     // $scope.groups[i].items.push(groups.groups[i].mItems[j]);

      $scope.groups[i].items[j] = {
      name: groups.groups[i].mItems[j].mName[$rootScope.Language],
      icon: groups.groups[i].mItems[j].mIcon,
      ref: groups.groups[i].mItems[j].mRef,
      };

    }
  }
   
    });

     $scope.toggleGroup = function(group) {
       //console.log("toggle toggle");
    if ($scope.isGroupShown(group)) {

      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    //console.log("shown shown");
    return $scope.shownGroup === group;
  };

  var transitionIn = function(ratio) {
    return Math.abs(ratio);
  }

  /*!
   * Expects number from 0.0 to 1.0
   * Returns absolute value in reverse 1.0 -> 0.0
   *
   * @param {Number}
   * @return {Number}
   */
  // 1.0 to 0.0
  var transitionOut = function(ratio) {
    return (1- Math.abs(ratio));
  }

  /*!
   * Expects number from 0.0 to 1.0
   * Returns absolute value from number to number
   * Ex. 10 -> 20 or 20 -> 10
   *
   * @param {Number}
   * @param {Number}
   * @param {Number}
   * @return {Number}
   */
  // from min to max
  var transitionFromTo = function(ratio, from, to) {
    return from - (Math.abs(ratio) * (from - to));
  }

  $scope.fadeIn = function(element, ratio) {
    element.style.transform = element.style.webkitTransform = 'scale(' + transitionIn(ratio) + ')';
    element.style.opacity = transitionIn(ratio);
  }

  $scope.slideUp = function(element, ratio) {
    element.style.transform = element.style.webkitTransform = 'translateY(' + transitionFromTo(ratio, 100, 0) + '%' + ')';
  }


})


.controller('slideCtrl', function($scope, $state, $ionicHistory) {
  
   console.log("in SlideCtrl");

  jQuery.getJSON('json/settings.json', function(data) {

   $scope.slides = data.slideImages;


  });
  

})






.controller('LogInCtrl', function($scope,$rootScope) {

  $scope.Credentials =
  {
    username : "",
    password : ""
  }

  $scope.login = function LogIn()
  {
    
    console.log("UserName: ", $scope.Credentials.username, "Password: " , $scope.Credentials.password);
  }


})


.controller('SettingsCtrl', function($scope,$window,$rootScope) {

$scope.choice = 
{
langchoice : 0,
notichoice : 0
};

console.log("Language : " , $rootScope.Language);

//window.localStorage.removeItem("setting");
//window.localStorage.removeItem("language");
//window.localStorage.removeItem("notichoice");

//load setting from file here;;

if(window.localStorage.getItem("setting") == undefined) //default settings;;
{
window.localStorage.setItem("setting","1");
window.localStorage.setItem("language",0);
window.localStorage.setItem("notichoice",0);
console.log("Setting First Time");
}
else
{
$scope.choice.langchoice = window.localStorage.getItem("language");
$scope.choice.notichoice = window.localStorage.getItem("notichoice");

console.log("Noti choice", $scope.choice.notichoice);
}


$scope.notificationstatus = "";


jQuery.getJSON('json/uiLanguage.json', function(data) {

 $scope.UiLanguageSettings = data.SettingsPage[$rootScope.Language];

 console.log("In uiLanguage sss");
 //console.log("title", UiLanguageProfile.Title);

if($scope.choice.notichoice == true)
 $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOn;
 else
  $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOff;
   });

 $scope.languageChange = function(item) 
 {
   window.localStorage.setItem("language",$scope.choice.langchoice);
   
    console.log("Selected value, text:", item);
     $window.location.reload(true);
  };

 $scope.NotificationChange = function() 
 {
    console.log("Notification Changed");
    console.log($scope.choice.notichoice);
 if($scope.choice.notichoice == true)
 {
 $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOn;
 window.localStorage.setItem("notichoice",1);
 }
 else
 {
  $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOff;
  window.localStorage.setItem("notichoice",0);
 }


     


 };


});