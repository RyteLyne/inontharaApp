angular.module('ionic.animate.ratio', [])

.directive('animateRatio', function($timeout, $ionicSideMenuDelegate) {

  return {
    restrict: 'A',
    scope: {
      animateRatio: '=',
    },
    link: function (scope, element, attr) {

      $timeout(function () {
        scope.$watch(function () {
          return $ionicSideMenuDelegate.getOpenRatio();
        },
        function (ratio) {
          scope.animateRatio(element[0], ratio);
        });
      });
    }
  }

})

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
      icon: groups.groups[i].mIcon,
      ref: groups.groups[i].mRef,
      items: []
    };
     if(groups.groups[i].mItems !== undefined)
    for (var j=0; j<groups.groups[i].mItems.length; j++) 
    {
    //  console.log(groups.groups.[i].name)
   
      $scope.groups[i].items.push(groups.groups[i].mItems[j]);


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