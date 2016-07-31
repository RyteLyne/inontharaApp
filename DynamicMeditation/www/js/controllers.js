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
      ref: items.items[i].mRef,
      text: items.items[i].mText
    };
    
  }
  console.log( items.items[0].mIcon);
   
    })

})


//load json profile;;
.controller('ProfileLoad',function($scope) {
  
  console.log("in Profile Load 1");

  jQuery.getJSON('json/profile.json', function(data) {
  console.log("in Profile Load");

   //var basicprofile = data;
   console.log(data.mName);
   $scope.basicprofile =
   {
   mName: data.mName,
   mGender: data.mGender,
   mDob : data.mDOB,
   mBloodGroup: data.mBloodGroup,
   mClass: data.mClass,
   mDivision: data.mDivision,
   mClassTeacher: data.mClassTeacher
   }
   console.log($scope.basicprofile.mDob);
       
    }); //end of function($data);;



}) //end of function($scope);;


.controller('SideMenuCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate) {

  /*!
   * Expects number from 0.0 -> 1.0
   * Returns absolute value
   *
   * @param {Number}
   * @return {Number}
   */
    //var groups={};

    jQuery.getJSON('json/leftPanel.json', function(data) {
  console.log("inJquery");
 // console.log(data);
   var groups = data;
   console.log(groups);
       $scope.groups = [];
 
   console.log(groups.groups);
   for (var i=0; i<groups.groups.length; i++) {
    $scope.groups[i] = {
      name: groups.groups[i].mName,
      lname: groups.groups[i].mlName,
      ename: groups.groups[i].mName,
      icon: groups.groups[i].mIcon,
      ref: groups.groups[i].mRef,
      items: []
    };
     if(groups.groups[i].mItems !== undefined)
    for (var j=0; j<groups.groups[i].mItems.length; j++) 
    {
    //  console.log(groups.groups.[i].name)
   
     // $scope.groups[i].items.push(groups.groups[i].mItems[j]);

      $scope.groups[i].items[j] = {
      name: groups.groups[i].mItems[j].mName,
      lname: groups.groups[i].mItems[j].mlName,
      ename: groups.groups[i].mItems[j].mName,
      icon: groups.groups[i].mItems[j].mIcon,
      ref: groups.groups[i].mItems[j].mRef,
      };


    }
  }
   
    });

     $scope.toggleGroup = function(group) {
       //console.log("toggle toggle");
    if ($scope.isGroupShown(group)) {

      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    //console.log("shown shown");
    return $scope.shownGroup === group;
  };

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
    return (1- Math.abs(ratio));
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

 


});
