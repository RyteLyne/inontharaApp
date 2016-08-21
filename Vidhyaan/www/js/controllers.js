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


   var priv = {};

   var Sub = $rootScope.GetDocument("SubscriberInfo");
   console.log("Subscriber : ", Sub);


   priv = Sub.DocumentBody.ApplicationSpecificData.previlageLevels;



  /*
  jQuery.getJSON('json/subscriberInfo.json', function(data) {

   priv = data.DocumentBody.ApplicationSpecificData.previlageLevels;
   console.log("priv:" ,priv);
  });
   
 */




///


 //jQuery.getJSON('json/ProgramInfo.json', function(data) {
 // console.log("inJquery Right");

   var pro = $rootScope.GetDocument("ProgramInfo");
   var items = pro.DocumentBody.ApplicationsSpecificData.appPrograms;
   console.log(items);


       $scope.rightItems = [];
       var lang = $rootScope.Language.toString();
       var k=0;

       var SubChannels = Sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;


//load commonly used information onto AppUserInformation;;

   $rootScope.AppUserInformation.PrivLevels = priv;
   $rootScope.AppUserInformation.SubId = Sub.DocumentBody.ApplicationSpecificData.SubscriberID;
   $rootScope.AppUserInformation.OrgId = Sub.DocumentHeader.OrganizationId;
   $rootScope.AppUserInformation.OrgName = Sub.DocumentHeader.OrganizationName;

   $rootScope.AppUserInformation.Class = Sub.DocumentBody.Document_Details.profile.Division;
   
   $rootScope.AppUserInformation.UserAvatar = Sub.DocumentBody.Document_Details.profile.Avatar;

   var titled = Sub.DocumentBody.Document_Details.profile.Titled;

   $rootScope.AppUserInformation.UserTag = titled[lang]==undefined ? titled["1"]: titled[lang];
 
   var fname = Sub.DocumentBody.Document_Details.profile.FirstName;
   var lname = Sub.DocumentBody.Document_Details.profile.LastName;

   var fname1 = fname[lang]==undefined?fname["1"]:fname[lang];
   var lname1 = lname[lang]==undefined?lname["1"]:lname[lang];


   $rootScope.AppUserInformation.UserName = fname1 + " " + lname1;




   console.log("App Information");
   console.log($rootScope.AppUserInformation);

  
//end of AppUserInformation
  
   for (var i=0; i<items.length; i++) 
   {
    
     if(priv[items[i].mId]==undefined)
     continue;

     //console.log(items[i].mId);
     
    $scope.rightItems[k] = {
      icon: items[i].mIcon,
      ref:  items[i].mRef,
      text: items[i].mText[lang]==undefined?items[i].mText["1"]:items[i].mText[lang],
      id:   items[i].mId,
      runson : items[i].mRunsOn,
      cnt:  $rootScope.NotificationCounts["Nc_" + items[i].mId]==undefined?"":$rootScope.NotificationCounts["Nc_" + items[i].mId]
    };
   
   k++;
    
  }
   
   $scope.itemclick = function(id,runson) 
   {
   console.log(id);
   $rootScope.AppUserInformation.SelProgram = id;
   console.log("clicked Id : " , $rootScope.AppUserInformation.SelProgram);
   $rootScope.AppUserInformation.runson = $rootScope.GetProgramChannels(runson,SubChannels);
   console.log("runs on", $rootScope.AppUserInformation.runson);
   }

})


.controller('popOverCtrl',function($scope,$rootScope) {


   console.log("inJquery start");

 jQuery.getJSON('json/popOverMenu.json', function(data) {
  console.log("inJquery PopOver");
   var items = data;
   console.log(items);
       $scope.popItems = [];
       var lang = $rootScope.Language.toString();

   for (var i=0; i<items.items.length; i++) 
   {
    
     
    $scope.popItems[i] = {
      icon: items.items[i].mIcon,
      ref: items.items[i].mRef,
     

      text: items.items[i].mText[lang]==undefined?items.items[i].mText["0"]:items.items[i].mText[lang]
    };
   
   
    
  }
  console.log( items.items[0].mIcon);


 })

})


//load json profile;;
.controller('ProfileLoad',function($scope,$rootScope) {
  
  console.log("in Profile Load xxx");

  //jQuery.getJSON('json/subscriberInfo.json', function(data) {
  //console.log("in Profile Load yyy");

   //var basicprofile = data;
   var language = "0";

   var sub = $rootScope.GetDocument("SubscriberInfo");

   language = $rootScope.Language.toString();
   var obj = sub.DocumentBody.Document_Details.profile;

   console.log(language);

   $scope.profile=
   {
   mName: obj.FirstName[language]== undefined ?obj.FirstName["0"]:obj.FirstName[language],
   mGender : obj.Gender[language]== undefined ?obj.Gender["0"]:obj.Gender[language],
   mDOB : obj.DOB,
   mBloodGroup : obj.BloodGroup,	
   mGrade : obj.Division,
   mClassTeacher :  obj.ClassTeacher[language]== undefined ?obj.ClassTeacher["0"]:obj.ClassTeacher[language],
   mEnrollmentNo : obj.EnrollmentNumber,
   mMother :
   {
    Name :  obj.MothersName[language]== undefined ?obj.MothersName["0"]:obj.MothersName[language],
    Mobile : obj.MobileNumbers[1],
    Email : obj.EmailIds[1]
   },
   mFather :
   {
    Name : obj.FathersName[language]== undefined ?obj.FathersName["0"]:obj.FathersName[language],
    Mobile : obj.MobileNumbers[0],
    Email : obj.EmailIds[0]
   },
   mGaurdian :
   {
    Name : obj.GaurdiansName[language]== undefined ?obj.GaurdiansName["0"]:obj.GaurdiansName[language],
    Mobile : obj.MobileNumbers[2],
    Email : obj.EmailIds[2]
   },
   
   mHomeAddress : obj.Address[language]== undefined ?obj.Address["0"]:obj.Address[language],
   }

  
   console.log($scope.profile.mName);


  // var prop = data.ProfilePage;


jQuery.getJSON('json/uiLanguage.json', function(data) {



$scope.UiLanguageProfile = 
    {
		Title : data.ProfilePage.Title[language]==undefined?data.ProfilePage.Title["1"]:data.ProfilePage.Title[language],

		Name:  data.ProfilePage.Name[language]==undefined?data.ProfilePage.Name["1"]:data.ProfilePage.Name[language],

		DOB: data.ProfilePage.DOB[language]==undefined?data.ProfilePage.DOB["1"]:data.ProfilePage.DOB[language],

		Gender: data.ProfilePage.Gender[language]==undefined?data.ProfilePage.Gender["1"]:data.ProfilePage.Gender[language],

		Grade: data.ProfilePage.Grade[language]==undefined?data.ProfilePage.Grade["1"]:data.ProfilePage.Grade[language],
		Division:data.ProfilePage.Division[language]==undefined?data.ProfilePage.Division["1"]:data.ProfilePage.Division[language],
		
		EnrollmentNo:data.ProfilePage.EnrollmentNo[language]==undefined?data.ProfilePage.EnrollmentNo["1"]:data.ProfilePage.EnrollmentNo[language],
		
		BloodGroup: data.ProfilePage.BloodGroup[language]==undefined?data.ProfilePage.BloodGroup["1"]:data.ProfilePage.BloodGroup[language],
		
		ClassTeacher: data.ProfilePage.ClassTeacher[language]==undefined?data.ProfilePage.ClassTeacher["1"]:data.ProfilePage.ClassTeacher[language],
		
		MomName: data.ProfilePage.MomName[language]==undefined?data.ProfilePage.MomName["1"]:data.ProfilePage.MomName[language],
		
		FatherName: data.ProfilePage.FatherName[language]==undefined?data.ProfilePage.FatherName["1"]:data.ProfilePage.FatherName[language],
		
		MomMobileNo: data.ProfilePage.MomMobileNo[language]==undefined?data.ProfilePage.MomMobileNo["1"]:data.ProfilePage.MomMobileNo[language],
		
		FatherMobileNo:data.ProfilePage.FatherMobileNo[language]==undefined?data.ProfilePage.FatherMobileNo["1"]:data.ProfilePage.FatherMobileNo[language],
		
		HomeAddress:data.ProfilePage.HomeAddress[language]==undefined?data.ProfilePage.HomeAddress["1"]:data.ProfilePage.HomeAddress[language],
    }


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

 

    var groupcnt=0;

   console.log("inside 456");



   var priv = {};
   var sub = $rootScope.GetDocument("SubscriberInfo");
   priv = sub.DocumentBody.ApplicationSpecificData.previlageLevels;

 /* jQuery.getJSON('json/subscriberInfo.json', function(data) {

   priv = data.DocumentBody.ApplicationSpecificData.previlageLevels;
   console.log("priv:" ,priv);


  });*/

  var subscribedchannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;

  var pro = $rootScope.GetDocument("ProgramInfo");
  var orid = sub.DocumentHeader.OrganizationId;
 
   var groups = pro.DocumentBody.ApplicationsSpecificData.feedPrograms;
   console.log(groups);
   $scope.groups = [];
 
   console.log("groups:" ,groups);
  

  var k=0;
  var language = $rootScope.Language.toString();

  var SubChannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;


  console.log("new Language ", language);

   for (var i=0; i<groups.length; i++) {

if(groups[i].mId != undefined )
    if(priv[groups[i].mId]==undefined)
     continue;


    $scope.groups[k] = {
      name: groups[i].mName[language]== undefined ?groups[i].mName["0"]:groups[i].mName[language],
      icon: groups[i].mIcon,
      ref:  groups[i].mRef,
      id :  groups[i].mId,
      runson: groups[i].mRunsOn,
      cnt : $rootScope.NotificationCounts["Nc_" + groups[i].mId]==undefined?"":$rootScope.NotificationCounts["Nc_" + groups[i].mId],
      items: []
    };


  


     if(groups[i].mItems !== undefined) //sub items present;;
     {
       groupcnt = 0;
       l=0;

    for (var j=0; j<groups[i].mItems.length; j++) 
    {
   
    if(priv[groups[i].mItems[j].mId]==undefined)
     continue;
  
     // $scope.groups[i].items.push(groups.groups[i].mItems[j]);



      $scope.groups[k].items[l] = {
      name: groups[i].mItems[j].mName[language]== undefined ?groups[i].mItems[j].mName["0"]:groups[i].mItems[j].mName[language],
      icon: groups[i].mItems[j].mIcon,
      ref: groups[i].mItems[j].mRef,
      id : groups[i].mItems[j].mId,
      runson: groups[i].mItems[j].mRunsOn,
      cnt : $rootScope.NotificationCounts["Nc_" + groups[i].mItems[j].mId]==undefined?"":$rootScope.NotificationCounts["Nc_" + groups[i].mItems[j].mId],
      };
        
      

        if($scope.groups[k].items[l].cnt > 0)
      groupcnt = groupcnt + $scope.groups[i].items[j].cnt;

      l++;

    }

       $scope.groups[k].cnt = groupcnt;

       if(l<=0) k--; //remove parent element;;

     }

     k++;
    
  } //end of main for loop;;



   

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


   $scope.itemclick = function(id,runson) {
   $rootScope.AppUserInformation.SelProgram = id;
   console.log("clicked Id : " , $rootScope.AppUserInformation.SelProgram);
   $rootScope.AppUserInformation.runson = $rootScope.GetProgramChannels(runson,SubChannels);
   console.log("runs on", $rootScope.AppUserInformation.runson);

  }

})


.controller('slideCtrl', function($scope, $state, $ionicHistory) {
  
   console.log("in SlideCtrl");

  jQuery.getJSON('json/settings.json', function(data) {

   $scope.slides = data.slideImages;
  

  });
  

})


.controller('SplashCtrl', function($scope,$rootScope,$state) {

$scope.Credentials =
  {
    username : "",
    password : ""
  }

if(window.localStorage.getItem("setting") != undefined && window.localStorage.getItem("username") != undefined && window.localStorage.getItem("password") != undefined) //default settings;;
{
$scope.Credentials.username = window.localStorage.getItem("username");
$scope.Credentials.password = window.localStorage.getItem("password");
//login to server here, if success redirect to home page;;
if($scope.Credentials.username == "1234" && $scope.Credentials.password == "1234")
{

 $state.go('app.home',{},{reload:true});
}
else
 $state.go('login',{},{reload:true});

}
else
$state.go('login',{},{reload:true});

})

.controller('AppCtrl', function($scope, $ionicPopover) {

  
 
})

.controller('LogInCtrl', function($scope,$rootScope,$state, $ionicScrollDelegate) {

$scope.Credentials =
  {
    username : "",
    password : ""
  }

jQuery.getJSON('json/settings.json', function(data) {

   $scope.loginImages = data.loginScreen;


  });
  
  

  $scope.login = function Login()
  {
   $scope.scrollSmallToTop();
    console.log("UserName: ", $scope.Credentials.username, "Password: " , $scope.Credentials.password);
  //login to server here, if success redirect to home page;;
  if($scope.Credentials.username == "1234" && $scope.Credentials.password == "1234")
   {
      console.log("new log in");
      window.localStorage.setItem("username",$scope.Credentials.username);
      window.localStorage.setItem("password",$scope.Credentials.password);
      $state.go('app.home',{},{reload:true});
   
   };



  }

$scope.scrollSmallToTop = function() {
 console.log("did i scroll");
    $ionicScrollDelegate.$getByHandle('simpleScrollAnime').scrollTop(true);
  };

})


.controller('newsfeedctrl', function($scope,$window,$state,$rootScope) {

 // $scope.$on('$ionicView.beforeEnter', function(){

  /*   console.log("entered");

  jQuery.getJSON('json/channel-program.json', function(data) {

    var programName = 'ProgramId_' + $rootScope.SelChannel;

    console.log(programName);

    $scope.proData = data[programName].ProgramData; */



  $scope.LoadNewsList = function()
  {

    var itemname = "NewsList_" + $rootScope.SelChannel;

   $scope.newslist = JSON.parse(window.localStorage.getItem(itemname));
   
   if($scope.newslist == null)
   {

   console.log("News Loaded from json");

   jQuery.getJSON('json/Timeline.json', function(data) {

   $scope.newslist = data.TimeLine; 
   window.localStorage.setItem(itemname,JSON.stringify($scope.newslist));

   });

  
   }
  else
  {

    console.log("News Loaded from localstorage");
  }


  }

  $scope.LoadNewsList();
  

  
    


    $scope.SliceData = function(datatoslice)
    {
       if(datatoslice.length > 100)
        return(datatoslice.slice(0,100));
       else
       return(datatoslice);

    }

  



})

.controller('LogOutCtrl', function($scope,$window,$state) {

if(window.localStorage.getItem("setting") != undefined) //default settings;;
{
window.localStorage.removeItem("username");
window.localStorage.removeItem("password");
}

console.log("Log out");

$state.go('login',{},{reload:true});

})



.controller('PlatformCtrl', function($scope, $rootScope, $state, $http) {
	console.log("plaform controller");
	 $rootScope.mobileServiceClient = new WindowsAzure.MobileServiceClient(
                   'https://edum.azure-mobile.net',
                     'yVQPRKXxocEazjPjDXGSnmIpyCBTYc97');
               console.log($scope.mobileServiceClient);
var currentPlatform = ionic.Platform.platform();
  var currentPlatformVersion = ionic.Platform.version();
 $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
 console.log($rootScope.devWidth);
 $rootScope.menuWidth = 0.90 * $rootScope.devWidth;
 console.log($rootScope.menuWidth);
  
  
if(window.localStorage.getItem("setting") != undefined) //default settings;;
{

$rootScope.Language = window.localStorage.getItem("language");

}
else
{
$rootScope.Language = 1;

}






})

.controller('GlobalCtrl', function($scope,$rootScope){

$rootScope.UpdateTimeLine = function(msg)
{

if( msg.DocumentHeader.DocumentType!= "NEWSFEED")
return;


var DocBody = JSON.parse(msg.DocumentBody);
if(DocBody.ApplicationSpecificData.TimeLine == true)
{
  var tline = { 
  "MsgId" : msg.DocumentHeader.DocumentId,
  "Heading" : DocBody.ApplicationSpecificData.Heading,
  "Image" : DocBody.ApplicationSpecificData.Thumbnail,
  "TextPreview" :DocBody.ApplicationSpecificData.ContentPreview,
  "Avatar" :   DocBody.ApplicationSpecificData.AuthorAvatar,
  "Author" : DocBody.ApplicationSpecificData.AuthorName,
  "DateTime" : DocBody.ApplicationSpecificData.Datetime
  };   


var timeline = JSON.parse(window.localStorage.getItem("TimeLine"));

if(timeline == null)
{
 timeline = [];
 timeline[0] = tline;
}
else
{
timeline.unshift(tline);  
}

window.localStorage.setItem("TimeLine",timeline);

}

} // end of $rootScope.UpdateTimeLine = function(msg)



$rootScope.UpdateMsgList = function(msg)
{


  if( msg.DocumentHeader.DocumentType!= "NEWSFEED")
   return;


var DocBody = JSON.parse(msg.DocumentBody);

  var tline = { 
  "MsgId" : msg.DocumentHeader.DocumentId,
  "Heading" : DocBody.ApplicationSpecificData.Heading,
  "Image" : DocBody.ApplicationSpecificData.Thumbnail,
  "TextPreview" :DocBody.ApplicationSpecificData.ContentPreview,
  "Avatar" :   DocBody.ApplicationSpecificData.AuthorAvatar,
  "Author" : DocBody.ApplicationSpecificData.AuthorName,
  "DateTime" : DocBody.ApplicationSpecificData.Datetime,
  "ChannelId" : msg.DocumentSubHeader.ChannelId,
  };   

var localtag = "Msg_" + msg.DocumentSubHeader.ProgramId;

var msgs = JSON.parse(window.localStorage.getItem(localtag));

if(msgs == null)
{
msgs = [];
msgs[0] = tline;
}
else
{
msgs.unshift(tline);  
}

window.localStorage.setItem(localtag,msgs);
}


$rootScope.AddMsgToFile = function(msg)
{

var filename = "msg_" + msg.DocumentHeader.DocumentId;
var DocBody = JSON.parse(msg.DocumentBody);

$cordovaFile.writeFile("files", filename,JSON.stringify(DocBody.Document_Details),true);
}


})



.controller('TimeLineCtrl', function($scope) {

//window.localStorage.removeItem("TimeLine");

  $scope.LoadTimeLine = function()
  {

   $scope.timeline = JSON.parse(window.localStorage.getItem("TimeLine"));
   
   if($scope.timeline == null)
   {

   console.log("Loaded from json");

   jQuery.getJSON('json/Timeline.json', function(data) {

   $scope.timeline = data.TimeLine; 
   window.localStorage.setItem("TimeLine",JSON.stringify($scope.timeline));

   });

  
   }
  else
  {

    console.log("Loaded from localstorage");
  }


  }

  $scope.LoadTimeLine();




/*
  $scope.timeline = [{
    date: new Date(),
    title: "Your kids education",
    author: "Class Teacher",
    profilePicture: "https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg",
    text: "Your kids education is very important",
    type: "location"

  }, {
    date: new Date(),
    title: "For my friends",
    author: "Sara Orwell",
    profilePicture: "https://lh5.googleusercontent.com/-ZadaXoUTBfs/AAAAAAAAAAI/AAAAAAAAAGA/19US52OmBqc/photo.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "text"

  }, {
    date: new Date(),
    title: "Look at my video!",
    author: "Miranda Smith",
    profilePicture: "https://static.licdn.com/scds/common/u/images/apps/plato/home/photo_profile_headshot_200x200_v2.jpg",
    text: "Lorem ipsum dolor sit amet",
    type: "video"

  }, {
    date: new Date(),
    title: "Awesome picture",
    author: "John Mybeweeg",
    profilePicture: "http://www.lawyersweekly.com.au/images/LW_Media_Library/LW-602-p24-partner-profile.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "picture"
  }] */
})

.controller('IconsCtrl', function($scope) {
  $scope.timeline = [{
    date: new Date(),
    title: "Awesome picture",
    author: "John Mybeweeg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "picture"
  }, {
    date: new Date(),
    title: "Look at my video!",
    author: "Miranda Smith",
    text: "Lorem ipsum dolor sit amet",
    type: "video"

  }, {
    date: new Date(),
    title: "I am here",
    author: "Ludo Anderson",
    text: "Lorem ipsum dolor sit amet",
    type: "location"

  }, {
    date: new Date(),
    title: "For my friends",
    author: "Sara Orwell",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "text"

  }]

  
})


.controller('SettingsCtrl', function($scope,$window,$rootScope) {

$scope.choice = 
{
langchoice : 1,
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
window.localStorage.setItem("language",1);
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

var lang = $rootScope.Language.toString();



 $scope.UiLanguageSettings = 
 {
Title:  data.SettingsPage.Title[lang]==undefined?data.SettingsPage.Title["1"]:data.SettingsPage.Title[lang],
ChangePassword : data.SettingsPage.ChangePassword[lang]==undefined?data.SettingsPage.ChangePassword["1"]:data.SettingsPage.ChangePassword[lang],
OldPassword : data.SettingsPage.OldPassword[lang]==undefined?data.SettingsPage.OldPassword["1"]:data.SettingsPage.OldPassword[lang],
NewPassword : data.SettingsPage.NewPassword[lang]==undefined?data.SettingsPage.NewPassword["1"]:data.SettingsPage.NewPassword[lang],
RepeatPassword :  data.SettingsPage.RepeatPassword[lang]==undefined?data.SettingsPage.RepeatPassword["1"]:data.SettingsPage.RepeatPassword[lang],
EnableNotification : data.SettingsPage.EnableNotification[lang]==undefined?data.SettingsPage.EnableNotification["1"]:data.SettingsPage.EnableNotification[lang],
NotificationOn :  data.SettingsPage.NotificationOn[lang]==undefined?data.SettingsPage.NotificationOn["1"]:data.SettingsPage.NotificationOn[lang],
NotificationOff : data.SettingsPage.NotificationOff[lang]==undefined?data.SettingsPage.NotificationOff["1"]:data.SettingsPage.NotificationOff[lang],
Change : data.SettingsPage.Change[lang]==undefined?data.SettingsPage.Change["1"]:data.SettingsPage.Change[lang],
Language: data.SettingsPage.Language[lang]==undefined?data.SettingsPage.Language["1"]:data.SettingsPage.Language[lang]

}



 $scope.LanguageOptions = data.LanguageOptions;

 console.log($scope.LanguageOptions);
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