angular.module('Vidhyaan.controllers', ['angularMoment'])/*
ProfileCtrl
RadioCtrl
DiaryCtrl
TimetableCtrl
AttendanceCtrl
GalleryCtrl
MessagesCtrl
CalendarCtrl
NoticeboardCtrl
OnlineCtrl
SurveyCtrl
AssignmentsCtrl
"SyllabusCtrl"
"PaymentsCtrl"
"MagazinesCtrl"
"NotesCtrl"
"LocatemeCtrl"
"LostnfoundCtrl"
"LostnfoundCtrl"
"LeavesCtrl"
"feedbackCtrl"
"ResultsCtrl"

*/
.controller('ResultsCtrl', function($scope) {
    console.log("in ResultsCtrl");
}).controller('feedbackCtrl', function($scope) {
    console.log("in feedbackCtrl");
}).controller('LeavesCtrl', function($scope) {
    console.log("in LeavesCtrl");
}).controller('LostnfoundCtrl', function($scope) {
    console.log("in LostnfoundCtrl");
}).controller('LocatemeCtrl', function($scope, $ionicLoading, $compile) {
    console.log("in LocatemeCtrl");
    var div = document.getElementById("map_canvas");
    console.log("before");
    map = plugin.google.maps.Map.getMap(div);
    console.log(mpa);
    console.log("after");
}).controller('NotesCtrl', function($scope) {
    console.log("in NotesCtrlCtrl");
}).controller('MagazinesCtrl', function($scope) {
    console.log("in MagazinesCtrl");
}).controller('PaymentsCtrl', function($scope) {
    console.log("in PaymentsCtrl");
}).controller('SyllabusCtrl', function($scope) {
    console.log("in SyllabusCtrl");
}).controller('AssignmentsCtrl', function($scope) {
    console.log("in AssignmentsCtrl");
}).controller('SurveyCtrl', function($scope) {
    console.log("in SurveyCtrl");
}).controller('OnlineCtrl', function($scope) {
    console.log("in OnlineCtrl");
}).controller('NoticeboardCtrl', function($scope) {
    console.log("in NoticboardCtrl");
}).controller('CalendarCtrl', function($scope) {
    console.log("in CalendarCtrl");
}).controller('MessagesCtrl', function($scope) {

    console.log("in MessagesCtrl");


}).controller('GalleryCtrl', function($scope) {
    console.log("in GalleryCtrl");
    $scope.items = [
  {
    src:'http://www.wired.com/images_blogs/rawfile/2013/11/offset_WaterHouseMarineImages_62652-2-660x440.jpg',
    sub: 'Shreyamsa eating fish <b>subtitle</b>'
  },
  {
    src:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg',
    sub: '' /* Not showed */
  },
  {
    src:'http://www.hdwallpapersimages.com/wp-content/uploads/2014/01/Winter-Tiger-Wild-Cat-Images.jpg',
    thumb:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg'
  }
];
    $scope.items1 = [
  
    {
    src:'http://www.hdwallpapersimages.com/wp-content/uploads/2014/01/Winter-Tiger-Wild-Cat-Images.jpg',
    thumb:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg'
  },
  {
    src:'http://www.hdwallpapersimages.com/wp-content/uploads/2014/01/Winter-Tiger-Wild-Cat-Images.jpg',
    thumb:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg'
  },
   { src:'http://www.wired.com/images_blogs/rawfile/2013/11/offset_WaterHouseMarineImages_62652-2-660x440.jpg',
    sub: 'Shreyamsa eating fish <b>subtitle</b>'
  },
  {
    src:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg',
    sub: '' /* Not showed */
  }
  
]
}).controller('CardCtrl', function($scope, TDCardDelegate) {
    console.log("in CardCtrl");
})




.controller('CardsCtrl240', function($scope, TDCardDelegate, $timeout) {
    console.log("in AttendanceCtrl");

/*
   var sub = $rootScope.GetDocument("SubscriberInfo");

   var subChannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;

   var ProgramId = $rootScope.AppUserInformation.SelProgram;

   var Role = sub.DocumentBody.ApplicationSpecificData.SubscriberRole;

   $rootScope.AppUserInformation.runson;


   if($rootScope.AppUserInformation.WritePriv == true) // can take attendence;;
   {



   }*/


   


    jQuery.getJSON('json/attendtest.json', function(data) {

        var tp = data.DocumentBody.ApplicationSpecificData.subcribers;
        var cardTypes = [];
     
      for(var i = 0;i<tp.length;i++)
      {
        if(tp[i].role=="student")
        cardTypes.push(angular.extend({},tp[i]));
      }
  


        $scope.cards = {
        master: Array.prototype.slice.call(cardTypes, 0),
        active: Array.prototype.slice.call(cardTypes, 0),
        discards: [],
        //liked: [],
        //disliked: []
    }

    })

   


   

    $scope.cardDestroyed = function(index) {
        console.log("Destroyed");
        //$scope.cards.active.splice(index, 1);
    };

    $scope.addCard = function() {
        var newCard = cardTypes[0];
        $scope.cards.active.push(angular.extend({}, newCard));
    }
    $scope.refreshCards = function() {
        // Set $scope.cards to null so that directive reloads
        $scope.cards.active = null ;
        $timeout(function() {
            $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
        });
    }
    $scope.$on('removeCard', function(event, element, card) {
        var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
        $scope.cards.discards.push(discarded);
    });
    $scope.cardSwipedLeft = function(index) {
        console.log('LEFT SWIPE');
        //var card = $scope.cards.active[index];
        //$scope.cards.disliked.push(card);
    }
    ;
    $scope.cardSwipedRight = function(index) {
        console.log('RIGHT SWIPE');
        //var card = $scope.cards.active[index];
        //$scope.cards.liked.push(card);
    }
    ;
})



.controller('TimetableCtrl', function($scope) {
    console.log("in TimetableCtrl");

    
}).controller('DiaryCtrl', function($scope) {
    console.log("in DiaryCtrl");
}).controller('RadioCtrl', function($scope) {
    console.log("in RadioCtrl");
}).controller('ProfileCtrl', function($scope) {
    console.log("in ProfileCtrl");
}).controller('DashCtrl', function($scope) {}).controller('ChatsCtrl', function($scope, Chats) {
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
    }
    ;
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})



//load json profile;;
.controller('ProfileLoad', function($scope, $rootScope) {
    console.log("in Profile Load xxx");
    //jQuery.getJSON('json/subscriberInfo.json', function(data) {
    //console.log("in Profile Load yyy");
    //var basicprofile = data;
    var language = "0";
    var sub = $rootScope.GetDocument("SubscriberInfo");
    language = $rootScope.Language.toString();
    var obj = sub.DocumentBody.Document_Details.profile;
    console.log(language);
    $scope.profile = {
        mFirstName: obj.FirstName[language] == undefined ? obj.FirstName["0"] : obj.FirstName[language],
        mLastName: obj.LastName[language] == undefined ? obj.LastName["0"] : obj.LastName[language],
        mGender: obj.Gender[language] == undefined ? obj.Gender["0"] : obj.Gender[language],
        mDOB: obj.DOB,
        mBloodGroup: obj.BloodGroup,
        mGrade: obj.Division,
        mClassTeacher: obj.ClassTeacher[language] == undefined ? obj.ClassTeacher["0"] : obj.ClassTeacher[language],
        mEnrollmentNo: obj.EnrollmentNumber,
        mOrganizationName: sub.DocumentHeader.OrganizationName,
        mMother: {
            Name: obj.MothersName[language] == undefined ? obj.MothersName["0"] : obj.MothersName[language],
            Mobile: obj.MobileNumbers[1],
            Email: obj.EmailIds[1]
        },
        mFather: {
            Name: obj.FathersName[language] == undefined ? obj.FathersName["0"] : obj.FathersName[language],
            Mobile: obj.MobileNumbers[0],
            Email: obj.EmailIds[0]
        },
        mGaurdian: {
            Name: obj.GaurdiansName[language] == undefined ? obj.GaurdiansName["0"] : obj.GaurdiansName[language],
            Mobile: obj.MobileNumbers[2],
            Email: obj.EmailIds[2]
        },
        mHomeAddress: obj.Address[language] == undefined ? obj.Address["0"] : obj.Address[language],
    }
    console.log($scope.profile.mName);
    // var prop = data.ProfilePage;
    jQuery.getJSON('json/UiLanguage.json', function(data) {
        $scope.UiLanguageProfile = {
            Title: data.ProfilePage.Title[language] == undefined ? data.ProfilePage.Title["1"] : data.ProfilePage.Title[language],
            Name: data.ProfilePage.Name[language] == undefined ? data.ProfilePage.Name["1"] : data.ProfilePage.Name[language],
            DOB: data.ProfilePage.DOB[language] == undefined ? data.ProfilePage.DOB["1"] : data.ProfilePage.DOB[language],
            Gender: data.ProfilePage.Gender[language] == undefined ? data.ProfilePage.Gender["1"] : data.ProfilePage.Gender[language],
            Grade: data.ProfilePage.Grade[language] == undefined ? data.ProfilePage.Grade["1"] : data.ProfilePage.Grade[language],
            Division: data.ProfilePage.Division[language] == undefined ? data.ProfilePage.Division["1"] : data.ProfilePage.Division[language],
            EnrollmentNo: data.ProfilePage.EnrollmentNo[language] == undefined ? data.ProfilePage.EnrollmentNo["1"] : data.ProfilePage.EnrollmentNo[language],
            BloodGroup: data.ProfilePage.BloodGroup[language] == undefined ? data.ProfilePage.BloodGroup["1"] : data.ProfilePage.BloodGroup[language],
            ClassTeacher: data.ProfilePage.ClassTeacher[language] == undefined ? data.ProfilePage.ClassTeacher["1"] : data.ProfilePage.ClassTeacher[language],
            MomName: data.ProfilePage.MomName[language] == undefined ? data.ProfilePage.MomName["1"] : data.ProfilePage.MomName[language],
            FatherName: data.ProfilePage.FatherName[language] == undefined ? data.ProfilePage.FatherName["1"] : data.ProfilePage.FatherName[language],
            GuardianName:data.ProfilePage.GuardianName[language] == undefined ? data.ProfilePage.GuardianName["1"] : data.ProfilePage.GuardianName[language],
            MomMobileNo: data.ProfilePage.MomMobileNo[language] == undefined ? data.ProfilePage.MomMobileNo["1"] : data.ProfilePage.MomMobileNo[language],
            FatherMobileNo: data.ProfilePage.FatherMobileNo[language] == undefined ? data.ProfilePage.FatherMobileNo["1"] : data.ProfilePage.FatherMobileNo[language],
            HomeAddress: data.ProfilePage.HomeAddress[language] == undefined ? data.ProfilePage.HomeAddress["1"] : data.ProfilePage.HomeAddress[language],
        }
    });
})//end of function($scope);;



.controller('slideCtrl', function($scope, $state, $ionicHistory, $ionicNavBarDelegate) {
    console.log("in SlideCtrl");
       $ionicNavBarDelegate.align('left');
    jQuery.getJSON('json/settings.json', function(data) {
        $scope.slides = data.slideImages;
    });
})

.controller('SplashCtrl', function($scope, $rootScope, $state,$ionicLoading,datafactory) {
    $scope.Credentials = {
        username: "",
        password: ""
    }

    console.log("OK came here 1");

     if (!(window.localStorage.getItem("username") != undefined && window.localStorage.getItem("password") != undefined)) //default settings;;
    {
       $state.go('login', {}, {
            reload: true
        });

        console.log("Going back to Login");

       return;
    }

    $ionicLoading.show({
      template: 'Initializing...'
       });

console.log("OK came here");
        $scope.Credentials.username = window.localStorage.getItem("username");
        $scope.Credentials.password = window.localStorage.getItem("password");

        var sub = $rootScope.GetDocument("SubscriberInfo");

        var userId = sub.DocumentBody.ApplicationSpecificData.SubscriberID;
        var ordId = sub.DocumentHeader.OrganizationId;

        var initApp=function()
         {

        $rootScope.InitStorage();
        $rootScope.LoadNotificationCounts();
        $rootScope.GetAllTags();
        if (window.cordova) {
            $rootScope.InitPush();
        }
        
          }


          if($rootScope.AppUserInformation.firstLogIn== false)
          {
                initApp();
                $ionicLoading.hide(); 
                $state.go('app.home', {}, {
                    reload: true
                });
          }

   //get documents from server here;;

  
   Promise.all([datafactory.getdata(userId,ordId, "ProgramInfo"),datafactory.getdata( userId, ordId, "ChannelSummary")]).then(function() {
               
                
                initApp();
                $ionicLoading.hide();
                $rootScope.AppUserInformation.firstLogIn== false;
                $state.go('app.home', {}, {
                    reload: true
                });
                console.log("promise promise");
            })//getdata promise;;
            .catch(function(err) {
                
                alert("Unable to Query Server");
                $ionicLoading.hide();

                console.log("Unable to Query Server");

                return;
            });






})


.controller('LogInCtrl', function($scope, $rootScope, $state, $ionicScrollDelegate, datafactory, loginfactory,$ionicLoading)      {
    $scope.Credentials = {
        username: "",
        password: ""
    }
   
    jQuery.getJSON('json/settings.json', function(data) {
        $scope.loginImages = data.loginScreen;
    });

    $scope.Credentials.username = "1234-npsbsk";
    $scope.Credentials.password = "1234";

    $scope.login = function Login() {

        $ionicLoading.show({
      template: 'Logging In...'
       });

        $scope.scrollSmallToTop();
        console.log("UserName: ", $scope.Credentials.username, "Password: ", $scope.Credentials.password);
        Promise.all([loginfactory.getdata($scope.Credentials.username, $scope.Credentials.password)]).then(function(data) {
            console.log("serverdata",data);


            if (data[0].Result == "true") {
            console.log("Log in Success");
            window.localStorage.setItem("username", $scope.Credentials.username);
            window.localStorage.setItem("password", $scope.Credentials.password);
            $ionicLoading.hide(); 
            console.log("subinfo",data[0].Data);
            $rootScope.StoreDocument("SubscriberInfo",data[0].Data);
            $rootScope.AppUserInformation.firstLogIn = true;
             $state.go('splash', {}, {
                    reload: true
                });
            }

            else{
                console.log("Unable to Login");
                alert("Unable to Login");
                $ionicLoading.hide();
                return;
            }


        })//login promise;;
        .catch(function(err) {

            alert("Error Logging In..\nPlease check Internet Connection");
            console.log("Error Logging In..\nPlease check Internet Connection");
            $ionicLoading.hide();
            return;
        });
       
    }
    
    $scope.scrollSmallToTop = function() {
        console.log("did i scroll");
        $ionicScrollDelegate.$getByHandle('simpleScrollAnime').scrollTop(true);
    }
    ;
})



.controller('newsfeedctrl', function($scope, $window, $state, $rootScope, feedlistfactory) {
    ////////////
    $scope.newslist = "";
    ///////////
    $scope.LoadFeedList = function() {
        var progid = $rootScope.AppUserInformation.SelProgram;
        Promise.all([feedlistfactory.getdata(progid)]).then(function(ret) {
            $scope.newslist = ret[0];
            console.log("DataLoaded feedlist");
            console.log(ret);
            //console.log( $scope.timeline[0].Heading);
            //console.log( $scope.timeline[0].DateTime);
        })//getdata promise;;
        .catch(function(err) {
            //force login next time;;
            //window.localStorage.removeItem("username"); //uncomment these lines later;;
            //window.localStorage.removeItem("password");
            console.log("Error getting feedlist");
            return;
        });
    }
    $scope.LoadFeedList();
    $scope.itemclick = function(item) {
        console.log("clicked");
        console.log(item.MsgId);
        $rootScope.setAppState($state.current);
        $rootScope.MarkAsRead(item.MsgId);
        $rootScope.DecNotificationCounts($rootScope.AppUserInformation.SelProgram);
        $rootScope.AppUserInformation.DocId = item.MsgId;
        $rootScope.AppUserInformation.MsgSentBy = item.SubscribersID;
        $state.go('readView', {}, {
            reload: true
        });
    }

    $scope.OnComposeClick = function()
     {

       $rootScope.AppUserInformation.EditorType="compose";
       $rootScope.setAppState($state.current);
       $state.go('newsPostEditor', {}, {
            reload: true
        });

     }


     

    $scope.SliceData = function(datatoslice) {
        if (datatoslice.length > 100)
            return ( datatoslice.slice(0, 100)) ;
        else
            return ( datatoslice) ;
    }
    $scope.$on('NewFeedEvent', function(event, data) {
        console.log("News Event Fired in news feed ctrl");
        //console.log(data[0]); //feed preview data;;
        $scope.LoadFeedList();
        //$scope.timeline.unshift(data[0]);
        //console.log( $scope.timeline);
    });
    $scope.$on('FeedProgramEvent', function(event, data) {
        console.log("Feed program Event Fired in news feed ctrl");
        $scope.LoadFeedList();
        //$scope.timeline.unshift(data[0]);
    });
})

.controller('readPageCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet, feeddetailsfactory,blobDownloadFactory,$state) {
    $scope.readFunc = function() {}
    //$scope.readFunc();
    Promise.all([feeddetailsfactory.getdata($rootScope.AppUserInformation.DocId)]).then(function(ret) {
        if(ret[0] !=undefined)
        {
        $scope.messages = ret[0].messages.messages;
        $scope.canReply = ret[0].canReply;
        if($rootScope.isFromTimeLine == true)
          $scope.canReply =0; //cant reply from timeline;;
        }
        else
         $scope.messages = [];

         $rootScope.isFromTimeLine = false;

        console.log($scope.canReply);
        console.log("DataLoaded");
        console.log($scope.messages);
    })//getdata promise;;
    .catch(function(err) {
        //force login next time;;
        //window.localStorage.removeItem("username"); //uncomment these lines later;;
        //window.localStorage.removeItem("password");
        console.log("Error getting message");
        return;
    });
    //$scope.messages = JSON.parse(localStorage.getItem('recievedMessage'));
    //console.log($scope.messages);

    $scope.OnReplyClick = function()
    {
      console.log("On Reply Click");
      $rootScope.setAppState($state.current);
      $rootScope.AppUserInformation.OriginalMessage=$scope.messages;
      $rootScope.AppUserInformation.EditorType="Reply";
      $state.go('newsPostEditor', {}, {
            reload: true
        });
    }

   function OpenDocFile(path)
   {

    cordova.plugins.fileOpener2.open(
    path, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
    'application/pdf', 
    { 
        error : function(e) { 
            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
            $rootScope.ShowToast("Unable to Open File",false);
        },
        success : function () {
            console.log('file opened successfully');                
        }
    }
);

   }

    $scope.OnFileClick= function(selItem)
     {

      
       
   function downLoadFile()
        {

       //console.log("File Clicked", fileexist);
       Promise.all([blobDownloadFactory.getdata(selItem.extra,$rootScope.rootDocPath)]).then(function(){

       console.log($rootScope.rootDocPath + selItem.extra);
       OpenDocFile($rootScope.rootDocPath + selItem.extra);

       })
       .catch(function(err)
       {
           $rootScope.ShowToast("Unable to get Document",false);
           console.log("Error getting or Storing doc");

       });

     }//end of downloadFile


      function fileError(msg)
      {

          console.log(msg);
          $rootScope.ShowToast("Failed to Open File",false);
      }

      Promise.all([$cordovaFile.checkFile($rootScope.rootDocPath,selItem.extra)]).then(function(result) {OpenDocFile($rootScope.rootDocPath + selItem.extra);}).catch(function(message){downLoadFile(message);});

         
     }
})



.controller('LogOutCtrl', function($scope, $window, $state) {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
    console.log("Log out");
    $state.go('login', {}, {
        reload: true
    });
})


.controller('PlatformCtrl', function($scope, $rootScope, $state, $http) {
    console.log("plaform controller");
    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();
    $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
    console.log($rootScope.devWidth);
    $rootScope.menuWidth = 0.90 * $rootScope.devWidth;
    console.log($rootScope.menuWidth);
    if (window.localStorage.getItem("setting") != undefined) //default settings;;
    {
        $rootScope.Language = window.localStorage.getItem("language")
    } else {
        $rootScope.Language = 1;
    }
})


.controller('TimeLineCtrl', function($scope, timelinefactory, $rootScope, $state) {
    //window.localStorage.removeItem("TimeLine");
    console.log("state test", $state.current);
    $scope.timeline = [];
    $scope.LoadTimeLine = function() {
        Promise.all([timelinefactory.getdata()]).then(function(ret) {
            $scope.timeline = ret[0];
            console.log("DataLoaded");
            console.log(ret);
            console.log($scope.timeline[0].Heading);
            console.log($scope.timeline[0].DateTime);    
        })//getdata promise;;
        .catch(function(err) {
            //force login next time;;
            //window.localStorage.removeItem("username"); //uncomment these lines later;;
            //window.localStorage.removeItem("password");
            console.log("Error getting timeline");
            return;
        });
    }

     


    $scope.LoadTimeLine();
    $scope.itemclick = function(docId,ProgId) {
        console.log("clicked");
        console.log(docId);
        $rootScope.MarkAsRead(docId);
        $rootScope.AppUserInformation.DocId = docId;
        $rootScope.DecNotificationCounts(ProgId);
        $rootScope.isFromTimeLine = true;
        $rootScope.setAppState($state.current);
        //handle different views for different items here;;
        $state.go('readView', {}, {
            reload: true
        });
    }
    $scope.$on('NewFeedEvent', function(event, data) {
        console.log("News Event Fired Right");
        //console.log(data[0]); //feed preview data;;
        $scope.LoadTimeLine();
        //$scope.timeline.unshift(data[0]);
        //console.log( $scope.timeline);
    });
    //docid, progid, posttime, fpreview, unread
    //var feedpreview = JSON.parse(data[3]);
})


.controller('SettingsCtrl', function($scope, $window, $rootScope) {
    $scope.choice = {
        langchoice: 1,
        
    };
    console.log("Language : ", $rootScope.Language);
    //window.localStorage.removeItem("setting");
    //window.localStorage.removeItem("language");
    //window.localStorage.removeItem("notichoice");
    //load setting from file here;;
    if (window.localStorage.getItem("setting") == undefined) //default settings;;
    {
        window.localStorage.setItem("setting", "1");
        window.localStorage.setItem("language", 1);
        
        console.log("Setting First Time");
    } else {
        $scope.choice.langchoice = window.localStorage.getItem("language");
        
        
    }
    $scope.notificationstatus = "";
    jQuery.getJSON('json/UiLanguage.json', function(data) {
        var lang = $rootScope.Language.toString();
        $scope.UiLanguageSettings = {
            Title: data.SettingsPage.Title[lang] == undefined ? data.SettingsPage.Title["1"] : data.SettingsPage.Title[lang],
            ChangePassword: data.SettingsPage.ChangePassword[lang] == undefined ? data.SettingsPage.ChangePassword["1"] : data.SettingsPage.ChangePassword[lang],
            OldPassword: data.SettingsPage.OldPassword[lang] == undefined ? data.SettingsPage.OldPassword["1"] : data.SettingsPage.OldPassword[lang],
            NewPassword: data.SettingsPage.NewPassword[lang] == undefined ? data.SettingsPage.NewPassword["1"] : data.SettingsPage.NewPassword[lang],
            RepeatPassword: data.SettingsPage.RepeatPassword[lang] == undefined ? data.SettingsPage.RepeatPassword["1"] : data.SettingsPage.RepeatPassword[lang],
            EnableNotification: data.SettingsPage.EnableNotification[lang] == undefined ? data.SettingsPage.EnableNotification["1"] : data.SettingsPage.EnableNotification[lang],
            NotificationOn: data.SettingsPage.NotificationOn[lang] == undefined ? data.SettingsPage.NotificationOn["1"] : data.SettingsPage.NotificationOn[lang],
            NotificationOff: data.SettingsPage.NotificationOff[lang] == undefined ? data.SettingsPage.NotificationOff["1"] : data.SettingsPage.NotificationOff[lang],
            Change: data.SettingsPage.Change[lang] == undefined ? data.SettingsPage.Change["1"] : data.SettingsPage.Change[lang],
            Language: data.SettingsPage.Language[lang] == undefined ? data.SettingsPage.Language["1"] : data.SettingsPage.Language[lang]
        }
        $scope.LanguageOptions = data.LanguageOptions;
        console.log($scope.LanguageOptions);
        //console.log("title", UiLanguageProfile.Title);
       
    });
    $scope.languageChange = function(item) {
        window.localStorage.setItem("language", $scope.choice.langchoice);
        console.log("Selected value, text:", item);
        $window.location.reload(true);
    }
   
});
