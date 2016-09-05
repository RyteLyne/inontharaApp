angular.module('Global.controllers', ['ngCordova']).controller('GlobalCtrl1', function($rootScope, $http, $cordovaSQLite,$cordovaToast) {
    //window.localStorage.removeItem("subscriberInfo");
    $rootScope.mobileServiceClient = new WindowsAzure.MobileServiceClient('https://edum.azure-mobile.net','yVQPRKXxocEazjPjDXGSnmIpyCBTYc97');
    console.log($rootScope.mobileServiceClient);
    $rootScope.getBlob = function() {
        console.log("substitued pic", this.src);
        console.log("failed pic", this.srcErr);
    }
    if (window.cordova) {
    $rootScope.rootFeedImagePath = cordova.file.dataDirectory;
    $rootScope.rootAvatarPath = cordova.file.dataDirectory;
    $rootScope.rootDocPath = cordova.file.externalDataDirectory;
    }

    $rootScope.feedNotificationBadge="true";
    $rootScope.appNotificationBadge="true";
    
    $rootScope.AppUserInformation = {
        SelChannel: "0",
        SelProgram: "0",

   
        SelProgName: "TimeLine",

        WritePriv: false,
        XPriv: false,
        runson: [],
        SubId: "",
        OrgId: "",
        OrgName: "",
        UserName: "",
        firstName:"",
        lastName:"",
        UserTag: "",
        Class: "",
        UserAvatar: "",
        DocId: "",
        firstLogIn: false,
        ProgramType : "",
        //used to traverse from timeline;;
        PrivLevels: {},
        EditorControls : {
        isGalleryEnabled : true,
        isVideoEnabled : true,
        isCameraEnabled : true,
        isTextEnabled : true,
        isHeadingEnabled : true,
        isFileEnabled : true
        }
    }
    $rootScope.BuildTag = function(channel, progid, orgid) {
        tag = channel + "_" + progid + "_" + orgid;
        return ( tag) ;
    }
    $rootScope.AvailableChannels = [];
    $rootScope.NotificationCounts = {};
    //$rootScope.ServerStatus=0;
    //$rootScope.pushNotification;


$rootScope.ShowToast = function(message,longx)
{
    if(longx == true)
    {
 $cordovaToast.showLongCenter(message).then(function(success) {
    // success
    console.log("Toast Success");
  }, function (error) {
    // error
    console.log("Toast Failed");
  });   
    }

else
{
$cordovaToast.showShortCenter(message).then(function(success) {
    // success
    console.log("Toast Success");
  }, function (error) {
    // error
    console.log("Toast Failed");
  });   

}

}

$rootScope.LoadEditorControls = function(mType)
{

$rootScope.AppUserInformation.EditorControls.isGalleryEnabled = true;
$rootScope.AppUserInformation.EditorControls.isVideoEnabled = true;
$rootScope.AppUserInformation.EditorControls.isCameraEnabled = true;
$rootScope.AppUserInformation.EditorControls.isTextEnabled = true;
$rootScope.AppUserInformation.EditorControls.isHeadingEnabled = true;
$rootScope.AppUserInformation.EditorControls.isFileEnabled = true;

if(mType == "Notes")
{
  $rootScope.AppUserInformation.EditorControls.isVideoEnabled = false;
}
else
{
$rootScope.AppUserInformation.EditorControls.isFileEnabled = false;
}

}



 
 $rootScope.StoreDocument = function(docname,obj)
 { //migrate to sqlite later;;

window.localStorage.setItem(docname, JSON.stringify(obj));

 }

 /*$rootScope.GetChannelNames = function(channelIds)
 {
   var Channels = $rootScope.GetDocument("ChannelInfo");
   var ChannelNames = [];
   for(var i = 0; i< channelIds.length;i++)
   {


   }
 }*/
 
    $rootScope.GetProgramChannels = function(runson, subscribedchannels) {
        var userchannels = [];
        for (var i = 0; i < subscribedchannels.length; i++) {
            if (runson.indexOf(subscribedchannels[i]) > -1) {
                if (userchannels.indexOf(subscribedchannels[i]) < 0)
                    //tag doesnot exist;;
                    userchannels.push(subscribedchannels[i]);
            }
        }
        return ( userchannels) ;
    }
    $rootScope.AddToTag = function(runson, subscribedchannels, progid, orgid) {
        console.log("Add to Tag");
        //console.log(runson);
        //console.log(subscribedchannels);
        //console.log(subscribedchannels.length);
        //console.log(runson.length);
        for (var i = 0; i < subscribedchannels.length; i++) {
            if (runson.indexOf(subscribedchannels[i]) > -1) {
                //tag = subscribedchannels[i] + "_" + progid + "_" + orgid;
                tag = $rootScope.BuildTag(subscribedchannels[i], progid, orgid);
                console.log(tag);
                if ($rootScope.AvailableChannels.indexOf(tag) < 0)
                    //tag doesnot exist;;
                    $rootScope.AvailableChannels.push(tag);
            }
        }
    }
    $rootScope.GetAllTags = function() {
        var priv = {};
        var sub = $rootScope.GetDocument("SubscriberInfo");
        priv = sub.DocumentBody.ApplicationSpecificData.previlageLevels;
        var subscribedchannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;
        var pro = $rootScope.GetDocument("ProgramInfo");
        var orid = sub.DocumentHeader.OrganizationId;
        var groups = pro.DocumentBody.ApplicationsSpecificData.feedPrograms;
        console.log(groups);
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].mId != undefined)
                if (priv[groups[i].mId] == undefined)
                    continue;if (groups[i].mId != undefined)
                $rootScope.AddToTag(groups[i].mRunsOn, subscribedchannels, groups[i].mId, orid);
            if (groups[i].mItems !== undefined) //sub items present;;
            {
                for (var j = 0; j < groups[i].mItems.length; j++) {
                    if (priv[groups[i].mItems[j].mId] == undefined)
                        continue;$rootScope.AddToTag(groups[i].mItems[j].mRunsOn, subscribedchannels, groups[i].mItems[j].mId, orid);
                }
            }
            //load commonly used information onto AppUserInformation;;
            var lang = $rootScope.Language.toString();
            $rootScope.AppUserInformation.PrivLevels = priv;
            $rootScope.AppUserInformation.SubId = sub.DocumentBody.ApplicationSpecificData.SubscriberID;
            $rootScope.AppUserInformation.OrgId = sub.DocumentHeader.OrganizationId;
            $rootScope.AppUserInformation.OrgName = sub.DocumentHeader.OrganizationName;
            $rootScope.AppUserInformation.Class = sub.DocumentBody.Document_Details.profile.Division;
            $rootScope.AppUserInformation.UserAvatar = sub.DocumentBody.Document_Details.profile.Avatar;
            var titled = sub.DocumentBody.Document_Details.profile.Titled;
            $rootScope.AppUserInformation.UserTag = titled[lang] == undefined ? titled["1"] : titled[lang];
            var fname = sub.DocumentBody.Document_Details.profile.FirstName;
            var lname = sub.DocumentBody.Document_Details.profile.LastName;
            var fname1 = fname[lang] == undefined ? fname["1"] : fname[lang];
            var lname1 = lname[lang] == undefined ? lname["1"] : lname[lang];
            $rootScope.AppUserInformation.firstName = fname1;
            $rootScope.AppUserInformation.lastName = lname1;
            $rootScope.AppUserInformation.UserName = fname1 + " " + lname1;
            console.log("App Information");
            console.log($rootScope.AppUserInformation);
            //end of AppUserInformation
        }
        //end of main for loop;;
        var items = pro.DocumentBody.ApplicationsSpecificData.appPrograms;
        for (var k = 0; k < items.length; k++) {
            if (priv[items[k].mId] == undefined)
                continue;
                $rootScope.AddToTag(items[k].mRunsOn, subscribedchannels, items[k].mId, orid);
        }
        //console.log("final 1 Tags");
        //console.log($rootScope.AvailableChannels);
    }
    //get basic document from server;;
    $rootScope.Testing = function(subid, orgid, docname) {
        var ret = GetDocFromServer(subid, orgid, docname);
        if (ret.result == true) {
            console.log("success from server");
            console.log(ret.data);
        } else
            console.log("failed to get from server");
    }
    /*
 $rootScope.PrepareDocs = function(subid,orgid,docname)
 {

 if(!(docname == "SubscriberInfo" || docname == "ProgramInfo" || docname == "ChannelInfo"))
  return;
 //temp line;;
  window.localStorage.removeItem(docname);

     var doc = {};
  if (window.localStorage.getItem(docname) == undefined) //doesnot exist in localstorage
  {
    
     datafactory.getdata(subid,orgid,docname)
  }
   else
   {
     console.log("found in localstorage");

   }
 }*/
    /*
$rootScope.LoadNotificationCounts = function()
{
 var roottag = "NotificationCount" ;
 var noti = {};

 //window.localStorage.removeItem(roottag);

 if(window.localStorage.getItem(roottag) == undefined)
 {
   console.log("notitag not found");
   //$rootScope.NotificationCounts["Nc_2-npsbsk"] = 1;
   //$rootScope.NotificationCounts["Nc_52-npsbsk"] = 1;
  return;
 }
 noti =JSON.parse(window.localStorage.getItem(roottag)); // get notification object;;

 console.log(noti);

 console.log("notitag found");
 $rootScope.NotificationCounts = noti;

 return;
}
*/
    $rootScope.IncNotificationCounts = function(ProgramId) {
        //var roottag = "NotificationCount" ;
        var tag = "Nc_" + ProgramId;
        var noti = {};
        console.log("Inc Noti");
        console.log(ProgramId);
        if ($rootScope.NotificationCounts[tag] == undefined)
            $rootScope.NotificationCounts[tag] = 1;
        else if ($rootScope.NotificationCounts[tag] <= 0)
            $rootScope.NotificationCounts[tag] = 1;
        else
            $rootScope.NotificationCounts[tag] = $rootScope.NotificationCounts[tag] + 1;
        console.log($rootScope.NotificationCounts[tag]);
        console.log(tag);
        console.log("Done");
        $rootScope.$broadcast('NotificationEvent', [ProgramId, $rootScope.NotificationCounts[tag],true]);
        return;
    }
    $rootScope.DecNotificationCounts = function(ProgramId) {
        var roottag = "NotificationCount";
        var tag = "Nc_" + ProgramId;
        var noti = {};
        if ($rootScope.NotificationCounts[tag] == undefined)
            $rootScope.NotificationCounts[tag] = 0;
        else if ($rootScope.NotificationCounts[tag] <= 0)
            $rootScope.NotificationCounts[tag] = 0;
        else
            $rootScope.NotificationCounts[tag] = $rootScope.NotificationCounts[tag] - 1;
        $rootScope.$broadcast('NotificationEvent', [ProgramId, $rootScope.NotificationCounts[tag],false]);
        return;
    }
    $rootScope.MarkAsRead = function(docid) {
        var unread = "0";
        $cordovaSQLite.execute($rootScope.myDB, 'UPDATE feedmsgs set unread = ? where docid = ?', [unread, docid]).then(function(results) {
            console.log(results);
            console.log("update unread success");
        }, function(error) {
            console.log("failed to update unread");
        })
    }
    $rootScope.LoadNotificationCounts = function() {
        var unread = "1";
        var ret = [];
        $cordovaSQLite.execute($rootScope.myDB, 'SELECT progid, count(unread) AS cnt from feedmsgs  where unread = ? GROUP BY progid', [unread]).then(function(results) {
            console.log(results);
            console.log("read noti success");
            for (var i = 0; i < results.rows.length; i++) {
                var tag = "Nc_" + results.rows.item(i).progid;
                $rootScope.NotificationCounts[tag] = results.rows.item(i).cnt;
                console.log(tag);
                console.log($rootScope.NotificationCounts[tag]);
                ret[i] = results.rows.item(i).progid;
            }
            console.log("Calculated Noti Counts");
            $rootScope.$broadcast('NotificationsReady', [ret]);
            //console.log(ret);
        }, function(error) {
            console.log("read noti failed");
        })
    }


    $rootScope.GetDocument = function(docname) {
        var ret = {};
        if (!(docname == "SubscriberInfo" || docname == "ProgramInfo" || docname == "ChannelInfo"))
            return ( ret) ;
        if (window.localStorage.getItem(docname) != undefined) {
            ret = JSON.parse(window.localStorage.getItem(docname));
        }
        return ( ret) ;
    }


    $rootScope.GetChannelTag = function(channelId, ProgramId) {
        return ( channelId + "-" + ProgramId) ;
    }
    $rootScope.GetUserChannelTags = function() {}
    $rootScope.GetUserChannels = function() {}
    $rootScope.InitPush = function() {
        // will execute when device is ready, or immediately if the device is already ready.
        console.log("platfromctrl2 ionic.platform.ready function");
        //gcmapp will deprecated from here 
        // gcmapp.Initialize();
        $rootScope.SelChannel = 0;
        pushNotification = PushNotification.init({
            "android": {
                "senderID": "805533023268"
            },
            "ios": {
                "alert": "true",
                "badge": "false",
                "sound": "true"
            },
            "browser": {
                "pushServiceURL": 'https://push.ionic.io/api/v1/push'
            },
            'windows': {}
        });
        console.log(pushNotification);
        pushNotification.on('notification', function(data) {
            // Display the alert message in an alert.
            console.log(data);
            $rootScope.ShowToast(data.message,false);
            console.log(data.additionalData.docID);
            var doc2req = {};
            doc2req.docID = data.additionalData.docID;
            var req = {
                method: 'POST',
                url: "http://chungling.azurewebsites.net/VidGetPostM/",
                data: jQuery.param(doc2req),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.log(req.data);
            //  var defer = $q.defer();
            //  $ionicLoading.show({
            //   template: 'Loading...'
            //});
            $http(req).success(function(data, status, headers, config) {
                // alter data if needed
                console.log(data.fetchedNews);
                $rootScope.SaveNewsFeed(data.fetchedNews);
                //gau
            }).error(function(data, status, headers, config) {
                console.log(data);
                //  defer.reject();
            });
            //
            // pull the data from here
            // Reload the items list.
            // app.Storage.getData();
        });
        /* pushNotification.on('registration', function (data) {
      mobileServiceClient = new WindowsAzure.MobileServiceClient(
                   'https://edumobi1.azure-mobile.net',
                   'ZDdASZhSitsYsklwZYlRqIDdxjdWAp17');
console.log("registering push notification");*/
        pushNotification.on('registration', function(data) {
            console.log("registering push notification");
            console.log($rootScope.mobileServiceClient);
            //https://edum.azure-mobile.net/
            // Get the native platform of the device.
            var platform = device.platform;
            // Get the handle returned during registration.
            var handle = data.registrationId;
            console.log("push registration id is", data.registrationId);
            // Set the device-specific message template.
            if (platform == 'android' || platform == 'Android') {
                // Template registration.
                var template = "{ \"data\" : {\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\",\"docID\":\"$(docID)\",\"additionalData\":\"$(additionalData)\"}}"
                //  var template = '{ "data" : {"message":"$(message)"}}';
                // Register for notifications.
                $rootScope.mobileServiceClient.push.gcm.registerTemplate(handle, 'myTemplate', template, $rootScope.AvailableChannels).done(registrationSuccess, registrationFailure);
                console.log($rootScope.mobileServiceClient);
            } else if (device.platform === 'iOS') {
                // Template registration.
                //var template = '{"aps": {"alert": "$(message)"}}';
                var alertTemplate = "{\"aps\":{\"alert\":\"$(message)\",\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\",\"docID\":\"$(docID)\", \"additionalData\":\"$(additionalData)\"}}";
                // Register for notifications.      
                console.log(handle);
                //  mobileServiceClient.push.apns.registerTemplate(handle,
                //     'myTemplate', template, null)
                //  .done(registrationSuccess, registrationFailure);
                $rootScope.mobileServiceClient.push.apns.registerNative(data.registrationId, $rootScope.AvailableChannels).done(registrationSuccess, registrationFailure);
            }
        });
        var registrationSuccess = function() {
            $rootScope.ShowToast("Registered with Server!",false);
        }
        var registrationFailure = function(error) {
            $rootScope.ShowToast("Failed registering with Server", false);
            console.log('Failed registering with Server: ' + error);
        }
    }
    ;
    $rootScope.InitStorage = function() {
        if (window.cordova) {
            $rootScope.myDB = $cordovaSQLite.openDB({
                name: "Vidhyaan.db",
                location: 'default'
            })
        } else {
            $rootScope.myDB = window.openDatabase("Vidhyaan.db", '1', 'my', 1024 * 1024 * 100);
            // browser
        }
        $cordovaSQLite.execute($rootScope.myDB, 'CREATE TABLE IF NOT EXISTS feedmsgs (id integer primary key, docid text, progid text, posttime text, fpreview text, addtline integer, msg text, unread integer)', []).then(function(results) {
            console.log('Table Created');
        }, function(error) {
            console.log('Error occurred while create');
        })
    }
    $rootScope.SaveNewsFeed = function(msg) {
        //var myDB = $cordovaSQLite.openDB("Vidhyaan.db");
        //var myDB = window.sqlitePlugin.openDatabase({name: "Vidhyaan.db", location: 'default'});
        var docid = msg.DocumentHeader.DocumentId;
        var progid = msg.DocumentSubHeader.ProgramId;
        var posttime = msg.DocumentHeader.Datetime.toString();
        var fpreview = JSON.stringify(msg.DocumentBody.ApplicationSpecificeData.FeedPreview);
        var fpreview1 = msg.DocumentBody.ApplicationSpecificeData.FeedPreview;
        var addtline = "1";
        //should read from docname
        var unread = "1";
        //unread new message
        var msgtext = JSON.stringify(msg.DocumentBody.DocumentDetails);
        $cordovaSQLite.execute($rootScope.myDB, "INSERT INTO feedmsgs (docid, progid, posttime, fpreview, addtline, msg, unread) VALUES (?,?,?,?,?,?,?)", [docid, progid, posttime, fpreview, addtline, msgtext, unread]).then(function(results) {
            //fire newfeedarrived;;
            $rootScope.IncNotificationCounts(progid);
            $rootScope.$broadcast('NewFeedEvent', []);
            console.log('Inserted');
        }, function(error) {
            console.log('Error occurred while insert');
        })
    }
})



.factory('datafactory', function($http, $q) {
    var factory = {};
    factory.getdata = function(subid, orgid, docname) {
        var defer = $q.defer();
        if (!(docname == "SubscriberInfo" || docname == "ProgramInfo" || docname == "ChannelInfo"))
            return;
        //temp line;;
       // window.localStorage.removeItem(docname);
       /* if (window.localStorage.getItem(docname) != undefined) {
            console.log("found in local storage");
            defer.resolve("");
        }*/

        var details = {
            "SubId": subid,
            //subscriberId
            "DocName": docname,
            //document name
            "OrgId": orgid //organisation Id
        }
        doc2send = details;
        var req = {
            method: 'POST',
            url: "http://chungling.azurewebsites.net/VidgetDocM/",
            //url: "http://localhost:3000/VidgetDocM/",
            data: jQuery.param(doc2send),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http(req).success(function(data, status, headers, config) {
            // alter data if needed
            console.log(data);
            console.log("server success");
            window.localStorage.setItem(docname, JSON.stringify(data.Data));
            //$rootScope.StoreDocument(docname,data.Data);
            defer.resolve(data.Data);
        }).error(function(data, status, headers, config) {
            console.log(data);
            //  defer.reject();
            console.log("Error getting from server");
            defer.reject();
        });
        return defer.promise;
    }
    return factory;
})



.factory('feedlistfactory', function($q, $cordovaSQLite, $rootScope) {
    var factory = {};
    factory.getdata = function(progid) {
        var defer = $q.defer();
        //var myDB = window.sqlitePlugin.openDatabase({name: "Vidhyaan.db", location: 'default'});
        //var myDB = $cordovaSQLite.openDB({ name: "Vidhyaan.db", location: 'default' })
        var ret = [];
        addtline = 1;
        console.log("in feedlist factory");
        $cordovaSQLite.execute($rootScope.myDB, 'SELECT docid, progid, posttime, fpreview, unread FROM feedmsgs where progid = ? ORDER BY posttime DESC', [progid]).then(function(results) {
            console.log(results);
            console.log(results.rows.length);
            for (var i = 0; i < results.rows.length; i++) {
                var feedpreview = JSON.parse(results.rows.item(i).fpreview);
                var dt = new Date(parseInt(results.rows.item(i).posttime));
                ret[i] = {
                    MsgId: results.rows.item(i).docid,
                    ProgId: results.rows.item(i).progid,
                    Unread: results.rows.item(i).unread,
                    DateTime: dt.toString(),
                    Heading: feedpreview.Heading,
                    Author: feedpreview.AuthorName,
                    Avatar: feedpreview.AuthorAvatar,
                    TextPreview: feedpreview.ContentPreview,
                    Image: feedpreview.Thumbnail,
                    SubscribersID: feedpreview.SubscribersID
                };
                //ret.push(entry);
            }
            console.log("Got data for Feed List ");
            console.log(ret);
            defer.resolve(ret);
        }, function(error) {
            defer.reject("");
        })
        return defer.promise;
    }
    return factory;
}).factory('timelinefactory', function($q, $cordovaSQLite, $rootScope) {
    var factory = {};
    factory.getdata = function() {
        var defer = $q.defer();
        var ret = [];
        //var myDB = window.sqlitePlugin.openDatabase({name: "Vidhyaan.db", location: 'default'});
        //var myDB = $cordovaSQLite.openDB({ name: "Vidhyaan.db", location: 'default' })
        addtline = "1";
        //has to be string;;
        console.log("in Timeline factory");
        $cordovaSQLite.execute($rootScope.myDB, 'SELECT docid, progid, posttime, fpreview, unread FROM feedmsgs where addtline = ? ORDER BY posttime DESC LIMIT 25', [addtline]).then(function(results) {
            console.log(results);
            console.log(results.rows.length);
            for (var i = 0; i < results.rows.length; i++) {
                var feedpreview = JSON.parse(results.rows.item(i).fpreview);
                var dt = new Date(parseInt(results.rows.item(i).posttime));
                ret[i] = {
                    MsgId: results.rows.item(i).docid,
                    ProgId: results.rows.item(i).progid,
                    Unread: results.rows.item(i).unread,
                    DateTime: dt.toString(),
                    Heading: feedpreview.Heading,
                    Author: feedpreview.AuthorName,
                    Avatar: feedpreview.AuthorAvatar,
                    TextPreview: feedpreview.ContentPreview,
                    Image: feedpreview.Thumbnail,
                    SubscribersID: feedpreview.SubscribersID
                };
                //ret.push(entry);
            }
            console.log("Got data");
            console.log(ret);
            defer.resolve(ret);
        }, function(error) {
            defer.reject("");
        })
        return defer.promise;
    }
    return factory;
}).factory('feeddetailsfactory', function($q, $cordovaSQLite, $rootScope) {
    var factory = {};
    factory.getdata = function(docid) {
        var defer = $q.defer();
        //var myDB = window.sqlitePlugin.openDatabase({name: "Vidhyaan.db", location: 'default'});
        //var myDB = $cordovaSQLite.openDB({ name: "Vidhyaan.db", location: 'default' })
        var ret = [];
        addtline = 1;
        console.log("in feed details factory");
        $cordovaSQLite.execute($rootScope.myDB, 'SELECT msg,progid FROM feedmsgs where docid = ?', [docid]).then(function(results) {
            console.log(results);
            console.log(results.rows.length);
            if (results.rows.length > 0) //atleast one record
            {
                // console.log(results.rows.item(0).msg);
                var messages = JSON.parse(results.rows.item(0).msg);
                ret = messages.messages;
                console.log(ret);
            }
            console.log("Got data for feed details");
            console.log(ret);
            defer.resolve(ret);
        }, function(error) {
            defer.reject("");
        })
        return defer.promise;
    }
    return factory;
}).factory('loginfactory', function($http, $q) {
    var factory = {};
    factory.getdata = function(Subid, Pass) {
        var defer = $q.defer();
        var details = {
            "SubId": Subid,
            //subscriberId
            "Pass": Pass,
            //document name
        }
        doc2send = details;
        var req = {
            method: 'POST',
            url: "http://chungling.azurewebsites.net/VidLoginM/",
            //url: "http://localhost:3000/VidgetDocM/",
            data: jQuery.param(doc2send),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http(req).success(function(data, status, headers, config) {
            // alter data if needed
            console.log(data);
            console.log("server success login");
            defer.resolve(data);
        }).error(function(data, status, headers, config) {
            console.log(data);
            //  defer.reject();
            console.log("Error getting from server login");
            defer.reject();
        });
        return defer.promise;
    }
    return factory;
})



.factory('blobDownloadFactory', function($http, $q,$cordovaFile) {
    var factory = {};
   factory.getdata = function(blobName, localPath) {
 var defer = $q.defer();
var fileToRecieve = {"fileName": blobName};
var pathToStore = localPath;
 console.log("fileToRecieve" , fileToRecieve);
 console.log("pathToStore" , pathToStore);

 var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/getblob/",
    data: jQuery.param(fileToRecieve),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
          $http(req).
        success(function(data, status, headers, config) { 
          console.log("downoad data:", data);
             var uriWithAccess = data.sasUrl;
    var xhr = new XMLHttpRequest();
        xhr.onerror =  function(e) {
            console.log('some thing went wrong in image fallback xhr');
             defer.reject();
        }
  //      xhr.onloadend = uploadCompleted;
        xhr.open("GET", uriWithAccess, true);
        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');

      //  var progressBar = document.querySelector('progress');
       
  xhr.onprogress = function(e) {
    if (e.lengthComputable) {
        console.log((e.loaded / e.total) * 100);
    //  progressBar.value = (e.loaded / e.total) * 100;
  //    progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
   //console.log(progressBar.value);
  // $scope.$apply();
    }
  };

  xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  if (this.status == 200) {
$cordovaFile.writeFile(pathToStore, fileToRecieve.fileName, this.response, true)
            .then(function(success) {
              console.log("stored File");
              defer.resolve();
                //success
            }, function(error) {

               console.log("error storing file");
                defer.reject();

            });
    
  }
};

        xhr.send();

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          defer.reject();
         
        });

         return defer.promise;
    }//end of get data

    return factory;

}); //end of factory