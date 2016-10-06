var elastichat = angular.module('elastichat', ['ionic', 'monospaced.elastic', 'angularMoment'])


.controller('UserMessagesCtrl', ['$scope', '$rootScope', '$state',
  '$stateParams', 'MockService', '$ionicActionSheet',
  '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval',
  '$ionicActionSheet', '$filter', '$ionicModal',
  function($scope, $rootScope, $state, $stateParams, MockService,
    $ionicActionSheet,
    $ionicPopup, $ionicScrollDelegate, $timeout, $interval, $ionicActionSheet, $filter, $ionicModal) {
    console.log("initialised usermessageController1");
    // mock acquiring data via $stateParams
    $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://www.nicholls.co/images/nicholls.jpg',
      username: 'Nicholls'
    }

    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
      _id: '534b8fb2aa5e7afc1b23e69c',
      pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
      username: 'Marty'
    };

    $scope.input = {
      message: localStorage['userMessage-' + $scope.toUser._id] || ''
    };

    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^
    console.log("initialised usermessageController2");

    $scope.$on('$ionicView.enter', function(scopes, states ) {
      console.log('UserMessages $ionicView.enter');

      getMessages();
      
      $timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);

      messageCheckTimer = $interval(function() {
        // here you could check for new messages if your app doesn't use push notifications or user disabled them
      }, 20000);
    });

    $scope.$on('$ionicView.leave', function() {
      console.log('leaving UserMessages view, destroying interval');
      // Make sure that the interval is destroyed
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
      }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.toUser._id);
      }
    });

    function getMessages() {
      // the service is mock but you would probably pass the toUser's GUID here
      MockService.getUserMessages({
        toUserId: $scope.toUser._id
      }).then(function(data) {
        $scope.doneLoading = true;
        $scope.messages = data.messages;
      });
    }

    $scope.$watch('input.message', function(newValue, oldValue) {
      console.log('input.message $watch, newValue ' + newValue);
      if (!newValue) newValue = '';
      localStorage['userMessage-' + $scope.toUser._id] = newValue;
    });

    var addMessage = function(message){
      message._id = new Date().getTime(); // :~)
      message.date = new Date();
      message.username = $scope.user.username;
      message.userId = $scope.user._id;
      message.pic = $scope.user.picture;
      $scope.messages.push(message);
    };

    $scope.sendPhoto = function(){
      $ionicActionSheet.show({
        buttons: [
          { text: 'Take Photo' },
          { text: 'Photo from Library' }
        ],
        titleText: 'Upload image',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          var message = {
            toId: $scope.toUser._id,
            photo: 'http://ionicframework.com/img/ionic-logo-white.svg'
          };
          addMessage(message);

          $timeout(function() {
            var message = MockService.getMockMessage();
            message.date = new Date();
            $scope.messages.push(message);
          }, 2000);
          return true;
        }
      });
    };

    $scope.sendMessage = function(sendMessageForm) {
      var message = {
        toId: $scope.toUser._id,
        text: $scope.input.message
      };

      // if you do a web service call this will be needed as well as before the viewScroll calls
      // you can't see the effect of this in the browser it needs to be used on a real device
      // for some reason the one time blur event is not firing in the browser but does on devices
      keepKeyboardOpen();
      
      //MockService.sendMessage(message).then(function(data) {
      $scope.input.message = '';

      addMessage(message);
      $timeout(function() {
        keepKeyboardOpen();
      }, 0);

      $timeout(function() {
        var message = MockService.getMockMessage();
        message.date = new Date();
        $scope.messages.push(message);
        keepKeyboardOpen();
      }, 2000);
      //});
    };
    
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }
    $scope.refreshScroll = function(scrollBottom, timeout) {
      $timeout(function() {
        scrollBottom = scrollBottom || $scope.scrollDown;
        viewScroll.resize();
        if(scrollBottom){
          viewScroll.scrollBottom(true);
        }
        $scope.checkScroll();
      }, timeout || 1000);
    };
    $scope.scrollDown = true;
    $scope.checkScroll = function () {
      $timeout(function() {
        var currentTop = viewScroll.getScrollPosition().top;
        var maxScrollableDistanceFromTop = viewScroll.getScrollView().__maxScrollTop;
        $scope.scrollDown = (currentTop >= maxScrollableDistanceFromTop);
        $scope.$apply();
      }, 0);
      return true;
    };

    var openModal = function (templateUrl) {
			return $ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: 'slide-in-up',
				backdropClickToClose: false
			}).then(function (modal) {
				modal.show();
        $scope.modal = modal;
			});
		};

    $scope.photoBrowser = function(message){
      var messages = $filter('orderBy')($filter('filter')($scope.messages, { photo: '' }), 'date');
      $scope.activeSlide = messages.indexOf(message);
      $scope.allImages = messages.map(function(message){
        return message.photo;
      });

      openModal('templates/fullscreenImages.html');
    };

    $scope.closeModal = function(){
      $scope.modal.remove();
    };

    $scope.onMessageHold = function(e, itemIndex, message) {
      console.log('onMessageHold');
      console.log('message: ' + JSON.stringify(message, null, 2));
      $ionicActionSheet.show({
        buttons: [{
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              //cordova.plugins.clipboard.copy(message.text);

              break;
            case 1: // Delete
              // no server side secrets here :~)
              $scope.messages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function(msg) {
      if (msg.userId === $scope.user._id) {
        // go to your profile
      } else {
        // go to other users profile
      }
    };
    
    $scope.$on('elastic:resize', function(event, element, oldHeight, newHeight) {
      if (!footerBar) return;

      var newFooterHeight = newHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px'; 
    });
}])
.directive('img', ['$parse', function($parse) {
    
    function endsWith (url, path) {
      var index = url.length - path.length;
      return url.indexOf(path, index) !== -1;
    }
        
        return {
            restrict: 'E',
            link: function (scope, element, attributes) {        
                
                element.on('error', function (ev) {
                    var src = this.src;
                    var fn = attributes.ngError && $parse(attributes.ngError);
                    // If theres an ng-error callback then call it
                    if (fn) {
                        scope.$apply(function () {
                            fn(scope, { $event: ev, $src: src });
                        });
                    }
                    
                    // If theres an ng-error-src then set it
                    if (attributes.ngErrorSrc && !endsWith(src, attributes.ngErrorSrc)) {
                        element.attr('src', attributes.ngErrorSrc);
                    }
                });
                
                element.on('load', function(ev) {
                    var fn = attributes.ngSuccess && $parse(attributes.ngSuccess);
                    if(fn){
                        scope.$apply(function () {
                            fn(scope, { $event: ev });
                        });
                    }
                });
            }
        }
    }])

// services
.factory('MockService', ['$http', '$q',
  function($http, $q) {
    var me = {};

    me.getUserMessages = function(d) {
      /*
      var endpoint =
        'http://www.mocky.io/v2/547cf341501c337f0c9a63fd?callback=JSON_CALLBACK';
      return $http.jsonp(endpoint).then(function(response) {
        return response.data;
      }, function(err) {
        console.log('get user messages error, err: ' + JSON.stringify(
          err, null, 2));
      });
      */
      var deferred = $q.defer();
      
		 setTimeout(function() {
      	deferred.resolve(getMockMessages());
	    }, 1500);
      
      return deferred.promise;
    };

    me.getMockMessage = function() {
      return {
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      };
    }

    return me;
  }
])

// fitlers
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])

// directives
.directive('autolinker', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var eleHtml = element.html();

          if (eleHtml === '') {
            return false;
          }

          var text = Autolinker.link(eleHtml, {
            className: 'autolinker',
            newWindow: false
          });

          element.html(text);

          var autolinks = element[0].getElementsByClassName('autolinker');

          for (var i = 0; i < autolinks.length; i++) {
            angular.element(autolinks[i]).bind('click', function(e) {
              var href = e.target.href;
              console.log('autolinkClick, href: ' + href);

              if (href) {
                //window.open(href, '_system');
                window.open(href, '_blank');
              }

              e.preventDefault();
              return false;
            });
          }
        }, 0);
      }
    }
  }
])

function onProfilePicError(ele) {
  this.ele.src = ''; // set a fallback
}

function getMockMessages() {
  return {"messages":[
    {"_id":"535d625f898df4e80e2a125e","text":"Ionic has changed the game for hybrid app development.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-04-27T20:02:39.082Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"535f13ffee3b2a68112b9fc0","text":"I like Ionic better than ice cream!","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-04-29T02:52:47.706Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"546a5843fd4c5d581efa263a","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-17T20:19:15.289Z","read":true,"readDate":"2014-12-01T06:27:38.328Z"},{"_id":"54764399ab43d1d4113abfd1","text":"Am I dreaming?","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-26T21:18:17.591Z","read":true,"readDate":"2014-12-01T06:27:38.337Z"},{"_id":"547643aeab43d1d4113abfd2","text":"Is this magic?","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-26T21:18:38.549Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"547815dbab43d1d4113abfef","text":"Gee wiz, this is something special.","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-28T06:27:40.001Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781c69ab43d1d4113abff0","text":"I think I like Ionic more than I like ice cream!","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-28T06:55:37.350Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Yea, it's pretty sweet","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-28T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"5478df86ab43d1d4113abff4","text":"Wow, this is really something huh?","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-28T20:48:06.572Z","read":true,"readDate":"2014-12-01T06:27:38.339Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Create amazing apps - ionicframework.com","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},
  {"_id":"535d625f898df4e80e2a126e","photo":"http://ionicframework.com/img/homepage/phones-viewapp_2x.png","userId":"546a5843fd4c5d581efa263a","date":"2015-08-25T20:02:39.082Z","read":true,"readDate":"2014-13-02T06:27:37.944Z"}],"unread":0};
}

// configure moment relative time
moment.locale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
});

/*
 * angular-elastic v2.5.1
 * (c) 2014 Monospaced http://monospaced.com
 * License: MIT
 */

if (typeof module !== 'undefined' &&
    typeof exports !== 'undefined' &&
    module.exports === exports){
  module.exports = 'monospaced.elastic';
}

angular.module('monospaced.elastic', [])

  .constant('msdElasticConfig', {
    append: ''
  })

  .directive('msdElastic', [
    '$timeout', '$window', 'msdElasticConfig',
    function($timeout, $window, config) {
      'use strict';

      return {
        require: 'ngModel',
        restrict: 'A, C',
        link: function(scope, element, attrs, ngModel) {

          // cache a reference to the DOM element
          var ta = element[0],
              $ta = element;

          // ensure the element is a textarea, and browser is capable
          if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
            return;
          }

          // set these properties before measuring dimensions
          $ta.css({
            'overflow': 'hidden',
            'overflow-y': 'hidden',
            'word-wrap': 'break-word'
          });

          // force text reflow
          var text = ta.value;
          ta.value = '';
          ta.value = text;

          var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
              $win = angular.element($window),
              mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                                'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                                '-moz-box-sizing: content-box; box-sizing: content-box;' +
                                'min-height: 0 !important; height: 0 !important; padding: 0;' +
                                'word-wrap: break-word; border: 0;',
              $mirror = angular.element('<textarea aria-hidden="true" tabindex="-1" ' +
                                        'style="' + mirrorInitStyle + '"/>').data('elastic', true),
              mirror = $mirror[0],
              taStyle = getComputedStyle(ta),
              resize = taStyle.getPropertyValue('resize'),
              borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                          taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                          taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
              boxOuter = !borderBox ? {width: 0, height: 0} : {
                            width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                                    parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                            height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                                    parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                                    parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                          },
              minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
              heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
              minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
              maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
              mirrored,
              active,
              copyStyle = ['font-family',
                           'font-size',
                           'font-weight',
                           'font-style',
                           'letter-spacing',
                           'line-height',
                           'text-transform',
                           'word-spacing',
                           'text-indent'];

          // exit if elastic already applied (or is the mirror element)
          if ($ta.data('elastic')) {
            return;
          }

          // Opera returns max-height of -1 if not set
          maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

          // append mirror to the DOM
          if (mirror.parentNode !== document.body) {
            angular.element(document.body).append(mirror);
          }

          // set resize and apply elastic
          $ta.css({
            'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
          }).data('elastic', true);

          /*
           * methods
           */

          function initMirror() {
            var mirrorStyle = mirrorInitStyle;

            mirrored = ta;
            // copy the essential styles from the textarea to the mirror
            taStyle = getComputedStyle(ta);
            angular.forEach(copyStyle, function(val) {
              mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
            });
            mirror.setAttribute('style', mirrorStyle);
          }

          function adjust() {
            var taHeight,
                taComputedStyleWidth,
                mirrorHeight,
                width,
                overflow;

            if (mirrored !== ta) {
              initMirror();
            }

            // active flag prevents actions in function from calling adjust again
            if (!active) {
              active = true;

              mirror.value = ta.value + append; // optional whitespace to improve animation
              mirror.style.overflowY = ta.style.overflowY;

              taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

              taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

              // ensure getComputedStyle has returned a readable 'used value' pixel width
              if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                // update mirror width in case the textarea width has changed
                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                mirror.style.width = width + 'px';
              }

              mirrorHeight = mirror.scrollHeight;

              if (mirrorHeight > maxHeight) {
                mirrorHeight = maxHeight;
                overflow = 'scroll';
              } else if (mirrorHeight < minHeight) {
                mirrorHeight = minHeight;
              }
              mirrorHeight += boxOuter.height;
              ta.style.overflowY = overflow || 'hidden';

              if (taHeight !== mirrorHeight) {
                scope.$emit('elastic:resize', $ta, taHeight, mirrorHeight);
                ta.style.height = mirrorHeight + 'px';
              }

              // small delay to prevent an infinite loop
              $timeout(function() {
                active = false;
              }, 1, false);

            }
          }

          function forceAdjust() {
            active = false;
            adjust();
          }

          /*
           * initialise
           */

          // listen
          if ('onpropertychange' in ta && 'oninput' in ta) {
            // IE9
            ta['oninput'] = ta.onkeyup = adjust;
          } else {
            ta['oninput'] = adjust;
          }

          $win.bind('resize', forceAdjust);

          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newValue) {
            forceAdjust();
          });

          scope.$on('elastic:adjust', function() {
            initMirror();
            forceAdjust();
          });

          $timeout(adjust, 0, false);

          /*
           * destroy
           */

          scope.$on('$destroy', function() {
            $mirror.remove();
            $win.unbind('resize', forceAdjust);
          });
        }
      };
    }
  ]);

// autolinker
/*!
 * Autolinker.js
 * 0.27.0
 *
 * Copyright(c) 2016 Gregory Jacobs <greg@greg-jacobs.com>
 * MIT License
 *
 * https://github.com/gregjacobs/Autolinker.js
 */
!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.Autolinker=e()}(this,function(){var t=function(e){e=e||{},this.version=t.version,this.urls=this.normalizeUrlsCfg(e.urls),this.email="boolean"==typeof e.email?e.email:!0,this.twitter="boolean"==typeof e.twitter?e.twitter:!0,this.phone="boolean"==typeof e.phone?e.phone:!0,this.hashtag=e.hashtag||!1,this.newWindow="boolean"==typeof e.newWindow?e.newWindow:!0,this.stripPrefix="boolean"==typeof e.stripPrefix?e.stripPrefix:!0;var r=this.hashtag;if(r!==!1&&"twitter"!==r&&"facebook"!==r&&"instagram"!==r)throw new Error("invalid `hashtag` cfg - see docs");this.truncate=this.normalizeTruncateCfg(e.truncate),this.className=e.className||"",this.replaceFn=e.replaceFn||null,this.htmlParser=null,this.matchers=null,this.tagBuilder=null};return t.link=function(e,r){var a=new t(r);return a.link(e)},t.version="0.27.0",t.prototype={constructor:t,normalizeUrlsCfg:function(t){return null==t&&(t=!0),"boolean"==typeof t?{schemeMatches:t,wwwMatches:t,tldMatches:t}:{schemeMatches:"boolean"==typeof t.schemeMatches?t.schemeMatches:!0,wwwMatches:"boolean"==typeof t.wwwMatches?t.wwwMatches:!0,tldMatches:"boolean"==typeof t.tldMatches?t.tldMatches:!0}},normalizeTruncateCfg:function(e){return"number"==typeof e?{length:e,location:"end"}:t.Util.defaults(e||{},{length:Number.POSITIVE_INFINITY,location:"end"})},parse:function(t){for(var e=this.getHtmlParser(),r=e.parse(t),a=0,n=[],i=0,s=r.length;s>i;i++){var o=r[i],c=o.getType();if("element"===c&&"a"===o.getTagName())o.isClosing()?a=Math.max(a-1,0):a++;else if("text"===c&&0===a){var h=this.parseText(o.getText(),o.getOffset());n.push.apply(n,h)}}return n=this.compactMatches(n),n=this.removeUnwantedMatches(n)},compactMatches:function(t){t.sort(function(t,e){return t.getOffset()-e.getOffset()});for(var e=0;e<t.length-1;e++)for(var r=t[e],a=r.getOffset()+r.getMatchedText().length;e+1<t.length&&t[e+1].getOffset()<=a;)t.splice(e+1,1);return t},removeUnwantedMatches:function(e){var r=t.Util.remove;return this.hashtag||r(e,function(t){return"hashtag"===t.getType()}),this.email||r(e,function(t){return"email"===t.getType()}),this.phone||r(e,function(t){return"phone"===t.getType()}),this.twitter||r(e,function(t){return"twitter"===t.getType()}),this.urls.schemeMatches||r(e,function(t){return"url"===t.getType()&&"scheme"===t.getUrlMatchType()}),this.urls.wwwMatches||r(e,function(t){return"url"===t.getType()&&"www"===t.getUrlMatchType()}),this.urls.tldMatches||r(e,function(t){return"url"===t.getType()&&"tld"===t.getUrlMatchType()}),e},parseText:function(t,e){e=e||0;for(var r=this.getMatchers(),a=[],n=0,i=r.length;i>n;n++){for(var s=r[n].parseMatches(t),o=0,c=s.length;c>o;o++)s[o].setOffset(e+s[o].getOffset());a.push.apply(a,s)}return a},link:function(t){if(!t)return"";for(var e=this.parse(t),r=[],a=0,n=0,i=e.length;i>n;n++){var s=e[n];r.push(t.substring(a,s.getOffset())),r.push(this.createMatchReturnVal(s)),a=s.getOffset()+s.getMatchedText().length}return r.push(t.substring(a)),r.join("")},createMatchReturnVal:function(e){var r;if(this.replaceFn&&(r=this.replaceFn.call(this,this,e)),"string"==typeof r)return r;if(r===!1)return e.getMatchedText();if(r instanceof t.HtmlTag)return r.toAnchorString();var a=e.buildTag();return a.toAnchorString()},getHtmlParser:function(){var e=this.htmlParser;return e||(e=this.htmlParser=new t.htmlParser.HtmlParser),e},getMatchers:function(){if(this.matchers)return this.matchers;var e=t.matcher,r=this.getTagBuilder(),a=[new e.Hashtag({tagBuilder:r,serviceName:this.hashtag}),new e.Email({tagBuilder:r}),new e.Phone({tagBuilder:r}),new e.Twitter({tagBuilder:r}),new e.Url({tagBuilder:r,stripPrefix:this.stripPrefix})];return this.matchers=a},getTagBuilder:function(){var e=this.tagBuilder;return e||(e=this.tagBuilder=new t.AnchorTagBuilder({newWindow:this.newWindow,truncate:this.truncate,className:this.className})),e}},t.match={},t.matcher={},t.htmlParser={},t.truncate={},t.Util={abstractMethod:function(){throw"abstract"},trimRegex:/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,assign:function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},defaults:function(t,e){for(var r in e)e.hasOwnProperty(r)&&void 0===t[r]&&(t[r]=e[r]);return t},extend:function(e,r){var a=e.prototype,n=function(){};n.prototype=a;var i;i=r.hasOwnProperty("constructor")?r.constructor:function(){a.constructor.apply(this,arguments)};var s=i.prototype=new n;return s.constructor=i,s.superclass=a,delete r.constructor,t.Util.assign(s,r),i},ellipsis:function(t,e,r){return t.length>e&&(r=null==r?"..":r,t=t.substring(0,e-r.length)+r),t},indexOf:function(t,e){if(Array.prototype.indexOf)return t.indexOf(e);for(var r=0,a=t.length;a>r;r++)if(t[r]===e)return r;return-1},remove:function(t,e){for(var r=t.length-1;r>=0;r--)e(t[r])===!0&&t.splice(r,1)},splitAndCapture:function(t,e){for(var r,a=[],n=0;r=e.exec(t);)a.push(t.substring(n,r.index)),a.push(r[0]),n=r.index+r[0].length;return a.push(t.substring(n)),a},trim:function(t){return t.replace(this.trimRegex,"")}},t.HtmlTag=t.Util.extend(Object,{whitespaceRegex:/\s+/,constructor:function(e){t.Util.assign(this,e),this.innerHtml=this.innerHtml||this.innerHTML},setTagName:function(t){return this.tagName=t,this},getTagName:function(){return this.tagName||""},setAttr:function(t,e){var r=this.getAttrs();return r[t]=e,this},getAttr:function(t){return this.getAttrs()[t]},setAttrs:function(e){var r=this.getAttrs();return t.Util.assign(r,e),this},getAttrs:function(){return this.attrs||(this.attrs={})},setClass:function(t){return this.setAttr("class",t)},addClass:function(e){for(var r,a=this.getClass(),n=this.whitespaceRegex,i=t.Util.indexOf,s=a?a.split(n):[],o=e.split(n);r=o.shift();)-1===i(s,r)&&s.push(r);return this.getAttrs()["class"]=s.join(" "),this},removeClass:function(e){for(var r,a=this.getClass(),n=this.whitespaceRegex,i=t.Util.indexOf,s=a?a.split(n):[],o=e.split(n);s.length&&(r=o.shift());){var c=i(s,r);-1!==c&&s.splice(c,1)}return this.getAttrs()["class"]=s.join(" "),this},getClass:function(){return this.getAttrs()["class"]||""},hasClass:function(t){return-1!==(" "+this.getClass()+" ").indexOf(" "+t+" ")},setInnerHtml:function(t){return this.innerHtml=t,this},getInnerHtml:function(){return this.innerHtml||""},toAnchorString:function(){var t=this.getTagName(),e=this.buildAttrsStr();return e=e?" "+e:"",["<",t,e,">",this.getInnerHtml(),"</",t,">"].join("")},buildAttrsStr:function(){if(!this.attrs)return"";var t=this.getAttrs(),e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r+'="'+t[r]+'"');return e.join(" ")}}),t.RegexLib=function(){var t="A-Za-z\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢴऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛱ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿕ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋ-ꞭꞰ-ꞷꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭥꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",e="0-9٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯෦-෯๐-๙໐-໙༠-༩၀-၉႐-႙០-៩᠐-᠙᥆-᥏᧐-᧙᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙꘠-꘩꣐-꣙꤀-꤉꧐-꧙꧰-꧹꩐-꩙꯰-꯹０-９",r=t+e,a=new RegExp("["+r+".\\-]*["+r+"\\-]"),n=/(?:travelersinsurance|sandvikcoromant|kerryproperties|cancerresearch|weatherchannel|kerrylogistics|spreadbetting|international|wolterskluwer|lifeinsurance|construction|pamperedchef|scholarships|versicherung|bridgestone|creditunion|kerryhotels|investments|productions|blackfriday|enterprises|lamborghini|photography|motorcycles|williamhill|playstation|contractors|barclaycard|accountants|redumbrella|engineering|management|telefonica|protection|consulting|tatamotors|creditcard|vlaanderen|schaeffler|associates|properties|foundation|republican|bnpparibas|boehringer|eurovision|extraspace|industries|immobilien|university|technology|volkswagen|healthcare|restaurant|cuisinella|vistaprint|apartments|accountant|travelers|homedepot|institute|vacations|furniture|fresenius|insurance|christmas|bloomberg|solutions|barcelona|firestone|financial|kuokgroup|fairwinds|community|passagens|goldpoint|equipment|lifestyle|yodobashi|aquarelle|marketing|analytics|education|amsterdam|statefarm|melbourne|allfinanz|directory|microsoft|stockholm|montblanc|accenture|lancaster|landrover|everbank|istanbul|graphics|grainger|ipiranga|softbank|attorney|pharmacy|saarland|catering|airforce|yokohama|mortgage|frontier|mutuelle|stcgroup|memorial|pictures|football|symantec|cipriani|ventures|telecity|cityeats|verisign|flsmidth|boutique|cleaning|firmdale|clinique|clothing|redstone|infiniti|deloitte|feedback|services|broadway|plumbing|commbank|training|barclays|exchange|computer|brussels|software|delivery|barefoot|builders|business|bargains|engineer|holdings|download|security|helsinki|lighting|movistar|discount|hdfcbank|supplies|marriott|property|diamonds|capetown|partners|democrat|jpmorgan|bradesco|budapest|rexroth|zuerich|shriram|academy|science|support|youtube|singles|surgery|alibaba|statoil|dentist|schwarz|android|cruises|cricket|digital|markets|starhub|systems|courses|coupons|netbank|country|domains|corsica|network|neustar|realtor|lincoln|limited|schmidt|yamaxun|cooking|contact|auction|spiegel|liaison|leclerc|latrobe|lasalle|abogado|compare|lanxess|exposed|express|company|cologne|college|avianca|lacaixa|fashion|recipes|ferrero|komatsu|storage|wanggou|clubmed|sandvik|fishing|fitness|bauhaus|kitchen|flights|florist|flowers|watches|weather|temasek|samsung|bentley|forsale|channel|theater|frogans|theatre|okinawa|website|tickets|jewelry|gallery|tiffany|iselect|shiksha|brother|organic|wedding|genting|toshiba|origins|philips|hyundai|hotmail|hoteles|hosting|rentals|windows|cartier|bugatti|holiday|careers|whoswho|hitachi|panerai|caravan|reviews|guitars|capital|trading|hamburg|hangout|finance|stream|family|abbott|health|review|travel|report|hermes|hiphop|gratis|career|toyota|hockey|dating|repair|google|social|soccer|reisen|global|otsuka|giving|unicom|casino|photos|center|broker|rocher|orange|bostik|garden|insure|ryukyu|bharti|safety|physio|sakura|oracle|online|jaguar|gallup|piaget|tienda|futbol|pictet|joburg|webcam|berlin|office|juegos|kaufen|chanel|chrome|xihuan|church|tennis|circle|kinder|flickr|bayern|claims|clinic|viajes|nowruz|xperia|norton|yachts|studio|coffee|camera|sanofi|nissan|author|expert|events|comsec|lawyer|tattoo|viking|estate|villas|condos|realty|yandex|energy|emerck|virgin|vision|durban|living|school|coupon|london|taobao|natura|taipei|nagoya|luxury|walter|aramco|sydney|madrid|credit|maison|makeup|schule|market|anquan|direct|design|swatch|suzuki|alsace|vuelos|dental|alipay|voyage|shouji|voting|airtel|mutual|degree|supply|agency|museum|mobily|dealer|monash|select|mormon|active|moscow|racing|datsun|quebec|nissay|rodeo|email|gifts|works|photo|chloe|edeka|cheap|earth|vista|tushu|koeln|glass|shoes|globo|tunes|gmail|nokia|space|kyoto|black|ricoh|seven|lamer|sener|epson|cisco|praxi|trust|citic|crown|shell|lease|green|legal|lexus|ninja|tatar|gripe|nikon|group|video|wales|autos|gucci|party|nexus|guide|linde|adult|parts|amica|lixil|boats|azure|loans|locus|cymru|lotte|lotto|stada|click|poker|quest|dabur|lupin|nadex|paris|faith|dance|canon|place|gives|trade|skype|rocks|mango|cloud|boots|smile|final|swiss|homes|honda|media|horse|cards|deals|watch|bosch|house|pizza|miami|osaka|tours|total|xerox|coach|sucks|style|delta|toray|iinet|tools|money|codes|beats|tokyo|salon|archi|movie|baidu|study|actor|yahoo|store|apple|world|forex|today|bible|tmall|tirol|irish|tires|forum|reise|vegas|vodka|sharp|omega|weber|jetzt|audio|promo|build|bingo|chase|gallo|drive|dubai|rehab|press|solar|sale|beer|bbva|bank|band|auto|sapo|sarl|saxo|audi|asia|arte|arpa|army|yoga|ally|zara|scor|scot|sexy|seat|zero|seek|aero|adac|zone|aarp|maif|meet|meme|menu|surf|mini|mobi|mtpc|porn|desi|star|ltda|name|talk|navy|love|loan|live|link|news|limo|like|spot|life|nico|lidl|lgbt|land|taxi|team|tech|kred|kpmg|sony|song|kiwi|kddi|jprs|jobs|sohu|java|itau|tips|info|immo|icbc|hsbc|town|host|page|toys|here|help|pars|haus|guru|guge|tube|goog|golf|gold|sncf|gmbh|gift|ggee|gent|gbiz|game|vana|pics|fund|ford|ping|pink|fish|film|fast|farm|play|fans|fail|plus|skin|pohl|fage|moda|post|erni|dvag|prod|doha|prof|docs|viva|diet|luxe|site|dell|sina|dclk|show|qpon|date|vote|cyou|voto|read|coop|cool|wang|club|city|chat|cern|cash|reit|rent|casa|cars|care|camp|rest|call|cafe|weir|wien|rich|wiki|buzz|wine|book|bond|room|work|rsvp|shia|ruhr|blue|bing|shaw|bike|safe|xbox|best|pwc|mtn|lds|aig|boo|fyi|nra|nrw|ntt|car|gal|obi|zip|aeg|vin|how|one|ong|onl|dad|ooo|bet|esq|org|htc|bar|uol|ibm|ovh|gdn|ice|icu|uno|gea|ifm|bot|top|wtf|lol|day|pet|eus|wtc|ubs|tvs|aco|ing|ltd|ink|tab|abb|afl|cat|int|pid|pin|bid|cba|gle|com|cbn|ads|man|wed|ceb|gmo|sky|ist|gmx|tui|mba|fan|ski|iwc|app|pro|med|ceo|jcb|jcp|goo|dev|men|aaa|meo|pub|jlc|bom|jll|gop|jmp|mil|got|gov|win|jot|mma|joy|trv|red|cfa|cfd|bio|moe|moi|mom|ren|biz|aws|xin|bbc|dnp|buy|kfh|mov|thd|xyz|fit|kia|rio|rip|kim|dog|vet|nyc|bcg|mtr|bcn|bms|bmw|run|bzh|rwe|tel|stc|axa|kpn|fly|krd|cab|bnl|foo|crs|eat|tci|sap|srl|nec|sas|net|cal|sbs|sfr|sca|scb|csc|edu|new|xxx|hiv|fox|wme|ngo|nhk|vip|sex|frl|lat|yun|law|you|tax|soy|sew|om|ac|hu|se|sc|sg|sh|sb|sa|rw|ru|rs|ro|re|qa|py|si|pw|pt|ps|sj|sk|pr|pn|pm|pl|sl|sm|pk|sn|ph|so|pg|pf|pe|pa|zw|nz|nu|nr|np|no|nl|ni|ng|nf|sr|ne|st|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|su|mn|mm|ml|mk|mh|mg|me|sv|md|mc|sx|sy|ma|ly|lv|sz|lu|lt|ls|lr|lk|li|lc|lb|la|tc|kz|td|ky|kw|kr|kp|kn|km|ki|kh|tf|tg|th|kg|ke|jp|jo|jm|je|it|is|ir|tj|tk|tl|tm|iq|tn|to|io|in|im|il|ie|ad|sd|ht|hr|hn|hm|tr|hk|gy|gw|gu|gt|gs|gr|gq|tt|gp|gn|gm|gl|tv|gi|tw|tz|ua|gh|ug|uk|gg|gf|ge|gd|us|uy|uz|va|gb|ga|vc|ve|fr|fo|fm|fk|fj|vg|vi|fi|eu|et|es|er|eg|ee|ec|dz|do|dm|dk|vn|dj|de|cz|cy|cx|cw|vu|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|wf|bz|by|bw|bv|bt|bs|br|bo|bn|bm|bj|bi|ws|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ye|ar|aq|ao|am|al|yt|ai|za|ag|af|ae|zm|id)\b/;return{alphaNumericCharsStr:r,domainNameRegex:a,tldRegex:n}}(),t.AnchorTagBuilder=t.Util.extend(Object,{constructor:function(e){t.Util.assign(this,e)},build:function(e){return new t.HtmlTag({tagName:"a",attrs:this.createAttrs(e.getType(),e.getAnchorHref()),innerHtml:this.processAnchorText(e.getAnchorText())})},createAttrs:function(t,e){var r={href:e},a=this.createCssClass(t);return a&&(r["class"]=a),this.newWindow&&(r.target="_blank",r.rel="noopener noreferrer"),r},createCssClass:function(t){var e=this.className;return e?e+" "+e+"-"+t:""},processAnchorText:function(t){return t=this.doTruncate(t)},doTruncate:function(e){var r=this.truncate;if(!r||!r.length)return e;var a=r.length,n=r.location;return"smart"===n?t.truncate.TruncateSmart(e,a,".."):"middle"===n?t.truncate.TruncateMiddle(e,a,".."):t.truncate.TruncateEnd(e,a,"..")}}),t.htmlParser.HtmlParser=t.Util.extend(Object,{htmlRegex:function(){var t=/!--([\s\S]+?)--/,e=/[0-9a-zA-Z][0-9a-zA-Z:]*/,r=/[^\s"'>\/=\x00-\x1F\x7F]+/,a=/(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/,n=r.source+"(?:\\s*=\\s*"+a.source+")?";return new RegExp(["(?:","<(!DOCTYPE)","(?:","\\s+","(?:",n,"|",a.source+")",")*",">",")","|","(?:","<(/)?","(?:",t.source,"|","(?:","("+e.source+")","(?:","(?:\\s+|\\b)",n,")*","\\s*/?",")",")",">",")"].join(""),"gi")}(),htmlCharacterEntitiesRegex:/(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,parse:function(t){for(var e,r,a=this.htmlRegex,n=0,i=[];null!==(e=a.exec(t));){var s=e[0],o=e[3],c=e[1]||e[4],h=!!e[2],l=e.index,u=t.substring(n,l);u&&(r=this.parseTextAndEntityNodes(n,u),i.push.apply(i,r)),o?i.push(this.createCommentNode(l,s,o)):i.push(this.createElementNode(l,s,c,h)),n=l+s.length}if(n<t.length){var g=t.substring(n);g&&(r=this.parseTextAndEntityNodes(n,g),i.push.apply(i,r))}return i},parseTextAndEntityNodes:function(e,r){for(var a=[],n=t.Util.splitAndCapture(r,this.htmlCharacterEntitiesRegex),i=0,s=n.length;s>i;i+=2){var o=n[i],c=n[i+1];o&&(a.push(this.createTextNode(e,o)),e+=o.length),c&&(a.push(this.createEntityNode(e,c)),e+=c.length)}return a},createCommentNode:function(e,r,a){return new t.htmlParser.CommentNode({offset:e,text:r,comment:t.Util.trim(a)})},createElementNode:function(e,r,a,n){return new t.htmlParser.ElementNode({offset:e,text:r,tagName:a.toLowerCase(),closing:n})},createEntityNode:function(e,r){return new t.htmlParser.EntityNode({offset:e,text:r})},createTextNode:function(e,r){return new t.htmlParser.TextNode({offset:e,text:r})}}),t.htmlParser.HtmlNode=t.Util.extend(Object,{offset:void 0,text:void 0,constructor:function(e){t.Util.assign(this,e)},getType:t.Util.abstractMethod,getOffset:function(){return this.offset},getText:function(){return this.text}}),t.htmlParser.CommentNode=t.Util.extend(t.htmlParser.HtmlNode,{comment:"",getType:function(){return"comment"},getComment:function(){return this.comment}}),t.htmlParser.ElementNode=t.Util.extend(t.htmlParser.HtmlNode,{tagName:"",closing:!1,getType:function(){return"element"},getTagName:function(){return this.tagName},isClosing:function(){return this.closing}}),t.htmlParser.EntityNode=t.Util.extend(t.htmlParser.HtmlNode,{getType:function(){return"entity"}}),t.htmlParser.TextNode=t.Util.extend(t.htmlParser.HtmlNode,{getType:function(){return"text"}}),t.match.Match=t.Util.extend(Object,{constructor:function(t){this.tagBuilder=t.tagBuilder,this.matchedText=t.matchedText,this.offset=t.offset},getType:t.Util.abstractMethod,getMatchedText:function(){return this.matchedText},setOffset:function(t){this.offset=t},getOffset:function(){return this.offset},getAnchorHref:t.Util.abstractMethod,getAnchorText:t.Util.abstractMethod,buildTag:function(){return this.tagBuilder.build(this)}}),t.match.Email=t.Util.extend(t.match.Match,{constructor:function(e){t.match.Match.prototype.constructor.call(this,e),this.email=e.email},getType:function(){return"email"},getEmail:function(){return this.email},getAnchorHref:function(){return"mailto:"+this.email},getAnchorText:function(){return this.email}}),t.match.Hashtag=t.Util.extend(t.match.Match,{constructor:function(e){t.match.Match.prototype.constructor.call(this,e),this.serviceName=e.serviceName,this.hashtag=e.hashtag},getType:function(){return"hashtag"},getServiceName:function(){return this.serviceName},getHashtag:function(){return this.hashtag},getAnchorHref:function(){var t=this.serviceName,e=this.hashtag;switch(t){case"twitter":return"https://twitter.com/hashtag/"+e;case"facebook":return"https://www.facebook.com/hashtag/"+e;case"instagram":return"https://instagram.com/explore/tags/"+e;default:throw new Error("Unknown service name to point hashtag to: ",t)}},getAnchorText:function(){return"#"+this.hashtag}}),t.match.Phone=t.Util.extend(t.match.Match,{constructor:function(e){t.match.Match.prototype.constructor.call(this,e),this.number=e.number,this.plusSign=e.plusSign},getType:function(){return"phone"},getNumber:function(){return this.number},getAnchorHref:function(){return"tel:"+(this.plusSign?"+":"")+this.number},getAnchorText:function(){return this.matchedText}}),t.match.Twitter=t.Util.extend(t.match.Match,{constructor:function(e){t.match.Match.prototype.constructor.call(this,e),this.twitterHandle=e.twitterHandle},getType:function(){return"twitter"},getTwitterHandle:function(){return this.twitterHandle},getAnchorHref:function(){return"https://twitter.com/"+this.twitterHandle},getAnchorText:function(){return"@"+this.twitterHandle}}),t.match.Url=t.Util.extend(t.match.Match,{constructor:function(e){t.match.Match.prototype.constructor.call(this,e),this.urlMatchType=e.urlMatchType,this.url=e.url,this.protocolUrlMatch=e.protocolUrlMatch,this.protocolRelativeMatch=e.protocolRelativeMatch,this.stripPrefix=e.stripPrefix},urlPrefixRegex:/^(https?:\/\/)?(www\.)?/i,protocolRelativeRegex:/^\/\//,protocolPrepended:!1,getType:function(){return"url"},getUrlMatchType:function(){return this.urlMatchType},getUrl:function(){var t=this.url;return this.protocolRelativeMatch||this.protocolUrlMatch||this.protocolPrepended||(t=this.url="http://"+t,this.protocolPrepended=!0),t},getAnchorHref:function(){var t=this.getUrl();return t.replace(/&amp;/g,"&")},getAnchorText:function(){var t=this.getMatchedText();return this.protocolRelativeMatch&&(t=this.stripProtocolRelativePrefix(t)),this.stripPrefix&&(t=this.stripUrlPrefix(t)),t=this.removeTrailingSlash(t)},stripUrlPrefix:function(t){return t.replace(this.urlPrefixRegex,"")},stripProtocolRelativePrefix:function(t){return t.replace(this.protocolRelativeRegex,"")},removeTrailingSlash:function(t){return"/"===t.charAt(t.length-1)&&(t=t.slice(0,-1)),t}}),t.matcher.Matcher=t.Util.extend(Object,{constructor:function(t){this.tagBuilder=t.tagBuilder},parseMatches:t.Util.abstractMethod}),t.matcher.Email=t.Util.extend(t.matcher.Matcher,{matcherRegex:function(){var e=t.RegexLib.alphaNumericCharsStr,r=new RegExp("["+e+"\\-_';:&=+$.,]+@"),a=t.RegexLib.domainNameRegex,n=t.RegexLib.tldRegex;return new RegExp([r.source,a.source,"\\.",n.source].join(""),"gi")}(),parseMatches:function(e){for(var r,a=this.matcherRegex,n=this.tagBuilder,i=[];null!==(r=a.exec(e));){var s=r[0];i.push(new t.match.Email({tagBuilder:n,matchedText:s,offset:r.index,email:s}))}return i}}),t.matcher.Hashtag=t.Util.extend(t.matcher.Matcher,{matcherRegex:new RegExp("#[_"+t.RegexLib.alphaNumericCharsStr+"]{1,139}","g"),nonWordCharRegex:new RegExp("[^"+t.RegexLib.alphaNumericCharsStr+"]"),constructor:function(e){t.matcher.Matcher.prototype.constructor.call(this,e),this.serviceName=e.serviceName},parseMatches:function(e){for(var r,a=this.matcherRegex,n=this.nonWordCharRegex,i=this.serviceName,s=this.tagBuilder,o=[];null!==(r=a.exec(e));){var c=r.index,h=e.charAt(c-1);if(0===c||n.test(h)){var l=r[0],u=r[0].slice(1);o.push(new t.match.Hashtag({tagBuilder:s,matchedText:l,offset:c,serviceName:i,hashtag:u}))}}return o}}),t.matcher.Phone=t.Util.extend(t.matcher.Matcher,{matcherRegex:/(?:(\+)?\d{1,3}[-\040.])?\(?\d{3}\)?[-\040.]?\d{3}[-\040.]\d{4}/g,parseMatches:function(e){for(var r,a=this.matcherRegex,n=this.tagBuilder,i=[];null!==(r=a.exec(e));){var s=r[0],o=s.replace(/\D/g,""),c=!!r[1];i.push(new t.match.Phone({tagBuilder:n,matchedText:s,offset:r.index,number:o,plusSign:c}))}return i}}),t.matcher.Twitter=t.Util.extend(t.matcher.Matcher,{matcherRegex:new RegExp("@[_"+t.RegexLib.alphaNumericCharsStr+"]{1,20}","g"),nonWordCharRegex:new RegExp("[^"+t.RegexLib.alphaNumericCharsStr+"]"),parseMatches:function(e){for(var r,a=this.matcherRegex,n=this.nonWordCharRegex,i=this.tagBuilder,s=[];null!==(r=a.exec(e));){var o=r.index,c=e.charAt(o-1);if(0===o||n.test(c)){var h=r[0],l=r[0].slice(1);s.push(new t.match.Twitter({tagBuilder:i,matchedText:h,offset:o,twitterHandle:l}))}}return s}}),t.matcher.Url=t.Util.extend(t.matcher.Matcher,{matcherRegex:function(){var e=/(?:[A-Za-z][-.+A-Za-z0-9]*:(?![A-Za-z][-.+A-Za-z0-9]*:\/\/)(?!\d+\/?)(?:\/\/)?)/,r=/(?:www\.)/,a=t.RegexLib.domainNameRegex,n=t.RegexLib.tldRegex,i=t.RegexLib.alphaNumericCharsStr,s=new RegExp("["+i+"\\-+&@#/%=~_()|'$*\\[\\]?!:,.;]*["+i+"\\-+&@#/%=~_()|'$*\\[\\]]");return new RegExp(["(?:","(",e.source,a.source,")","|","(","(//)?",r.source,a.source,")","|","(","(//)?",a.source+"\\.",n.source,")",")","(?:"+s.source+")?"].join(""),"gi")}(),wordCharRegExp:/\w/,openParensRe:/\(/g,closeParensRe:/\)/g,constructor:function(e){t.matcher.Matcher.prototype.constructor.call(this,e),this.stripPrefix=e.stripPrefix},parseMatches:function(e){for(var r,a=this.matcherRegex,n=this.stripPrefix,i=this.tagBuilder,s=[];null!==(r=a.exec(e));){var o=r[0],c=r[1],h=r[2],l=r[3],u=r[5],g=r.index,m=l||u,f=e.charAt(g-1);if(t.matcher.UrlMatchValidator.isValid(o,c)&&!(g>0&&"@"===f||g>0&&m&&this.wordCharRegExp.test(f))){if(this.matchHasUnbalancedClosingParen(o))o=o.substr(0,o.length-1);else{var p=this.matchHasInvalidCharAfterTld(o,c);p>-1&&(o=o.substr(0,p))}var d=c?"scheme":h?"www":"tld",b=!!c;s.push(new t.match.Url({tagBuilder:i,matchedText:o,offset:g,urlMatchType:d,url:o,protocolUrlMatch:b,protocolRelativeMatch:!!m,stripPrefix:n}))}}return s},matchHasUnbalancedClosingParen:function(t){var e=t.charAt(t.length-1);if(")"===e){var r=t.match(this.openParensRe),a=t.match(this.closeParensRe),n=r&&r.length||0,i=a&&a.length||0;if(i>n)return!0}return!1},matchHasInvalidCharAfterTld:function(t,e){if(!t)return-1;var r=0;e&&(r=t.indexOf(":"),t=t.slice(r));var a=/^((.?\/\/)?[A-Za-z0-9\u00C0-\u017F\.\-]*[A-Za-z0-9\u00C0-\u017F\-]\.[A-Za-z]+)/,n=a.exec(t);return null===n?-1:(r+=n[1].length,t=t.slice(n[1].length),/^[^.A-Za-z:\/?#]/.test(t)?r:-1)}}),t.matcher.UrlMatchValidator={hasFullProtocolRegex:/^[A-Za-z][-.+A-Za-z0-9]*:\/\//,uriSchemeRegex:/^[A-Za-z][-.+A-Za-z0-9]*:/,hasWordCharAfterProtocolRegex:/:[^\s]*?[A-Za-z\u00C0-\u017F]/,isValid:function(t,e){return!(e&&!this.isValidUriScheme(e)||this.urlMatchDoesNotHaveProtocolOrDot(t,e)||this.urlMatchDoesNotHaveAtLeastOneWordChar(t,e))},isValidUriScheme:function(t){var e=t.match(this.uriSchemeRegex)[0].toLowerCase();return"javascript:"!==e&&"vbscript:"!==e},urlMatchDoesNotHaveProtocolOrDot:function(t,e){return!(!t||e&&this.hasFullProtocolRegex.test(e)||-1!==t.indexOf("."))},urlMatchDoesNotHaveAtLeastOneWordChar:function(t,e){return t&&e?!this.hasWordCharAfterProtocolRegex.test(t):!1}},t.truncate.TruncateEnd=function(e,r,a){return t.Util.ellipsis(e,r,a)},t.truncate.TruncateMiddle=function(t,e,r){if(t.length<=e)return t;var a=e-r.length,n="";return a>0&&(n=t.substr(-1*Math.floor(a/2))),(t.substr(0,Math.ceil(a/2))+r+n).substr(0,e)},t.truncate.TruncateSmart=function(t,e,r){var a=function(t){var e={},r=t,a=r.match(/^([a-z]+):\/\//i);return a&&(e.scheme=a[1],r=r.substr(a[0].length)),a=r.match(/^(.*?)(?=(\?|#|\/|$))/i),a&&(e.host=a[1],r=r.substr(a[0].length)),a=r.match(/^\/(.*?)(?=(\?|#|$))/i),a&&(e.path=a[1],r=r.substr(a[0].length)),a=r.match(/^\?(.*?)(?=(#|$))/i),a&&(e.query=a[1],r=r.substr(a[0].length)),a=r.match(/^#(.*?)$/i),a&&(e.fragment=a[1]),e},n=function(t){var e="";return t.scheme&&t.host&&(e+=t.scheme+"://"),t.host&&(e+=t.host),t.path&&(e+="/"+t.path),t.query&&(e+="?"+t.query),t.fragment&&(e+="#"+t.fragment),e},i=function(t,e){var a=e/2,n=Math.ceil(a),i=-1*Math.floor(a),s="";return 0>i&&(s=t.substr(i)),t.substr(0,n)+r+s};if(t.length<=e)return t;var s=e-r.length,o=a(t);if(o.query){var c=o.query.match(/^(.*?)(?=(\?|\#))(.*?)$/i);c&&(o.query=o.query.substr(0,c[1].length),t=n(o))}if(t.length<=e)return t;if(o.host&&(o.host=o.host.replace(/^www\./,""),t=n(o)),t.length<=e)return t;var h="";if(o.host&&(h+=o.host),h.length>=s)return o.host.length==e?(o.host.substr(0,e-r.length)+r).substr(0,e):i(h,s).substr(0,e);var l="";if(o.path&&(l+="/"+o.path),o.query&&(l+="?"+o.query),l){if((h+l).length>=s){if((h+l).length==e)return(h+l).substr(0,e);var u=s-h.length;return(h+i(l,u)).substr(0,e)}h+=l}if(o.fragment){var g="#"+o.fragment;if((h+g).length>=s){if((h+g).length==e)return(h+g).substr(0,e);var m=s-h.length;return(h+i(g,m)).substr(0,e)}h+=g}if(o.scheme&&o.host){var f=o.scheme+"://";if((h+f).length<s)return(f+h).substr(0,e)}if(h.length<=e)return h;var p="";return s>0&&(p=h.substr(-1*Math.floor(s/2))),(h.substr(0,Math.ceil(s/2))+r+p).substr(0,e)},t});