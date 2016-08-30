angular.module('Editor.controllers', ['ngCordova'])


.controller('EditorCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet,$ionicModal,imageUpload) {

//$scope.messages = [];
$scope.ServerMessage = [];
$scope.typedData= {};
$scope.typedData.data = "";

console.log("data dir:",cordova.file.dataDirectory);

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
  //$scope.add();
  AddMessageToServer($scope.tag,$scope.typedData.data);
  $scope.myInput="";
  $ionicScrollDelegate.scrollBottom();
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
      var fName = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);
      //var nextMessage ={};
       //nextMessage.content = "<img src = '" + entry.nativeURL + "' />"
       //console.log(nextMessage.content);
       //$scope.messages.push( angular.extend({}, nextMessage));
       //$scope.tempfilename = $rootScope.FeedImagePath + fName;
       //console.log("temp file Name: ", $scope.tempfilename);
       $ionicLoading.show({
      template: 'Updating...'
       });

       AddMessageToServer("img",fName);
       
       $ionicLoading.hide();
       $ionicScrollDelegate.scrollBottom();

        })//getdata promise;;
       .catch(function(err)
       {

      console.log("Error uploading Image");
      alert("unable to Upload Image");
      return;
       });


////end of promise

 }

}

}

///////////////////////////////////////////////////////

//////////////////////////////////////////////////////


function ShowChannelSel()
{
  $scope.Channels = [];
  $scope.AllChannels={};
  $scope.AllChannels.checked = false;
  var item = {}

for(var i=0;i<$rootScope.AppUserInformation.runson.length;i++)
{

  item.Title = $rootScope.AppUserInformation.runson[i]; //should be name;;
  item.Id = $rootScope.AppUserInformation.runson[i]; //should be name;;
  item.ischecked = false;

   $scope.Channels.push( angular.extend({}, item));
}

$ionicModal.fromTemplateUrl('templates/ChannelSel.html', {
  scope: $scope,
  animation: 'slide-in-up',
  
}).then(function(modal) {
  console.log("Modal");
  $scope.modal = modal;
  $scope.modal.show();
});


}


  $scope.postMessage =function()
  {
    if($scope.ServerMessage.length <1) // not even one message;;
    return;

    console.log($scope.ServerMessage);
    if($rootScope.AppUserInformation.runson.length > 1)
    ShowChannelSel();
    else
    {
       $scope.TagsToSend = [];
       var tag =$rootScope.BuildTag($rootScope.AppUserInformation.runson[0],
						$rootScope.AppUserInformation.SelProgram,
						$rootScope.AppUserInformation.OrgId);
       $scope.TagsToSend.push( angular.extend({}, tag));
       SendMessageToServer();
      
    }

  }

  $scope.OnAllClick = function()
  {
    console.log("clicked");
    var state = false;

    if($scope.AllChannels.checked == true)
    state = true;


    for(var i=0;i<$scope.Channels.length;i++)
    {
     $scope.Channels[i].ischecked = state;
    }

  }


   $scope.OnOkChannelSel = function()
   {
    //console.log("Ok selected Channel Sel");
    //if($scope.AllChannels.checked == true)
    //console.log("All Channels Selected");
    //else
    //console.log("All not selected");

    $scope.TagsToSend = [];

    for(var i=0;i<$scope.Channels.length;i++)
    {
     if($scope.Channels[i].ischecked == true)
     {
       console.log("Checked");

      var tag =$rootScope.BuildTag($scope.Channels[i].Id,
						$rootScope.AppUserInformation.SelProgram,
						$rootScope.AppUserInformation.OrgId);
       $scope.TagsToSend.push( angular.extend({}, tag));
     }

    }

    console.log( $scope.TagsToSend);
    
    if($scope.TagsToSend.length >0)//atleast one channel selected;;
    {
       $scope.modal.hide();
      
      SendMessageToServer();

    }

   }

  $scope.OnCancelChannelSel = function()
   {
    console.log("Cancel selected Channel Sel");
     $scope.modal.hide();
   }



function SendMessageToServer()
{

   $ionicLoading.show({
      template: 'Sending...'
       });

var d = new Date();
var curr_time = d.getTime();
 console.log(curr_time);
var newID = curr_time.toString()+'.'+$rootScope.AppUserInformation.SubId + '.newsFeed';
var doc2send = {};
tempDoc={};
tempDoc.DocumentHeader ={};
tempDoc.DocumentHeader.DocumentType='NewsFeed';
tempDoc.DocumentHeader.Author= $rootScope.AppUserInformation.UserName;
tempDoc.DocumentHeader.AuthourID=$rootScope.AppUserInformation.SubId;
tempDoc.DocumentHeader.OrganizationId = $rootScope.AppUserInformation.OrgId;
tempDoc.DocumentHeader.Datetime=curr_time.toString(); 
tempDoc.DocumentHeader.DocumentId=newID;
tempDoc.DocumentHeader.NotificationTag= $scope.TagsToSend;


tempDoc.DocumentSubHeader={};
tempDoc.DocumentSubHeader.ChannelId=$rootScope.AppUserInformation.runson[0];
tempDoc.DocumentSubHeader.ProgramId=$rootScope.AppUserInformation.SelProgram;
tempDoc.DocumentSubHeader.ModeratorId='someModerator';
tempDoc.DocumentBody={};
tempDoc.DocumentBody.ApplicationSpecificeData={};
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview={};
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.Heading='ಕನ್ನಡದ ಕಂದಗಳಿರ ಕೇಳಿ 中文報章';
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.Thumbnail='test.png';
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.ContentPreview='中文報章';
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.AuthorAvatar='useridavatar.png';
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.AuthorName=$rootScope.AppUserInformation.UserName;
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.SubscribersID =  $rootScope.AppUserInformation.SubId
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.Datetime = curr_time.toString();;
 
tempDoc.DocumentBody.DocumentDetails={};
//tempDoc.DocumentBody.DocumentDetails.messages=[];
tempDoc.DocumentBody.DocumentDetails.messages=JSON.parse(JSON.stringify($scope.ServerMessage));
console.log(tempDoc);
doc2send= tempDoc;

  
  var req = 
{
    method: 'POST',
    url: "http://chungling.azurewebsites.net/addPostM/",
    data: jQuery.param(doc2send),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
console.log(req.data);
        $http(req).
        success(function(data, status, headers, config) {
            // alter data if needed
          console.log(data);
          alert("Message Sent");
          $ionicLoading.hide();
          //close the view here;;

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          alert("Message Sending Failed");
          $ionicLoading.hide();
        });

}


})




.factory('postmessagefactory', function($http, $q) {
 var factory = {};

factory.getdata = function (fileEntry)
 {


 }

})




.factory('imageUpload', function($http, $q,$ionicLoading) {
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
    {console.log("file reading failed"); defer.reject(); $ionicLoading.hide();}
     

function uploadCompleted(){
   $ionicLoading.hide();
	defer.resolve();
}

function xhrfail(message){
  console.log("xhr fail");
  $ionicLoading.hide();
  defer.reject();
}


 } //end of readCompleted;;

function readFail(message)
 {
console.log(message);
console.log("read failed");

 }


$ionicLoading.show({
      template: 'Uploading...'
       });

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
        }, function(Message){defer.reject(); $ionicLoading.hide();});


       }).
        error(function(data, status, headers, config) {
          console.log(data);
          $ionicLoading.hide();
          defer.reject();
        });


        
 
return defer.promise;

}   
 
 return factory;
  
});