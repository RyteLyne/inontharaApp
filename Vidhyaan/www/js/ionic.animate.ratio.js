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

