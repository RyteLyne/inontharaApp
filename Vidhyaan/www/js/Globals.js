angular.module('Global.controllers', [])

.controller('GlobalCtrl1', function($rootScope,$http) {

    //window.localStorage.removeItem("subscriberInfo");

     $rootScope.mobileServiceClient = new WindowsAzure.MobileServiceClient(
                   'https://edum.azure-mobile.net',
                     'yVQPRKXxocEazjPjDXGSnmIpyCBTYc97');


               console.log($rootScope.mobileServiceClient);

$rootScope.AppUserInformation = 
{
 SelChannel : "0",
 SelProgram : "0",
 SelProgName: "",
 WritePriv:false,
 XPriv:false,
 runson:[],
 SubId : "",
 OrgId: "",
 OrgName : "",
 UserName : "",
 UserTag: "", 
 Class: "",
 UserAvatar: "",
 PrivLevels: {}
}


 $rootScope.BuildTag = function(channel,progid,orgid)
 {
     tag = channel + "_" + progid + "_" + orgid;
     return(tag);
 }

  $rootScope.AvailableChannels = [];
  $rootScope.NotificationCounts = {};
  //$rootScope.ServerStatus=0;
  //$rootScope.pushNotification;

  $rootScope.GetProgramChannels =function (runson,subscribedchannels)
  {
    var userchannels= [];

    for(var i=0;i<subscribedchannels.length;i++)
     {
       if(runson.indexOf(subscribedchannels[i])>-1)
       {

         if(userchannels.indexOf(subscribedchannels[i])<0) //tag doesnot exist;;
         userchannels.push(subscribedchannels[i]);

       }

     }
     return(userchannels);
  }

 $rootScope.AddToTag= function(runson,subscribedchannels,progid, orgid)
   {
     
     console.log("Add to Tag");
     //console.log(runson);
     //console.log(subscribedchannels);
	 //console.log(subscribedchannels.length);
	 //console.log(runson.length);
	
     
     for(var i=0;i<subscribedchannels.length;i++)
     {
       if(runson.indexOf(subscribedchannels[i])>-1)
       {
         //tag = subscribedchannels[i] + "_" + progid + "_" + orgid;
         tag= $rootScope.BuildTag(subscribedchannels[i],progid,orgid);
         console.log(tag);

         if($rootScope.AvailableChannels.indexOf(tag)<0) //tag doesnot exist;;
         $rootScope.AvailableChannels.push(tag);
       }

     }

   }


$rootScope.GetAllTags = function()
{


   var priv = {};
   var sub = $rootScope.GetDocument("SubscriberInfo");
   priv = sub.DocumentBody.ApplicationSpecificData.previlageLevels;



  var subscribedchannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;

  var pro = $rootScope.GetDocument("ProgramInfo");
  var orid = sub.DocumentHeader.OrganizationId;
 
  var groups = pro.DocumentBody.ApplicationsSpecificData.feedPrograms;
   console.log(groups);



   for (var i=0; i<groups.length; i++) {

if(groups[i].mId != undefined )
    if(priv[groups[i].mId]==undefined)
     continue;

if(groups[i].mId != undefined )
$rootScope.AddToTag(groups[i].mRunsOn,subscribedchannels,groups[i].mId,orid);
 


     if(groups[i].mItems !== undefined) //sub items present;;
     {
       

    for (var j=0; j<groups[i].mItems.length; j++) 
    {
   
    if(priv[groups[i].mItems[j].mId]==undefined)
     continue;
  
    

      $rootScope.AddToTag(groups[i].mItems[j].mRunsOn,subscribedchannels,groups[i].mItems[j].mId,orid);

    }

      
     }

    
    
  } //end of main for loop;;


   var items = pro.DocumentBody.ApplicationsSpecificData.appPrograms;

    for (var k=0; k<items.length; k++) 
   {
    
     if(priv[items[k].mId]==undefined)
     continue;
     
    $rootScope.AddToTag(items[k].mRunsOn,subscribedchannels,items[k].mId,orid);  
  }

  //console.log("final 1 Tags");
  //console.log($rootScope.AvailableChannels);


}





//get basic document from server;;


$rootScope.Testing = function(subid,orgid,docname)
{
  var ret = GetDocFromServer(subid,orgid,docname);
 if(ret.result == true)
 {
   console.log("success from server");
   console.log(ret.data);


 }
else
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

$rootScope.LoadNotificationCounts = function()
{
 var roottag = "NotificationCount" ;
 var noti = {};

 window.localStorage.removeItem(roottag);

 if(window.localStorage.getItem(roottag) == undefined)
 {
   console.log("notitag not found");
   $rootScope.NotificationCounts["Nc_2-npsbsk"] = 6;
   $rootScope.NotificationCounts["Nc_52-npsbsk"] = 2;
  return;
 }
 noti =window.localStorage.getItem(roottag); // get notification object;;

 console.log("notitag found");
 $rootScope.NotificationCounts = noti;

 return;
}


$rootScope.IncNotificationCounts=function(ProgramId)
{

var roottag = "NotificationCount" ;
var tag = "Nc_" + ProgramId;
var noti = {};


if($rootScope.NotificationCounts[tag] == undefined || $rootScope.NotificationCounts[tag]<=0)
$rootScope.NotificationCounts[tag] = 1;

else
$rootScope.NotificationCounts[tag] = $rootScope.NotificationCounts[tag] + 1;

window.localStorage.setItem(roottag,JSON.stringify($rootScope.NotificationCounts));
return;
}

$rootScope.DecNotificationCounts=function(ProgramId)
{

var roottag = "NotificationCount" ;
var tag = "Nc_" + ProgramId;
var noti = {};


if($rootScope.NotificationCounts[tag] == undefined || $rootScope.NotificationCounts[tag]<=0)
$rootScope.NotificationCounts[tag] = 0;

else
$rootScope.NotificationCounts[tag] = $rootScope.NotificationCounts[tag] - 1;

window.localStorage.setItem(roottag,JSON.stringify($rootScope.NotificationCounts));
return;  
}





$rootScope.GetDocument = function(docname)
{

var ret ={};
 if(!(docname == "SubscriberInfo" || docname == "ProgramInfo" || docname == "ChannelInfo"))
  return(ret);


  if(window.localStorage.getItem(docname) != undefined)
    {
     ret =JSON.parse(window.localStorage.getItem(docname));

    }

    return (ret);
}




$rootScope.GetChannelTag = function (channelId,ProgramId)
{

  return(channelId + "-" + ProgramId);
}


$rootScope.GetUserChannelTags = function()
{


}

$rootScope.GetUserChannels =function ()
{


}




 $rootScope.InitPush = function(){
    // will execute when device is ready, or immediately if the device is already ready.
   console.log("platfromctrl2 ionic.platform.ready function");
   //gcmapp will deprecated from here 
 // gcmapp.Initialize();

  $rootScope.SelChannel = 0;

    pushNotification = PushNotification.init({
    "android": { "senderID": "805533023268" },
    "ios": { "alert": "true", "badge": "false", "sound": "true" }
       });



pushNotification.on('notification', function (data) {
    // Display the alert message in an alert.
   console.log(data);
    alert(data.message);
    console.log(data.additionalData.docID);
var doc2req = {};

doc2req.docID = data.additionalData.docID;

/*  Object.toparams = function ObjecttoParams(obj) 
{
  var p = [];
  for (var key in obj) 
  {
    p.push(key + '=' + encodeURIComponent(obj[key]));
  }
  return p.join('&');
};*/
  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/VidGetPostM/",
    data: jQuery.param(doc2req),
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

     
/*var  messages  = JSON.parse(data.fetchedNews.messages);
console.log(messages);
//ading the data to storage
$scope.test = localStorage.getItem('test') ?
              JSON.parse(localStorage.getItem('test')) : 
              $scope.test=[],$scope.testInfo=[];   
      $scope.test.push(angular.extend({}, messages));  */
 
 //creating list preview  
/*for(var i=0;i<messages.length;i++)
{
 if( messages[i].indexOf('<h1>')>-1)
 {
 $scope.testInfo[testinfo.length].heading= messages[i].replace('<h>','').replace('</h1>','');
 break;
 }
}*/

/*for(var i=0;i<messages.length;i++)
{
if(messages[i].indexOf('<img>')>-1)
{
 $scope.testinfo[testinfo.length].image=messages[i];
break;
}
}*/
/*for(var i=0;i<messages.length;i++)
{
 if(messages[i].indexof('<p>')>-1)
 {
 $scope.testinfo[testinfo.length].image=message[i];
 break
 }
}*/
//console.log($scope.test);
//console.log($scope.testinfo);
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

 /* pushNotification.on('registration', function (data) {
      mobileServiceClient = new WindowsAzure.MobileServiceClient(
                   'https://edumobi1.azure-mobile.net',
                   'ZDdASZhSitsYsklwZYlRqIDdxjdWAp17');
console.log("registering push notification");*/

pushNotification.on('registration', function (data) {
 
         
console.log("registering push notification");
console.log($rootScope.mobileServiceClient);
               //https://edum.azure-mobile.net/
    // Get the native platform of the device.
    var platform = device.platform;
    // Get the handle returned during registration.
    var handle = data.registrationId;
    // Set the device-specific message template.
    if (platform == 'android' || platform == 'Android') {
        // Template registration.
var template = "{ \"data\" : {\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\",\"docID\":\"$(docID)\",\"additionalData\":\"$(additionalData)\"}}"
      //  var template = '{ "data" : {"message":"$(message)"}}';
        // Register for notifications.

        $rootScope.mobileServiceClient.push.gcm.registerTemplate(handle,
            'myTemplate', template, $rootScope.AvailableChannels)
            .done(registrationSuccess, registrationFailure);
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

  
var registrationSuccess = function () {
    alert('Registered with Azure!');
}

var registrationFailure = function (error) {
    alert('Failed registering with Azure: ' + error);
}

  };









})



.factory('datafactory', function($http, $q) {
 var factory = {};



factory.getdata = function (subid,orgid,docname)
 {

   var defer = $q.defer();

   if(!(docname == "SubscriberInfo" || docname == "ProgramInfo" || docname == "ChannelInfo"))
  return;

  //temp line;;
  window.localStorage.removeItem(docname);

  if (window.localStorage.getItem(docname) != undefined)
  {
    console.log("found in local storage");
    defer.resolve("");
  }

  var details = {

  "SubId" : subid,  //subscriberId
  "DocName"  : docname, //document name
  "OrgId" : orgid //organisation Id
}

doc2send = details;

  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/VidgetDocM/",
    //url: "http://localhost:3000/VidgetDocM/",
    data: jQuery.param(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}


 $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          console.log("server success");
          window.localStorage.setItem(docname,JSON.stringify(data.Data));
          defer.resolve(data.Data);

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          //  defer.reject();
          console.log("Error getting from server");
          defer.reject();

        });
return defer.promise;
}   
 
 return factory;
  
})


.factory('loginfactory', function($http, $q) {
 var factory = {};

factory.getdata = function (Subid,Pass)
 {

 var defer = $q.defer();

  var details = {

  "SubId" : Subid,  //subscriberId
  "Pass"  : Pass, //document name
}

doc2send = details;

  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/VidLoginM/",
    //url: "http://localhost:3000/VidgetDocM/",
    data: jQuery.param(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}


 $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          console.log("server success login");
          defer.resolve(data.Data);

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          //  defer.reject();
          console.log("Error getting from server login");
          defer.reject();

        });
return defer.promise;
}   
 
 return factory;
  
});

