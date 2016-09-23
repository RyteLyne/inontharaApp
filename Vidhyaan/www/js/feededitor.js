angular.module('Editor.controllers', ['ngCordova'])


.controller('EditorCtrl', function($scope, $http, $stateParams, $sce, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $rootScope, $cordovaCamera, $cordovaFile, $ionicActionSheet,$ionicModal,imageUpload,$cordovaDatePicker,$ionicPopup) {

//$scope.messages = [];
$scope.serverMessage = [];
$scope.TagsToSend = [];
$scope.typedData= {};
$scope.typedData.data = "";
//$scope.firstImage = "";

function FormatDate(date)
{

var currentDate = date;
var day = currentDate.getDate()
var month = currentDate.getMonth() + 1
var year = currentDate.getFullYear()
var dt =  day + "/" + month + "/" + year ;
   return(dt);
}



$scope.onDateSelectionOk = function()
{
console.log("OK Selected");

console.log($scope.dateRange.startDate);
console.log($scope.dateRange.endDate);

if($scope.dateRange.endDate < $scope.dateRange.startDate)
{
  console.log("Please select valid end date");
  $rootScope.ShowToast("Please select valid end date", false);
  return;
}

 $scope.modal.hide();

 var Message = $scope.dateRange.startDate + " To " + $scope.dateRange.endDate;
 AddMessageToServer("date",Message,"");

}

$scope.onDateSelectionCancel = function()
{
console.log("Cancel Selected");
 $scope.modal.hide();

}


$scope.calShow = function(type) {
  var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date(),
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    todayText:'Today',
    nowText :'Now',
    is24Hour :true,
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

$cordovaDatePicker.show(options).then(function(date){
      if(type == 0)
        $scope.dateRange.startDate = FormatDate(date);
      else
        $scope.dateRange.endDate = FormatDate(date);
      //  alert(date);
    });
 }

$scope.OnDateSelectionText = function(type)
{

  console.log("Clicked on Text Box");
  $scope.calShow(type);
}


$scope.AddDateRange = function()
{

if($rootScope.AppUserInformation.EditorType == "compose" && $rootScope.AppUserInformation.ProgramType == "Leaves")
{
  $scope.dateRange = {
  startDate: "",
  endDate: ""
  }

  $ionicModal.fromTemplateUrl('templates/DateSelection.html', {
  scope: $scope,
  animation: 'slide-in-up',
  
}).then(function(modal) {
  console.log("Modal");
  $scope.modal = modal;
  $scope.modal.show();
});


}

}




function AddMessageToServer(type, msg,extra)
{
var obj = 
{
 "type" : type,
 "msg" : msg,
 "extra" : extra
};

$scope.serverMessage.push(angular.extend({}, obj));

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
  AddMessageToServer($scope.tag,$scope.typedData.data,"");
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

function GetFileName(ext)
{
var d = (new Date).getTime();
var newFileName = $rootScope.AppUserInformation.SubId+'_' + d.toString()+ "." +ext;
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



$scope.OnFileClick = function(selItem)
{

  console.log ("trying to open");
  
  var fileToOpen = $rootScope.rootDocPath + selItem.extra;
  cordova.plugins.fileOpener2.open(
    fileToOpen, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
    'application/pdf', 
    { 
        error : function(e) { 
            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
        },
        success : function () {
            console.log('file opened successfully');                
        }
    }
);

}

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$scope.addfile = function() {

console.log("Add file");


function onCopyNormalSuccess(entry)
{
console.log("copy successful ",entry.nativeURL);


Promise.all([imageUpload.getdata(entry)]).then(function(ret)
      {
     
     var fName = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);
       $ionicLoading.show({
      template: 'Updating...'
       });

       AddMessageToServer("file","img/pdficon.jpg",fName);
       
       $ionicLoading.hide();
       $ionicScrollDelegate.scrollBottom();
      

        })//getdata promise;;
       .catch(function(err)
       {
      $ionicLoading.hide();
      console.log("Error uploading Image");
      $rootScope.ShowToast("unable to Upload Image",false);
      return;
       });


}



function OnNormalFileError(filepath)
{
console.log("Error:", filepath);
}


function StartCopyNormalfile(fileEntry)
{
  
//console.log(fileEntry);

var newName = GetFileName($scope.ext);
console.log("new name", newName);

window.resolveLocalFileSystemURL($rootScope.rootDocPath, function(fileSystem2) {

				fileEntry.copyTo(
					fileSystem2,
					newName,
					onCopyNormalSuccess,
					function fail(error){console.log("Failed to copy file");});

			},
			function(){ console.log("failed to resolve file")});

}


function OnChooseFileOk(uri)
{
window.FilePath.resolveNativePath(uri,function(actualpath){

 var fileName = actualpath.substr(actualpath.lastIndexOf('/') + 1);

  $scope.ext = fileName.substr(fileName.lastIndexOf('.') + 1);
  console.log("Found Ext:", $scope.ext);

  if($scope.ext != "pdf")
   {
    OnNormalFileError("Wrong Extension");
    return;
   }

window.resolveLocalFileSystemURL(uri, StartCopyNormalfile, OnNormalFileError);

},OnNormalFileError);

}



fileChooser.open(OnChooseFileOk,
            function (error) {
              //chooseFileError(deferred, 'fileChooser');
              console.log("Error");
            }
          );

}

$scope.addVideo = function() {

console.log("Add Video");

}



$scope.addImage = function(srctype) {

 
 var options = {
 destinationType : navigator.camera.DestinationType.FILE_URI,
 sourceType : srctype== 0?navigator.camera.PictureSourceType.PHOTOLIBRARY:navigator.camera.PictureSourceType.CAMERA , // Camera.PictureSourceType.PHOTOLIBRARY
 allowEdit : false,
 encodingType: navigator.camera.EncodingType.JPEG,
 popoverOptions: CameraPopoverOptions,
 

 }

 //console.log(options.sourceType);

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
var newName = GetFileName('jpg');
window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {

				fileEntry.copyTo(
					fileSystem2,
					newName,
					onCopySuccess,
					function fail(error){console.log("Failed to copy file");});

			},
			function(){ console.log("failed to resolve file")});
}


$scope.showPopup = function(fName, tag) {

  $scope.data = {};


  $ionicPopup.show({
    template: '<input type="text" ng-model = "data.model">',
    title: 'Enter Description',
    subTitle: 'Please Enter Image Description(optional)',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Done</b>',
        type: 'button-positive',
        onTap: function(e) {
          // add your action
          AddMessageToServer(tag,fName,$scope.data.model);
        }
      }
    ]
	});
    }


function onCopySuccess(entry)
      {
console.log("copy successful ",entry.nativeURL);
////promise


 Promise.all([imageUpload.getdata(entry)]).then(function(ret)
      {
      var fName = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);

      if($rootScope.AppUserInformation.ProgramType == "Gallery")
       {

        $scope.showPopup(fName,"img");

       }
   
   else {
       $ionicLoading.show({
      template: 'Updating...'
       });


       AddMessageToServer("img",fName,"");


       $ionicLoading.hide();
       $ionicScrollDelegate.scrollBottom(); 
       }

        })//getdata promise;;
       .catch(function(err)
       {

      console.log("Error uploading Image");
      $rootScope.ShowToast("unable to Upload Image",false);
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
  item.Id = $rootScope.AppUserInformation.runson[i];
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


function CheckContains(tag)
{
  for(var i=0;i< $scope.serverMessage.length; i++)
{
if($scope.serverMessage[i].type == tag)
 return(true);
}

 return(false);
}


$scope.postMessage =function()
  {
    

    if($scope.serverMessage.length <1) // not even one message;;
    {
     $rootScope.ShowToast("Cannot Send Empty Message", false);
    return;
    }

    if($rootScope.AppUserInformation.EditorType == "compose" && $rootScope.AppUserInformation.ProgramType == "Leaves")
    {
      var isDt =  CheckContains("date");
      var isTxt = CheckContains("p");

      if(isDt==false)
      {
        $rootScope.ShowToast("Please select Date", false);
        return;
      }

       if(isTxt==false)
      {
        $rootScope.ShowToast("Please Add text", false);
        return;
      }

    }

    console.log($scope.serverMessage);

   
    if($rootScope.AppUserInformation.EditorType == "Reply")
      {
       var ReplyTag = $rootScope.BuildUserTag($rootScope.AppUserInformation.MsgSentBy, $rootScope.AppUserInformation.OrgId);
       $scope.TagsToSend.push(ReplyTag);
       console.log("ReplyTag:",  $scope.TagsToSend);
        SendMessageToServer();
        return;
      }


    if($rootScope.AppUserInformation.runson.length > 1)
    ShowChannelSel();
    else
    {
       $scope.Channels = [];
       $scope.TagsToSend = [];
       
       var item = {}

      item.Title = $rootScope.AppUserInformation.runson[0]; //should be name;;
      item.Id = $rootScope.AppUserInformation.runson[0];
      item.ischecked = true;

      $scope.Channels.push( angular.extend({}, item));

     
      
     if($rootScope.AppUserInformation.ProgramType == "Leaves" || $rootScope.AppUserInformation.ProgramType == "Feedback")
     ret = $scope.BuildTagsApps($rootScope.AppUserInformation.ProgramType);
     else
     ret = $scope.BuildTagsFeeds();

    console.log( $scope.TagsToSend);

    if(ret==false)
    {
      $rootScope.ShowToast("No Channel to Send Message",false);
     return;

    }

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


  $scope.BuildTagsFeeds = function()
  {

  console.log("Tags Feed");
   for(var i=0;i<$scope.Channels.length;i++)
    {
     if($scope.Channels[i].ischecked == true)
     {
       console.log("Checked");

      var tag =$rootScope.BuildTag($scope.Channels[i].Id,
						$rootScope.AppUserInformation.SelProgram,
						$rootScope.AppUserInformation.OrgId);
       $scope.TagsToSend.push(tag);
     }

     console.log("FeedTagToSend",$scope.TagsToSend);

    }

    if( $scope.TagsToSend.length <=0)
    return(false);

    return(true);

  }

  $scope.BuildTagsApps= function(appType) //builds tags for apps like leaves and feedback;;
  {

    console.log("Tags Apps");
    var channelSummary = $rootScope.GetDocument("ChannelSummary");

    if(channelSummary == undefined)
     return(false);

    var appData = channelSummary.DocumentBody.ApplicationSpecificData;

   
    for(var i=0;i<$scope.Channels.length;i++)
    {
     if($scope.Channels[i].ischecked == true)
     {
       console.log("Checked");
       if(appData[$scope.Channels[i].Id]==undefined) //channel entry does not exist;;
         continue;

       var Channel = appData[$scope.Channels[i].Id];

       var Target = "";

       if(appType == "Leaves")
       Target = "LeaveIncharge";
       else if(appType == "Feedback")
       Target = "FeedBackIncharge";

       if(Channel[Target]== undefined)
        continue;

        var TargetIds = Channel[Target];

        console.log("TargetIds:", TargetIds);


        for(var k=0;k<TargetIds.length;k++){

      var tag =$rootScope.BuildUserTag(TargetIds[k],
						$rootScope.AppUserInformation.OrgId);
						console.log("TagsToSend2",tag);
       $scope.TagsToSend.push(tag);
        }

        console.log("TagsToSend1",$scope.TagsToSend);


       }
   
     }

     if( $scope.TagsToSend.Length <= 0)
      return(false); //not even one tag found;;


      return(true);

    }//end of BuildTagsApps
  


   $scope.OnOkChannelSel = function()
   {
    
    if($scope.Channels.length <=0)//atleast one channel selected;;
    {
      $rootScope.ShowToast("Select Atleast one Channel",false);
     return;
    }

    $scope.TagsToSend = [];
    var ret =false;

    if($rootScope.AppUserInformation.ProgramType == "Leaves" || $rootScope.AppUserInformation.ProgramType == "Feedback")
     ret = $scope.BuildTagsApps($rootScope.AppUserInformation.ProgramType);
     else
     ret = $scope.BuildTagsFeeds();

    console.log( "tagsToSend", $scope.TagsToSend);

    if(ret==false)
    {
      $rootScope.ShowToast("No Channel to Send Message",false);
     return;

    }
    
       $scope.modal.hide();
      
       SendMessageToServer();

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

var firstImage = "";
var heading = "New Message";
var txt = "New Message";

var imgFlag = false;
var h1Flag = false;
var pFlag = false;



for(var i=0;i< $scope.serverMessage.length; i++)
{
if($scope.serverMessage[i].type == "img" && imgFlag == false)
 {
 firstImage= $scope.serverMessage[i].msg;
 imgFlag = true;
 }

if($scope.serverMessage[i].type == "h1" && h1Flag == false)
 {
  if($scope.serverMessage[i].msg.length > 50)
 heading= $scope.serverMessage[i].msg.slice(0,50);
 else
  heading= $scope.serverMessage[i].msg;
 h1Flag = true;
 }

 if($scope.serverMessage[i].type == "p" && pFlag == false)
 {
    if($scope.serverMessage[i].msg.length > 50)
     txt= $scope.serverMessage[i].msg.slice(0,50);
     else
      txt= $scope.serverMessage[i].msg;
 pFlag = true;
 }

 if(imgFlag == true && h1Flag == true && pFlag == true)
 break;

}


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
tempDoc.DocumentBody.ApplicationSpecificeData.CanReply = false; //default cant reply;;


if($rootScope.AppUserInformation.ProgramType == "Leaves" || $rootScope.AppUserInformation.ProgramType == "Feedback")
tempDoc.DocumentBody.ApplicationSpecificeData.CanReply = true;

if($rootScope.AppUserInformation.EditorType == "Reply")
{
tempDoc.DocumentBody.ApplicationSpecificeData.CanReply = false; // to stop infinite reply loop;;

AddMessageToServer("p","\n\n***Original Message***\n\n","");

for(var k=0;k<$rootScope.AppUserInformation.OriginalMessage.length;k++)
{
  $scope.serverMessage.push(angular.extend({},$rootScope.AppUserInformation.OriginalMessage[k]));
}


}


tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview={};
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.Heading=heading;
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.Thumbnail= firstImage;
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.ContentPreview= txt;
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.AuthorAvatar=$rootScope.AppUserInformation.UserAvatar;
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.AuthorName=$rootScope.AppUserInformation.englishName;
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.SubscribersID =  $rootScope.AppUserInformation.SubId
tempDoc.DocumentBody.ApplicationSpecificeData.FeedPreview.Datetime = curr_time.toString();;
 
tempDoc.DocumentBody.DocumentDetails={};
//tempDoc.DocumentBody.DocumentDetails.messages=[];




tempDoc.DocumentBody.DocumentDetails.messages=JSON.parse(JSON.stringify($scope.serverMessage));
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
          $rootScope.ShowToast("Message Sent",false);
          $ionicLoading.hide();
          $rootScope.rootGoBack();
          //close the view here;;

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $rootScope.ShowToast("Message Sending Failed",true);
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
        console.log("upload data:",data);
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