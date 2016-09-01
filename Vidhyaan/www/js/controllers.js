angular.module('Vidhyaan.controllers', [])/*
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
}).controller('CardCtrl', function($scope, TDCardDelegate) {
    console.log("in CardCtrl");
}).controller('CardsCtrl', function($scope, TDCardDelegate, $timeout) {
    console.log("in AttendanceCtrl");
    var cardTypes = [{
        image: 'http://c4.staticflickr.com/4/3924/18886530069_840bc7d2a5_n.jpg'
    }, {
        image: 'http://c1.staticflickr.com/1/421/19046467146_548ed09e19_n.jpg'
    }, {
        image: 'http://c1.staticflickr.com/1/278/18452005203_a3bd2d7938_n.jpg'
    }, {
        image: 'http://c1.staticflickr.com/1/297/19072713565_be3113bc67_n.jpg'
    }, {
        image: 'http://c1.staticflickr.com/1/536/19072713515_5961d52357_n.jpg'
    }, {
        image: 'http://c4.staticflickr.com/4/3937/19072713775_156a560e09_n.jpg'
    }, {
        image: 'http://c1.staticflickr.com/1/267/19067097362_14d8ed9389_n.jpg'
    }];
    $scope.cards = {
        master: Array.prototype.slice.call(cardTypes, 0),
        active: Array.prototype.slice.call(cardTypes, 0),
        discards: [],
        liked: [],
        disliked: []
    }
    $scope.cardDestroyed = function(index) {
        $scope.cards.active.splice(index, 1);
    }
    ;
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
        var card = $scope.cards.active[index];
        $scope.cards.disliked.push(card);
    }
    ;
    $scope.cardSwipedRight = function(index) {
        console.log('RIGHT SWIPE');
        var card = $scope.cards.active[index];
        $scope.cards.liked.push(card);
    }
    ;
}).controller('TimetableCtrl', function($scope) {
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
}).controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
}).controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
}).controller('RightMenuCtrl', function($scope, $stateParams, $rootScope) {
    console.log("inJquery start");
    var priv = {};
    $scope.menulist = {};
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
    var k = 0;
    var SubChannels = Sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;
    //load commonly used information onto AppUserInformation;;
    $rootScope.AppUserInformation.PrivLevels = priv;
    $rootScope.AppUserInformation.SubId = Sub.DocumentBody.ApplicationSpecificData.SubscriberID;
    $rootScope.AppUserInformation.OrgId = Sub.DocumentHeader.OrganizationId;
    $rootScope.AppUserInformation.OrgName = Sub.DocumentHeader.OrganizationName;
    $rootScope.AppUserInformation.Class = Sub.DocumentBody.Document_Details.profile.Division;
    $rootScope.AppUserInformation.UserAvatar = Sub.DocumentBody.Document_Details.profile.Avatar;
    var titled = Sub.DocumentBody.Document_Details.profile.Titled;
    $rootScope.AppUserInformation.UserTag = titled[lang] == undefined ? titled["1"] : titled[lang];
    var fname = Sub.DocumentBody.Document_Details.profile.FirstName;
    var lname = Sub.DocumentBody.Document_Details.profile.LastName;
    var fname1 = fname[lang] == undefined ? fname["1"] : fname[lang];
    var lname1 = lname[lang] == undefined ? lname["1"] : lname[lang];
    $rootScope.AppUserInformation.UserName = fname1 + " " + lname1;
    console.log("App Information");
    console.log($rootScope.AppUserInformation);
    //end of AppUserInformation
    for (var i = 0; i < items.length; i++) {
        if (priv[items[i].mId] == undefined)
            continue;//console.log(items[i].mId);
        $scope.rightItems[k] = {
            icon: items[i].mIcon,
            ref: items[i].mRef,
            text: items[i].mText[lang] == undefined ? items[i].mText["1"] : items[i].mText[lang],
            id: items[i].mId,
            runson: items[i].mRunsOn,
            cnt: $rootScope.NotificationCounts["Nc_" + items[i].mId] == undefined ? "" : $rootScope.NotificationCounts["Nc_" + items[i].mId]
        };
        $scope.menulist[items[i].mId] = $scope.rightItems[k];
        k++;
    }
    $scope.itemclick = function(id, runson, name) {
        console.log(id);
        $rootScope.AppUserInformation.SelProgram = id;
        $rootScope.AppUserInformation.SelProgName = name;
        console.log("clicked Id : ", $rootScope.AppUserInformation.SelProgram);
        $rootScope.AppUserInformation.runson = $rootScope.GetProgramChannels(runson, SubChannels);
        console.log("runs on", $rootScope.AppUserInformation.runson);
        console.log($rootScope.AppUserInformation.SelProgName);
        //$rootScope.IncNotificationCounts("2-npsbsk");
        //$rootScope.MarkAsRead("2-npsbsk");
    }
    $scope.$on('NotificationEvent', function(event, data) {
        console.log("Notification Event Fired Right");
        console.log(data[0]);
        //programId;;
        console.log(data[1]);
        //notification count;;
        if ($scope.menulist[data[0]] != undefined)
            $scope.menulist[data[0]].cnt = data[1];
    });
    $scope.$on('NotificationsReady', function(event, data) {
        console.log("Notification Ready Fired Right");
        console.log(data[0]);
        var tg = data[0];
        for (var i = 0; i < tg.length; i++) {
            var tag = "Nc_" + tg[i];
            if ($scope.menulist[tg[i]] != undefined)
                $scope.menulist[tg[i]].cnt = $rootScope.NotificationCounts[tag];
            console.log($rootScope.NotificationCounts[tg[i]]);
        }
    });
}).controller('popOverCtrl', function($scope, $rootScope) {
    console.log("inJquery start");
    jQuery.getJSON('json/popOverMenu.json', function(data) {
        console.log("inJquery PopOver");
        var items = data;
        console.log(items);
        $scope.popItems = [];
        var lang = $rootScope.Language.toString();
        for (var i = 0; i < items.items.length; i++) {
            $scope.popItems[i] = {
                icon: items.items[i].mIcon,
                ref: items.items[i].mRef,
                text: items.items[i].mText[lang] == undefined ? items.items[i].mText["0"] : items.items[i].mText[lang]
            };
        }
        console.log(items.items[0].mIcon);
    })
})//load json profile;;
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
        mName: obj.FirstName[language] == undefined ? obj.FirstName["0"] : obj.FirstName[language],
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
    jQuery.getJSON('json/uiLanguage.json', function(data) {
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
.controller('SideMenuCtrl', function($scope, $rootScope, $timeout, $stateParams, $ionicSideMenuDelegate) {
    /*!
   * Expects number from 0.0 -> 1.0
   * Returns absolute value
   * 
   * @param {Number}
   * @return {Number}
   */
    //var groups={};
    var groupcnt = 0;
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
    console.log("groups:", groups);
    $scope.menulist = {};
    var k = 0;
    var language = $rootScope.Language.toString();
    var SubChannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;
    console.log("new Language ", language);
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].mId != undefined)
            if (priv[groups[i].mId] == undefined)
                continue;$scope.groups[k] = {
            name: groups[i].mName[language] == undefined ? groups[i].mName["0"] : groups[i].mName[language],
            icon: groups[i].mIcon,
            ref: groups[i].mRef,
            id: groups[i].mId,
            runson: groups[i].mRunsOn,
            cnt: $rootScope.NotificationCounts["Nc_" + groups[i].mId] == undefined ? "" : $rootScope.NotificationCounts["Nc_" + groups[i].mId],
            items: []
        };
        if (groups[i].mId != undefined) {
            $scope.menulist[groups[i].mId] = $scope.groups[k];
        }
        if (groups[i].mItems !== undefined) //sub items present;;
        {
            groupcnt = 0;
            l = 0;
            for (var j = 0; j < groups[i].mItems.length; j++) {
                if (priv[groups[i].mItems[j].mId] == undefined)
                    continue;// $scope.groups[i].items.push(groups.groups[i].mItems[j]);
                $scope.groups[k].items[l] = {
                    name: groups[i].mItems[j].mName[language] == undefined ? groups[i].mItems[j].mName["0"] : groups[i].mItems[j].mName[language],
                    icon: groups[i].mItems[j].mIcon,
                    ref: groups[i].mItems[j].mRef,
                    id: groups[i].mItems[j].mId,
                    runson: groups[i].mItems[j].mRunsOn,
                    cnt: $rootScope.NotificationCounts["Nc_" + groups[i].mItems[j].mId] == undefined ? "" : $rootScope.NotificationCounts["Nc_" + groups[i].mItems[j].mId],
                };
                $scope.menulist[groups[i].mItems[j].mId] = $scope.groups[k].items[l];
                if ($scope.groups[k].items[l].cnt > 0)
                    groupcnt = groupcnt + $scope.groups[i].items[j].cnt;
                l++;
            }
            $scope.groups[k].cnt = groupcnt;
            if (l <= 0)
                k--;
            //remove parent element;;
        }
        k++;
    }
    //end of main for loop;;
    $scope.$on('NotificationEvent', function(event, data) {
        console.log("Notification Event Fired");
        console.log(data[0]);
        console.log(data[1]);
        //$scope.$digest();
        //$scope.groups[0].cnt =10;
        if ($scope.menulist[data[0]] != undefined)
            $scope.menulist[data[0]].cnt = data[1];
    });
    $scope.$on('NotificationsReady', function(event, data) {
        console.log("Notification Ready Fired");
        console.log(data[0]);
        var tg = data[0];
        for (var i = 0; i < tg.length; i++) {
            var tag = "Nc_" + tg[i];
            if ($scope.menulist[tg[i]] != undefined)
                $scope.menulist[tg[i]].cnt = $rootScope.NotificationCounts[tag];
            console.log($rootScope.NotificationCounts[tg[i]]);
        }
    });
    $scope.toggleGroup = function(group) {
        //console.log("toggle toggle");
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null ;
        } else {
            $scope.shownGroup = group;
        }
    }
    ;
    $scope.isGroupShown = function(group) {
        //console.log("shown shown");
        return $scope.shownGroup === group;
    }
    ;
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
        return ( 1 - Math.abs(ratio)) ;
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
    $scope.itemclick = function(id, runson, name) {
        $rootScope.AppUserInformation.SelProgram = id;
        $rootScope.AppUserInformation.SelProgName = name;
        console.log("clicked Id : ", $rootScope.AppUserInformation.SelProgram);
        $rootScope.AppUserInformation.runson = $rootScope.GetProgramChannels(runson, SubChannels);
        console.log("runs on", $rootScope.AppUserInformation.runson);
        console.log($rootScope.AppUserInformation.SelProgName);
        $rootScope.$broadcast('FeedProgramEvent', []);
    }
}).controller('slideCtrl', function($scope, $state, $ionicHistory) {
    console.log("in SlideCtrl");
    jQuery.getJSON('json/settings.json', function(data) {
        $scope.slides = data.slideImages;
    });
}).controller('SplashCtrl', function($scope, $rootScope, $state) {
    $scope.Credentials = {
        username: "",
        password: ""
    }
    if (window.localStorage.getItem("username") != undefined && window.localStorage.getItem("password") != undefined) //default settings;;
    {
        $scope.Credentials.username = window.localStorage.getItem("username");
        $scope.Credentials.password = window.localStorage.getItem("password");
        $rootScope.InitStorage();
        $rootScope.LoadNotificationCounts();
        $rootScope.GetAllTags();
        if (window.cordova) {
            $rootScope.InitPush();
        }
        //login to server here, if success redirect to home page;;
        $state.go('app.home', {}, {
            reload: true
        });
    } else
        $state.go('login', {}, {
            reload: true
        });
}).controller('AppCtrl', function($scope, $ionicPopover) {}).controller('LogInCtrl', function($scope, $rootScope, $state, $ionicScrollDelegate, datafactory, loginfactory) {
    $scope.Credentials = {
        username: "",
        password: ""
    }
    //var dt = new Date("1471935995019");
    //console.log("Hellotesting");
    //console.log(dt);
    /*$rootScope.LoadNotificationCounts();

  $rootScope.IncNotificationCounts("hello");
  $rootScope.IncNotificationCounts("hello1");
  $rootScope.IncNotificationCounts("hello2");

   $rootScope.IncNotificationCounts("hello");
  $rootScope.IncNotificationCounts("hello1");
  $rootScope.IncNotificationCounts("hello2");*/
    jQuery.getJSON('json/settings.json', function(data) {
        $scope.loginImages = data.loginScreen;
    });
    $scope.Credentials.username = "1234-npsbsk";
    $scope.Credentials.password = "1234";
    $scope.login = function Login() {
        $scope.scrollSmallToTop();
        console.log("UserName: ", $scope.Credentials.username, "Password: ", $scope.Credentials.password);
        Promise.all([loginfactory.getdata($scope.Credentials.username, $scope.Credentials.password)]).then(function(data) {
            console.log(data);
            if (data == "false") {
                console.log("Unable to Login");
                alert("Unable to Login");
                return;
            }
            // console.log("Mob Service client");
            //console.log($rootScope.mobileServiceClient);
            console.log("new log in");
            window.localStorage.setItem("username", $scope.Credentials.username);
            window.localStorage.setItem("password", $scope.Credentials.password);
            console.log("Getting From Server");
            Promise.all([datafactory.getdata("1234-npsbsk", "npsbsk", "SubscriberInfo"), datafactory.getdata("1234-npsbsk", "npsbsk", "ProgramInfo"), datafactory.getdata("1234-npsbsk", "npsbsk", "ChannelInfo")]).then(function() {
                $rootScope.InitStorage();
                $rootScope.LoadNotificationCounts();
                $rootScope.GetAllTags();
                console.log($rootScope.AvailableChannels);
                console.log("before push registration");
                $rootScope.InitPush();
                $state.go('app.home', {}, {
                    reload: true
                });
                console.log("promise promise");
            })//getdata promise;;
            .catch(function(err) {
                //force login next time;;
                //window.localStorage.removeItem("username"); //uncomment these lines later;;
                //window.localStorage.removeItem("password");
                alert("Please check Internet Connection1");
                return;
            });
        })//login promise;;
        .catch(function(err) {
            alert("Please check Internet Connection2");
            return;
        });
        //login to server here, if success redirect to home page;;
        //if($scope.Credentials.username == "1234" && $scope.Credentials.password == "1234")
        //{
    }
    //}
    $scope.scrollSmallToTop = function() {
        console.log("did i scroll");
        $ionicScrollDelegate.$getByHandle('simpleScrollAnime').scrollTop(true);
    }
    ;
}).controller('newsfeedctrl', function($scope, $window, $state, $rootScope, feedlistfactory) {
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
    $scope.itemclick = function(docId) {
        console.log("clicked");
        console.log(docId);
        $rootScope.MarkAsRead(docId);
        $rootScope.DecNotificationCounts($rootScope.AppUserInformation.SelProgram);
        $rootScope.AppUserInformation.DocId = docId;
        $state.go('app.readView', {}, {
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
}).controller('readPageCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet, feeddetailsfactory) {
    $scope.readFunc = function() {}
    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
    //$scope.readFunc();
    Promise.all([feeddetailsfactory.getdata($rootScope.AppUserInformation.DocId)]).then(function(ret) {
        $scope.messages = ret[0];
        //var msg = ret[0];
        /* for(var i=0;i<msg.length;i++)
     {
        var htm = {};
       if(msg[i].type == "h1") //heading
        htm.txt = "<h1>" + msg[i].msg + "</h1>";
       else if(msg[i].type == "p")
       {
        htm.txt = "<p>" + msg[i].msg + "</p>";
        console.log("P selected");
       }
        else if(msg[i].type == "img")
        htm.txt= "<img image = '" + msg[i].msg + "'/>" 
        else
        htm.txt = "<p> No Message </p>";

        console.log("htm", htm);

       $scope.messages.push(angular.extend({}, htm));

     }*/
        console.log("DataLoaded");
        console.log($scope.messages);
    })//getdata promise;;
    .catch(function(err) {
        //force login next time;;
        //window.localStorage.removeItem("username"); //uncomment these lines later;;
        //window.localStorage.removeItem("password");
        alert("Error getting message");
        return;
    });
    //$scope.messages = JSON.parse(localStorage.getItem('recievedMessage'));
    //console.log($scope.messages);
}).controller('LogOutCtrl', function($scope, $window, $state) {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
    console.log("Log out");
    $state.go('login', {}, {
        reload: true
    });
}).controller('PlatformCtrl', function($scope, $rootScope, $state, $http) {
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
})/*
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


})*/
.controller('TimeLineCtrl', function($scope, timelinefactory, $rootScope, $state) {
    //window.localStorage.removeItem("TimeLine");
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
            alert("Error getting timeline");
            return;
        });
    }
    $scope.LoadTimeLine();
    $scope.itemclick = function(docId) {
        console.log("clicked");
        console.log(docId);
        $rootScope.AppUserInformation.DocId = docId;
        $state.go('app.readView', {}, {
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
}).controller('IconsCtrl', function($scope) {
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
}).controller('SettingsCtrl', function($scope, $window, $rootScope) {
    $scope.choice = {
        langchoice: 1,
        notichoice: 0
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
        window.localStorage.setItem("notichoice", 0);
        console.log("Setting First Time");
    } else {
        $scope.choice.langchoice = window.localStorage.getItem("language");
        $scope.choice.notichoice = window.localStorage.getItem("notichoice");
        console.log("Noti choice", $scope.choice.notichoice);
    }
    $scope.notificationstatus = "";
    jQuery.getJSON('json/uiLanguage.json', function(data) {
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
        if ($scope.choice.notichoice == true)
            $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOn;
        else
            $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOff;
    });
    $scope.languageChange = function(item) {
        window.localStorage.setItem("language", $scope.choice.langchoice);
        console.log("Selected value, text:", item);
        $window.location.reload(true);
    }
    ;
    $scope.NotificationChange = function() {
        console.log("Notification Changed");
        console.log($scope.choice.notichoice);
        if ($scope.choice.notichoice == true) {
            $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOn;
            window.localStorage.setItem("notichoice", 1);
        } else {
            $scope.notificationstatus = $scope.UiLanguageSettings.NotificationOff;
            window.localStorage.setItem("notichoice", 0);
        }
    }
    ;
});
