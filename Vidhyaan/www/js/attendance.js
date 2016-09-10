angular.module('Attendance.controllers', ['ngCordova'])


.controller('CardsCtrl', function($scope, TDCardDelegate, $timeout,$ionicModal,$rootScope) {
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

   var cardTypes = [];
    jQuery.getJSON('json/attendtest.json', function(data) {

    var tp = data.DocumentBody.ApplicationSpecificData.subcribers;
       
      for(var i = 0;i<tp.length;i++)
      {
        if(tp[i].role=="student")
        {
        var item = 
        {
         "subId": tp[i].subId,
	     "name": tp[i].name,
		 "avatar": tp[i].avatar,
		 "role": tp[i].role,
		 "present" : false
        }

        cardTypes.push(angular.extend({},item));
      }
      }
  

        $scope.cards = {
        master:[],
        active: Array.prototype.slice.call(cardTypes, 0),
        //discards: [],
        //liked: [],
        //disliked: []
    }

    $scope.total = cardTypes.length;
    $scope.remaining = $scope.total;
    $scope.present = 0;
    $scope.absent =0;

    })
   


    $scope.cardDestroyed = function(index) {
        $scope.cards.active.splice(index, 1);
    };

   /* $scope.addCard = function() {
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
    }); */

  $scope.OnConfirmChange= function(item)
    {
        console.log("On Confirm Change");
        if(item.present===true){
          
          item.present=false;
        
        
       }else
       {
         item.present=true;
        

       }

    }


     $scope.cancelConfirm = function()
     {
       $scope.modal.hide();
       $rootScope.rootGoBack();
       console.log("Cancel Confirm");

     }

     $scope.okConfirm = function()
     {
       $rootScope.ShowToast("Attendance Saved",false);
       $scope.modal.hide();
       console.log("OK Confirm");
       $rootScope.rootGoBack();

     }


  $scope.cardsDone = function()
    {
     console.log("cards Done");
    console.log($scope.cards.master);

  $ionicModal.fromTemplateUrl('templates/AttendanceConfirm.html', {
  scope: $scope,
  animation: 'slide-in-up',
  
}).then(function(modal) {
  console.log("Modal");
  $scope.modal = modal;
  $scope.modal.show();
});





    }


    $scope.cardSwipedLeft = function(card) {
        console.log('LEFT SWIPE');
         
        //$scope.cards.master[index].present = false;
        card.present = false;
        $scope.cards.master.push(card);
        $scope.remaining = $scope.remaining-1;
        $scope.absent =$scope.absent + 1;


    }
    ;
    $scope.cardSwipedRight = function(card) {
        console.log('RIGHT SWIPE');
       
        card.present = true;
        $scope.cards.master.push(card);
         $scope.remaining = $scope.remaining-1;
         $scope.present = $scope.present + 1;
        //$scope.cards.liked.push(card);
    };
})



.controller('AttendanceCtrl', function($scope, $rootScope,$state) {

console.log("In AttendanceCtrl");

$scope.OnComposeClick = function()
{
$rootScope.setAppState($state.current);
$state.go('AttendanceWrite', {}, {
            reload: true
        });

}

});

