angular.module('Location.controllers', ['ngCordova'])

.controller('locateselctrl',function($scope,$rootScope,$cordovaGeolocation,datafactory,routefactory,$http)
{
  $scope.SelRoute = $rootScope.LocationTracking.SelRoute;
   $scope.choice = {
   triptype : $rootScope.LocationTracking.triptype
  }
  $scope.routes = [];

  var TransportInfo = $rootScope.LocationTracking.TransportInfo;
  var RouteDocument = $rootScope.LocationTracking.RouteDocument;


        var userId = $rootScope.AppUserInformation.SubId;
        var ordId = $rootScope.AppUserInformation.OrgId;
        $scope.buttontext = "Start";

        if($rootScope.LocationTracking.TripState == "ongoing")
         {
           $scope.buttontext = "Stop"

         }


        if(TransportInfo.DocumentHeader == undefined)
        {
  
   Promise.all([datafactory.getdata(userId,ordId, "TransportInfo")]).then(function(data) {
               
            console.log("Got Transport Info");
            console.log(data[0]);
            TransportInfo = data[0];
            
            //load the routes;;
            $scope.routes = TransportInfo.DocumentBody.ApplicationSpecificData.Routes;
             console.log($scope.routes);
            })//getdata promise;;
            .catch(function(err) {
                
            alert("Unable to Query Server");
            console.log("Unable to Query Server");
            return;
            });

        }
        else
        {

            $scope.routes = TransportInfo.DocumentBody.ApplicationSpecificData.Routes;
        }
 

  $scope.RouteTravellers  = [];
 
  $scope.mySelect = 0;

  
  function LoadRouteTravellers(routeNo)
  {
     

  if(TransportInfo.Document_Details.routeSubscribers[routeNo.toString()] != undefined)
    $scope.RouteTravellers = TransportInfo.Document_Details.routeSubscribers[routeNo.toString()];

    console.log("Loading Route Travellers");
    console.log($scope.RouteTravellers);
    for(var i=0;i<$scope.RouteTravellers.length;i++)
     {

         $scope.RouteTravellers[i].status = 0; //yet to drop or pickup
     }

  }

  if($rootScope.LocationTracking.SelRoute.routeNo!=undefined)
  {
    LoadRouteTravellers($rootScope.LocationTracking.SelRoute.routeNo);
      
  }
 

  function UpdateLocationToServer(routeId,tripId,lat,longi)
  {
      var doc2Send = 
      {
        routeId : routeId,
        tripId : tripId,
        lat : lati,
        longi : longi
      }

   var req = 
     {
    method: 'POST',
    url: "http://chungling.azurewebsites.net/UpdateLocationDocM/",
    data: jQuery.param(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }
console.log(req.data);
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          $rootScope.ShowToast("Location updated",false);
          //$ionicLoading.hide();
          //$rootScope.rootGoBack();
          //close the view here;;

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $rootScope.ShowToast("Unable to Contact Server(Location Update)",true);
          //$ionicLoading.hide();
        });

  }

  function UpdateSubscriberStatus(routeId,tripId,SubId,Status)
  {

        var doc2Send = 
      {
        routeId : routeId,
        tripId : tripId,
        SubId : SubId,
        Status : Status
      }

   var req = 
     {
    method: 'POST',
    url: "http://chungling.azurewebsites.net/UpdateLocationDocM/",
    data: jQuery.param(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }
console.log(req.data);
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          $rootScope.ShowToast("Location updated",false);
          //$ionicLoading.hide();
          //$rootScope.rootGoBack();
          //close the view here;;

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $rootScope.ShowToast("Unable to Contact Server(Location Update)",true);
          //$ionicLoading.hide();
        });

  }

 function UpdateRouteToServer(routeId,tripType,subscribers)
  {

    var d = new Date();
    var curr_time = d.getTime();
    var DocumentHeader = {
    DocumentType: "RouteInfo",
    DocSearchTag: "RouteInfo" + "-" + tripType + "-" + routeId + "-" +$rootScope.AppUserInformation.OrgId,
    Author: $rootScope.AppUserInformation.SubId,
    OrganizationId : $rootScope.AppUserInformation.OrgId,
    OrganizationName :  $rootScope.AppUserInformation.OrgName,
    Datetime : curr_time.toString(),
    DocumentId : "100001",
    version : "1.0",
    tags : "default"
  }

  var Id = curr_time.toString() + "-" + routeId + "-" +  $rootScope.AppUserInformation.SubId;

  var DocumentSubHeader = {
    RouteId: routeId,
    TripId : Id,
    TripType: tripType,
	LockedBy : $rootScope.AppUserInformation.SubId,
	TripStatus : "ongoing"
  }

  var Document_Details = { };
  var status = "";
  if(tripType == "pickup")
  status = "yettopickup";
  else
  status = "yettoboard";

  var routeSubscribers = [];

  for(var k=0;k<subscribers.length;k++)
  {
     var subscriber = {
     subId: subscribers[k].subId,
     status: status
      }

      routeSubscribers.push(subscriber);

  }

  Document_Details.routeSubscribers = routeSubscribers;
   
   var DocumentBody = {};
   DocumentBody.ApplicationSpecificData = {};
   DocumentBody.ApplicationSpecificData.RouteMap = [];

   var doc2send = {
   DocumentHeader : DocumentHeader,
   DocumentSubHeader : DocumentSubHeader,
   DocumentBody : DocumentBody,
   Document_Details : Document_Details,
   id : Id
   }

//send to server;;
console.log(doc2send);

  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/VidaddRouteDocM/",
    data: jQuery.param(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
        console.log(req.data);
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          console.log("route Locked");
          $rootScope.ShowToast("Route Locked",false);
          RouteDocument = doc2send;
          setVariablesToRoot();
          Testing1();
          //$ionicLoading.hide();
          //$rootScope.rootGoBack();
          //close the view here;;

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $rootScope.ShowToast("Unable to Contact Server",true);
          //$ionicLoading.hide();
        });

  } //end of function;;


//var watch = {};

$scope.showSelectValue = function(SelRoute) {
    console.log("select : ", SelRoute.routeNo);
    LoadRouteTravellers(SelRoute.routeNo);
    //$scope.RouteTravellers = RouteTravellers;
    $scope.SelRoute = SelRoute;

}

//console.log("Sel Route : ", $scope.SelRoute);

var data = 
  {
    room : $scope.SelRoute.routeNo,
    username : $rootScope.AppUserInformation.SubId,
    lat : 0,
    longi : 0
  }

var socket1 = {};



$scope.UpdateLocations = function()
{

//periodically update latitude and longitude to server;;
 var options = {timeout: 10000, enableHighAccuracy: false};
 console.log("About to Start");

  $rootScope.LocationTracking.watch = $cordovaGeolocation.watchPosition(options);
  $rootScope.LocationTracking.watch.then(null,function(error){
    console.log("Could not get location");},  function(position){
 
 var lat = position.coords.latitude
 var long =  position.coords.longitude;
 var minFrequency = 10*1000;
 var lastUpdateTime = new Date($rootScope.LocationTracking.GpslastUpdateTime);
 
 var now = new Date();
 var timediff = now.getTime() - lastUpdateTime.getTime();

 console.log("currenttime: ", now.getTime());
 console.log("lasttime: ", lastUpdateTime.getTime());
 console.log("timediff: " ,timediff);



  if( timediff < minFrequency){
        console.log("Ignoring position update");
        return;
    }

    $rootScope.LocationTracking.GpslastUpdateTime = now;


   var position = "Watchin You.." + "lat: " + lat + "long: " + long;
   console.log(position);
 
 //update to server;;
//$rootScope.ShowToast(position,false);
//$rootScope.$broadcast('GPSLocationEvent', [lat,long]);
data.lat = lat;
data.longi = long;
socket1.emit('GpsProvider', data);

 });



}

function Testing1()
{
  

socket1 = io.connect("http://locationtracking.azurewebsites.net");
console.log("Testing123");

socket1.on('connect', function () {

socket1.emit('JoinGroup', data);
console.log("Joined Group123");
$scope.UpdateLocations();

});


}

function setVariablesToRoot()
{
$rootScope.LocationTracking.RouteDocument = RouteDocument;
$rootScope.LocationTracking.TransportInfo = TransportInfo;
$rootScope.LocationTracking.SelRoute = $scope.SelRoute;
$rootScope.LocationTracking.triptype = $scope.choice.triptype;
$rootScope.LocationTracking.TripState = "ongoing";
$scope.buttontext = "Stop";
}

function clearVariablesInRoot()
{
$rootScope.LocationTracking.RouteDocument = {};
$rootScope.LocationTracking.TransportInfo = {};
$rootScope.LocationTracking.SelRoute = {};
$rootScope.LocationTracking.triptype = 1;
$rootScope.LocationTracking.TripState = "stopped";
$scope.buttontext = "Start";
}


$scope.StartTrip = function()
{
console.log("Trip Started");

if($scope.SelRoute.routeNo == "" )
{
 console.log("Route Not Selected", $scope.SelRoute.routeNo);
$rootScope.ShowToast("Please Select Route",false);
return;
}

//get route document from server;;
var tripType = "";

if($scope.choice.triptype == 1)
tripType = "pickup";
else
tripType = "drop";


//RouteDocument;;


var DocSearchTag =  "RouteInfo" + "-" + tripType + "-" + $scope.SelRoute.routeNo + "-" +$rootScope.AppUserInformation.OrgId;


   //function(subid, orgid, docsearchtag,tripStatus)
   Promise.all([routefactory.getdata(userId,ordId, DocSearchTag,"ongoing")]).then(function(data) {
               
            console.log("Got Route Info");
            //console.log(data[0]);
            if(data[0] == undefined)
            {
              //create new document and upload to server
              console.log("Should create new document");
              UpdateRouteToServer($scope.SelRoute.routeNo,tripType,$scope.RouteTravellers);

            }
            else if(data[0].DocumentSubHeader.LockedBy != $rootScope.AppUserInformation.SubId)
            {
              console.log("Locked by some other User: ", data[0].DocumentSubHeader.LockedBy, $rootScope.AppUserInformation.SubId);
              $rootScope.ShowToast("Route Already in Use by : ",data[0].DocumentSubHeader.LockedBy);
              return;
            }
            else
            {
              RouteDocument = data[0];
              $rootScope.LocationTracking.RouteDocument = RouteDocument;
            //load the routes;;
             //$scope.routes = TransportInfo.DocumentBody.ApplicationSpecificData.Routes;
             setVariablesToRoot();
             console.log(RouteDocument);
             Testing1();
            }



            })//getdata promise;;
            .catch(function(err) {
            console.log(err);
            alert("Unable to Query Server");
            console.log("Unable to Query Server");
            return;
            });


}

function EndTripNow()
{
  console.log("Trying to Stop Trip");
  console.log($rootScope.LocationTracking.watch);

 if($rootScope.LocationTracking.watch.watchID !=undefined)
 {
 console.log($rootScope.LocationTracking.watch);
 $rootScope.LocationTracking.watch.clearWatch($rootScope.LocationTracking.watch.watchID);
 console.log("Watch Cleared");
 $rootScope.LocationTracking.watch = null;
 clearVariablesInRoot();
 //$scope.buttontext = "Start";
 $rootScope.ShowToast("Trip Stopped",false);
 console.log("Trip Stopped");
 }

}





function UpdateRootDocument(CallbackFunc)
{

   var doc2Send = $rootScope.LocationTracking.RouteDocument;
   console.log("Root Doc: ", doc2Send);
      
   var req = 
     {
    method: 'POST',
    //url: "http://chungling.azurewebsites.net/VidReplaceDocM/",
    url: "http://localhost:3000/VidReplaceDocM/",
    
    data: jQuery.param(doc2Send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }
console.log(req.data);
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          CallbackFunc();
          
          //$ionicLoading.hide();
          //$rootScope.rootGoBack();
          //close the view here;;

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $rootScope.ShowToast("Unable to Contact Server(Stop Trip)",true);
          //$ionicLoading.hide();
        });


}

$scope.EndTrip = function()
{
console.log("End Started"); 
//set the status to stopped;;
$rootScope.LocationTracking.RouteDocument.DocumentSubHeader.TripStatus = "stopped";
UpdateRootDocument(EndTripNow);

}



$scope.Trip= function()
{
if($scope.buttontext == "Start")
$scope.StartTrip();
else
$scope.EndTrip();
}
 
})

.controller('mapviewctrl', function($scope, $state, $rootScope, $cordovaGeolocation) 
{
    console.log("in mapviewctrl");

    $scope.map = {};

    var latLng1 = {};

    var marker = {};

  //var options = {timeout: 10000, enableHighAccuracy: true};
 
  //$cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
     latLng1 = new google.maps.LatLng(12.932250, 77.516091);
 
    
        //Wait until the map is loaded
//
 
 // }, function(error){
   // console.log("Could not get location");
  //});


function LoadMap()
{

   var mapOptions = {
      center: latLng1,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var latLng = latLng1;
      marker = new google.maps.Marker({
      map: $scope.map,
      //animation: google.maps.Animation.DROP,;
      position: latLng,
      icon: 'img/bus.png'
  });   
 
    
     });

}

LoadMap();


function Testing()
{
  var data = 
  {
    room : "route1-advid",
    username : "simpleuser"
  }

var socket = io.connect("http://locationtracking.azurewebsites.net");
console.log("Testing");

socket.on('connect', function () {

socket.emit('JoinGroup', data);
console.log("Joined Group");

});


socket.on('location', function(data) {
      console.log(data);
      $rootScope.$broadcast('GPSLocationEvent', [data.lat,data.longi]);
});

}

Testing();

$scope.OnTripEditClick = function()
{

   console.log("click");
     $rootScope.setAppState($state.current);
     $state.go('LocateSel', {}, {
            reload: true
        });

}

 $scope.$on('GPSLocationEvent', function(event, data) {
        console.log("GPSLocationEvent received");
        $rootScope.ShowToast("Event",false);
        console.log("lat:" , data[0],"long : ", data[1]);
        var latLng = new google.maps.LatLng(data[0], data[1]);

if($scope.map !=undefined) {
    marker.setPosition( new google.maps.LatLng( data[0], data[1]) );
    $scope.map.panTo( new google.maps.LatLng( data[0], data[1]) );

}


    });


})
