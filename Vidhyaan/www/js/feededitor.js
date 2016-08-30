angular.module('Editor.controllers', ['ngCordova'])


.controller('EditorCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet,$ionicModal,imageUpload) {

$scope.messages = [];
$scope.ServerMessage = [];
$scope.typedData= {};
$scope.typedData.data = "";

function AddMessageToServer(type, msg)
{
var obj = 
{
 "type" : type,
 "msg" : msg
};

$scope.ServerMessage.push(angular.extend({}, obj));

}


$scope.OnOkClick = function()
{
console.log("On Ok clicked");
console.log($scope.typedData.data);


 if($scope.typedData.data != ""){
  $scope.modal.hide();
  $scope.myInput = $scope.typedData.data;
  console.log("add text");
  console.log($scope.typedData.data);
  $scope.add();
  AddMessageToServer($scope.tag,$scope.typedData.data);

      }

}

$scope.OnCancelClick = function()
{
console.log("On Cancel clicked");
$scope.modal.hide();
}

function ShowTextBox()
{
$ionicModal.fromTemplateUrl('templates/feedinput.html', {
  scope: $scope,
  animation: 'slide-in-up',
  
}).then(function(modal) {
  console.log("Modal");
  $scope.modal = modal;
  $scope.modal.show();
});

}

function GetFileName()
{
var d = (new Date).getTime();
var newFileName = $rootScope.AppUserInformation.SubId+'_' + d.toString()+'.jpg';
console.log(newFileName);
return(newFileName);
}


//GetFileName();

 $scope.addText= function()
 {
 $scope.typedData.data = "";
  $scope.tag='p'
  $scope.tPlaceholder = " enter content"
  ShowTextBox();
 }
  
 $scope.addHeading = function() {
 	 $scope.typedData.data ="";
     $scope.tag='h1';
     $scope.tPlaceholder= " enter heading";
     ShowTextBox();
       }



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
     /* destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        $scope.messages.pop();
        return true;
      }*/
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$scope.addImage = function() {

 var options = {
 destinationType : navigator.camera.DestinationType.FILE_URI,
 sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
 allowEdit : false,
 encodingType: navigator.camera.EncodingType.JPEG,
 popoverOptions: CameraPopoverOptions,
 };

 navigator.camera.getPicture(onSuccess, onFail, options);
 function onFail(ErrMessage){
   console.log(ErrMessage)
 }

function onSuccess(ImageData){
//from here copy new file starts
console.log("On Success Image");
console.log(ImageData);
window.resolveLocalFileSystemURL(ImageData, copyfile, function(error){console.log("unable to resolve 1");});
function copyfile (fileEntry) {
var newName = GetFileName();
window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {

				fileEntry.copyTo(
					fileSystem2,
					newName,
					onCopySuccess,
					function fail(error){console.log("Failed to copy file");});

			},
			function(){ console.log("failed to resolve file")});
}


function onCopySuccess(entry)
      {
console.log("copy successful ",entry.nativeURL);
////promise


 Promise.all([imageUpload.getdata(entry)]).then(function(ret)
      {
      
      var nextMessage ={};
       nextMessage.content = "<img src = '" + entry.nativeURL + "' />"
       console.log(nextMessage.content);
       $scope.messages.push( angular.extend({}, nextMessage));

        })//getdata promise;;
       .catch(function(err)
       {

      console.log("Error getting feedlist");
      alert("unable to Upload Image");
      return;
       });


////end of promise

 }

}

}

///////////////////////////////////////////////////////

//////////////////////////////////////////////////////


 $scope.add = function() {
    var nextMessage ={};
    nextMessage.content = '<'+$scope.tag + '>' +$scope.myInput+'</'+$scope.tag+'>';
    if($scope.myInput!='')
    $scope.messages.push( angular.extend({}, nextMessage));
    $scope.myInput='';

  $ionicScrollDelegate.scrollBottom();
//$ionicDelegate.scrollBottom(true);
    console.log($scope.messages);
  };

})



.factory('imageUpload', function($http, $q) {
 var factory = {};


factory.getdata = function (fileEntry)
 {

 var defer = $q.defer();
 var sasUrl = "";

  var readCompleted = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
    console.log("read completed so im here");
        // The binary data is the result.
        var requestData = evt.target.result;

       var uriWithAccess = sasUrl;

    var xhr = new XMLHttpRequest();
        xhr.onerror = xhrfail;
        xhr.onloadend = uploadCompleted;
        xhr.open("PUT", uriWithAccess, true);
        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');

        //var progressBar = document.querySelector('progress');
        
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
        console.log("Event...");
      //progressBar.value = (e.loaded / e.total) * 100;
      //progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
   	  //console.log(progressBar.value);
      // $scope.$apply();
    }
  };

        xhr.send(requestData);


    }
    else
    {console.log("file reading failed"); defer.reject();}
     

function uploadCompleted(){
	defer.resolve();
}

function xhrfail(message){
  console.log("xhr fail");
  defer.reject();
}


 } //end of readCompleted;;

function readFail(message)
 {
console.log(message);
console.log("read failed");

 }




//get filename from file entry;;
var fileName = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
console.log("FileName", fileName);

 var fileToSend = {"fileName": fileName};
 var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/putblob/",
    data: jQuery.param(fileToSend),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
          $http(req).
        success(function(data, status, headers, config) { 
        console.log(data);
        sasUrl = data.sasUrl;
       
         console.log("Reading Image to Memory");
     if (device.platform == 'iOS') {
         // We need the file:/ prefix on an iOS device.
        // localFileSytemUrl = "file://" + localFileSytemUrl; 
        console.log("from ios");
         //console.log(localFileSytemUrl);
     }
  
        fileEntry.file(function (file) {
          console.log("can you see this message");
            // We need a FileReader to read the captured file.
            var reader = new FileReader();
            reader.onloadend = readCompleted;
            reader.onerror = readFail;
            // Read the captured file into a byte array.
            // This function is not currently supported on Windows Phone.
            reader.readAsArrayBuffer(file);
        }, function(Message){defer.reject();});


       }).
        error(function(data, status, headers, config) {
          console.log(data);
          defer.Reject();
        });


        
 
return defer.promise;

}   
 
 return factory;
  
});