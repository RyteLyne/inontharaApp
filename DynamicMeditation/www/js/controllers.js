angular.module('DynamicMeditation.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
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
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('RightMenuCtrl', function($scope, $stateParams) {
 console.log("inJquery start");
 jQuery.getJSON('json/rightPanel.json', function(data) {
  console.log("inJquery Right");
   var items = data;
   console.log(items);
       $scope.rightItems = [];

   for (var i=0; i<items.items.length; i++) 
   {
      $scope.rightItems[i] = {
      icon: items.items[i].mIcon,
      ref: items.items[i].mRef
    };
    
  }
  console.log( items.items[0].mIcon);
   
    })

});
