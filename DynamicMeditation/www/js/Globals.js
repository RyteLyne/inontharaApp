angular.module('Global.controllers', [])

.controller('GlobalCtrl1', function($rootScope,$http) {

    //window.localStorage.removeItem("subscriberInfo");


//get basic document from server;;
var GetDocFromServer = function(subid,orgid,docname)
{
 
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
//console.log(req.data);
      //  var defer = $q.defer();
      //  $ionicLoading.show({
   //   template: 'Loading...'
    //});



        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          console.log("server success");
          window.localStorage.setItem(docname,JSON.stringify(data.Data));

          //  defer.resolve(data);
 //$ionicLoading.hide();
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          //  defer.reject();
          console.log("Error getting from server");

        });
return;
} 

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




  
 $rootScope.PrepareDocs = function(subid,orgid,docname)
 {

 if(!(docname == "SubscriberInfo" || docname == "ProgramInfo" || docname == "ChannelInfo"))
  return;
 //temp line;;
  //window.localStorage.removeItem(docname);

     var doc = {};
  if (window.localStorage.getItem(docname) == undefined) //doesnot exist in localstorage
  {
    
     GetDocFromServer(subid,orgid,docname);
  }
   else
   {
     console.log("found in localstorage");

   }
 }

$rootScope.LoadNotificationCounts = function()
{
 var roottag = "NotificationCount" ;
 var noti = {};

 if(window.localStorage.getItem(roottag) == undefined)
 {
  $rootScope.NotificationCounts = {};
  return;
 }
 noti =window.localStorage.getItem(roottag); // get notification object;;

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




$rootScope.PrepareDocs("1234-npsbsk","npsbsk","SubscriberInfo");
$rootScope.PrepareDocs("1234-npsbsk","npsbsk","ProgramInfo");
$rootScope.PrepareDocs("1234-npsbsk","npsbsk","ChannelInfo");
$rootScope.LoadNotificationCounts();


})