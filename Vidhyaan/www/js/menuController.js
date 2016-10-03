angular.module('Menus.controllers', ['ngCordova'])

.controller('SideMenuCtrl', function($scope, $rootScope, $timeout, $stateParams, $ionicSideMenuDelegate,$state) {
    /*!
   * Expects number from 0.0 -> 1.0
   * Returns absolute value
   * 
   * @param {Number}
   * @return {Number}
   */
    //var groups={};
    var groupcnt = 0;
    console.log("inside 456");
    var priv = {};
    var sub = $rootScope.GetDocument("SubscriberInfo");
    priv = sub.DocumentBody.ApplicationSpecificData.previlageLevels;
 
    var subscribedchannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;
    var pro = $rootScope.GetDocument("ProgramInfo");
    var orid = sub.DocumentHeader.OrganizationId;
    var groups = pro.DocumentBody.ApplicationsSpecificData.feedPrograms;
    console.log(groups);
    $scope.groups = [];
    console.log("groups:", groups);
    $scope.menulist = {};
    $scope.leftTotNotiCount = 0;
    var k = 0;
    var language = $rootScope.Language.toString();
    var SubChannels = sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;

    var org = $rootScope.GetDocument("OrganizationInfo");

    $scope.orgLogo = org.DocumentBody.ApplicationSpecificData.organizationLogo;

    console.log("logo:",$scope.orgLogo);

    window.localStorage.setItem("orgLogo",$scope.orgLogo);


    console.log("new Language ", language);
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].mId != undefined)
            if (priv[groups[i].mId] == undefined)
                continue;
                $scope.groups[k] = {
            name: groups[i].mName[language] == undefined ? groups[i].mName["0"] : groups[i].mName[language],
            icon: groups[i].mIcon,
            ref: groups[i].mRef,
            id: groups[i].mId,
            runson: groups[i].mRunsOn,
            cnt: $rootScope.NotificationCounts["Nc_" + groups[i].mId] == undefined ? "" : $rootScope.NotificationCounts["Nc_" + groups[i].mId],
            items: []
        };
        if( $scope.groups[k].cnt>0)
        $scope.leftTotNotiCount = $scope.leftTotNotiCount +  $scope.groups[k].cnt;

        if (groups[i].mId != undefined) {
            $scope.menulist[groups[i].mId] = $scope.groups[k];
        }
        if (groups[i].mItems !== undefined) //sub items present;;
        {
            groupcnt = 0;
            l = 0;
            for (var j = 0; j < groups[i].mItems.length; j++) {
                if (priv[groups[i].mItems[j].mId] == undefined)
                    continue;// $scope.groups[i].items.push(groups.groups[i].mItems[j]);
                $scope.groups[k].items[l] = {
                    name: groups[i].mItems[j].mName[language] == undefined ? groups[i].mItems[j].mName["0"] : groups[i].mItems[j].mName[language],
                    icon: groups[i].mItems[j].mIcon,
                    ref: groups[i].mItems[j].mRef,
                    id: groups[i].mItems[j].mId,
                    runson: groups[i].mItems[j].mRunsOn,
                    type:"newsfeed",
                    cnt: $rootScope.NotificationCounts["Nc_" + groups[i].mItems[j].mId] == undefined ? "" : $rootScope.NotificationCounts["Nc_" + groups[i].mItems[j].mId],
                };
                $scope.menulist[groups[i].mItems[j].mId] = $scope.groups[k].items[l];
                if ($scope.groups[k].items[l].cnt > 0)
                    groupcnt = groupcnt + $scope.groups[i].items[j].cnt;
                l++;
            }
            $scope.groups[k].cnt = groupcnt;
            if (l <= 0)
                k--;
            //remove parent element;;
        }
        k++;
    }

    if($scope.leftTotNotiCount > 0)
    {

         var ret= [];
         ret[0] = "left";
         ret[1] = "1";
         $rootScope.$broadcast('NotificationBadgeEvent', [ret]);
    }



    //end of main for loop;;
    $rootScope.$on('NotificationEvent', function(event, data) {
        console.log("Notification Event Fired");
        console.log(data[0]);
        console.log(data[1]);
        //$scope.$digest();
        //$scope.groups[0].cnt =10;
        if ($scope.menulist[data[0]] != undefined)
          {
            $scope.menulist[data[0]].cnt = data[1];
            if(data[2] == true) //increment
            $scope.leftTotNotiCount = $scope.leftTotNotiCount + 1;
            else
            $scope.leftTotNotiCount = $scope.leftTotNotiCount - 1;

            if($scope.leftTotNotiCount <0 ) $scope.leftTotNotiCount = 1;

          var ret= [];
          ret[0] = "left";

         if($scope.leftTotNotiCount < 0) $scope.leftTotNotiCount = 0;

           if($scope.leftTotNotiCount > 0) 
            ret[1] = "1";
            else
            ret[1] = "0";

            $rootScope.$broadcast('NotificationBadgeEvent', [ret]);
          }



    });

    $scope.$on('Notifications1Ready', function(event, data) {
        console.log("Notification Ready Fired");

        console.log(data[0]);
        var tg = data[0];
        for (var i = 0; i < tg.length; i++) {
            var tag = "Nc_" + tg[i];
            if ($scope.menulist[tg[i]] != undefined)
            {
                $scope.menulist[tg[i]].cnt = $rootScope.NotificationCounts[tag];
                $scope.leftTotNotiCount = $scope.leftTotNotiCount + $scope.menulist[tg[i]].cnt;
            }

            
        }

        console.log("TotNotiCounts: " , $scope.leftTotNotiCount);

        if($scope.leftTotNotiCount < 0) $scope.leftTotNotiCount = 0;

           var ret= [];
         ret[0] = "left";

         if($scope.leftTotNotiCount < 0) $scope.leftTotNotiCount = 0;

           if($scope.leftTotNotiCount > 0) 
            ret[1] = "1";
            else
            ret[1] = "0";

            $rootScope.$broadcast('NotificationBadgeEvent', [ret]);


    });
    $scope.toggleGroup = function(group) {
        //console.log("toggle toggle");
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null ;
        } else {
            $scope.shownGroup = group;
        }
    }
    ;
    $scope.isGroupShown = function(group) {
        //console.log("shown shown");
        return $scope.shownGroup === group;
    }
    ;
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
        return ( 1 - Math.abs(ratio)) ;
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
    $scope.itemclick = function(selItem) {
        $rootScope.LoadEditorControls("default");
        $rootScope.AppUserInformation.ProgramType = selItem.type;
        $rootScope.AppUserInformation.SelProgram = selItem.id;
        $rootScope.AppUserInformation.SelProgName = selItem.name;
        console.log("clicked Id : ", $rootScope.AppUserInformation.SelProgram);

        if(priv[selItem.id].indexOf("w")>=0) 
        $rootScope.AppUserInformation.WritePriv = true;
        else
        $rootScope.AppUserInformation.WritePriv = false;

        if(priv[selItem.id].indexOf("x")>=0) 
        $rootScope.AppUserInformation.XPriv = true;
        else
        $rootScope.AppUserInformation.XPriv = false;
        
        $rootScope.AppUserInformation.runson = $rootScope.GetProgramChannels(selItem.runson, SubChannels);
        console.log("runs on", $rootScope.AppUserInformation.runson);
        console.log($rootScope.AppUserInformation.SelProgName);

       $rootScope.setAppState($state.current);
        
        $rootScope.$broadcast('FeedProgramEvent', []);

        $state.go(selItem.ref, {}, {
        reload: true
    });
    }
})


.controller('RightMenuCtrl', function($scope, $stateParams, $rootScope,$state) {
    console.log("inJquery start");
    var priv = {};
    $scope.menulist = {};
    $scope.rightTotNotiCount = 0;
    var Sub = $rootScope.GetDocument("SubscriberInfo");
    console.log("Subscriber : ", Sub);
    priv = Sub.DocumentBody.ApplicationSpecificData.previlageLevels
    /*
  jQuery.getJSON('json/subscriberInfo.json', function(data) {

   priv = data.DocumentBody.ApplicationSpecificData.previlageLevels;
   console.log("priv:" ,priv);
  });
   
 */
    ///
    //jQuery.getJSON('json/ProgramInfo.json', function(data) {
    // console.log("inJquery Right");
    var pro = $rootScope.GetDocument("ProgramInfo");
    var items = pro.DocumentBody.ApplicationsSpecificData.appPrograms;
    console.log(items);
    $scope.rightItems = [];
    var lang = $rootScope.Language.toString();
    var k = 0;
    var SubChannels = Sub.DocumentBody.ApplicationSpecificData.SubscribedChannels;
  
    for (var i = 0; i < items.length; i++) {
        if (priv[items[i].mId] == undefined)
            continue;//console.log(items[i].mId);
        $scope.rightItems[k] = {
            icon: items[i].mIcon,
            ref: items[i].mRef,
            text: items[i].mText[lang] == undefined ? items[i].mText["1"] : items[i].mText[lang],
            id: items[i].mId,
            runson: items[i].mRunsOn,
            type:items[i].mType,
            cnt: $rootScope.NotificationCounts["Nc_" + items[i].mId] == undefined ? "" : $rootScope.NotificationCounts["Nc_" + items[i].mId]
        };
        $scope.menulist[items[i].mId] = $scope.rightItems[k];
       

        if($scope.rightItems[k].cnt >0)
        $scope.rightTotNotiCount = $scope.rightTotNotiCount + $scope.rightItems[k].cnt;
        k++;

    }

     if($scope.rightTotNotiCount > 0)
    {

         var ret= [];
         ret[0] = "right";
         ret[1] = "1";
         $rootScope.$broadcast('NotificationBadgeEvent', [ret]);
    }

    $scope.itemclick = function(selItem) {
        console.log(selItem.id);
        $rootScope.LoadEditorControls(selItem.type);
        $rootScope.AppUserInformation.ProgramType = selItem.type;
        $rootScope.AppUserInformation.SelProgram = selItem.id;
        $rootScope.AppUserInformation.SelProgName = selItem.text;
        if(priv[selItem.id].indexOf("w")>=0) 
        $rootScope.AppUserInformation.WritePriv = true;
        else
        $rootScope.AppUserInformation.WritePriv = false;

        if(priv[selItem.id].indexOf("x")>=0) 
        $rootScope.AppUserInformation.XPriv = true;
        else
        $rootScope.AppUserInformation.XPriv = false;

        $rootScope.setAppState($state.current);
        
        console.log("clicked Id : ", $rootScope.AppUserInformation.SelProgram);
        $rootScope.AppUserInformation.runson = $rootScope.GetProgramChannels(selItem.runson, SubChannels);
        console.log("runs on", $rootScope.AppUserInformation.runson);
        console.log($rootScope.AppUserInformation.SelProgName);

        $state.go(selItem.ref, {}, {
        reload: true
        });

        //$rootScope.IncNotificationCounts("2-npsbsk");
        //$rootScope.MarkAsRead("2-npsbsk");
    }
    $rootScope.$on('NotificationEvent', function(event, data) {
        console.log("Notification Event Fired Right");
        console.log("notiEvent" , data[0]);
        //programId;;
        console.log("notiEvent", data[1]);
        //notification count;;
        if ($scope.menulist[data[0]] != undefined)
        {
            $scope.menulist[data[0]].cnt = data[1];

            if(data[2] == true) //increment
            $scope.rightTotNotiCount = $scope.rightTotNotiCount + 1;
            else
            $scope.rightTotNotiCount = $scope.rightTotNotiCount - 1;

            

         var ret= [];
         ret[0] = "right";

         if($scope.rightTotNotiCount < 0) $scope.rightTotNotiCount = 0;

           if($scope.rightTotNotiCount > 0) 
            ret[1] = "1";
            else
            ret[1] = "0";

            $rootScope.$broadcast('NotificationBadgeEvent', [ret]);

        }
    });

    $scope.$on('Notifications2Ready', function(event, data) {
        console.log("Notification Ready Fired Right");
        console.log(data[0]);
        var tg = data[0];
        for (var i = 0; i < tg.length; i++) {
            var tag = "Nc_" + tg[i];
            if ($scope.menulist[tg[i]] != undefined)
             {
                $scope.menulist[tg[i]].cnt = $rootScope.NotificationCounts[tag];

                 $scope.rightTotNotiCount = $scope.rightTotNotiCount + $scope.menulist[tg[i]].cnt;
             }



           // console.log($rootScope.NotificationCounts[tg[i]]);
        }

         var ret= [];
         ret[0] = "right";

         if($scope.rightTotNotiCount < 0) $scope.rightTotNotiCount = 0;

           if($scope.rightTotNotiCount > 0) 
            ret[1] = "1";
            else
            ret[1] = "0";

            $rootScope.$broadcast('NotificationBadgeEvent', [ret]);
    })

})

.controller('menuBarCtrl', function($scope, $rootScope,$state) {



//$rootScope.$broadcast('NotificationsReady', [ret]);

})

.controller('popOverCtrl', function($scope, $rootScope,$state,$ionicModal) {
    console.log("inJquery start");
    jQuery.getJSON('json/popOverMenu.json', function(data) {
        console.log("inJquery PopOver");
        var items = data;
        console.log(items);
        $scope.popItems = [];
        var lang = $rootScope.Language.toString();
        for (var i = 0; i < items.items.length; i++) {
            $scope.popItems[i] = {
                icon: items.items[i].mIcon,
                ref: items.items[i].mRef,
                text: items.items[i].mText[lang] == undefined ? items.items[i].mText["0"] : items.items[i].mText[lang]
            };
        }
        console.log(items.items[0].mIcon);
    })


function HandleRefer()
{

$scope.reference = {
     name : "",
     contact : "",
     message : ""
}


    $scope.OnOkClick = function()
    {
       $scope.modal.hide();
        $rootScope.ShowToast("Message Sent", false);
    }

     $scope.OnCancelClick = function()
    {
       $scope.modal.hide();
        //$rootScope.ShowToast("Message Sent", false);
    }

$ionicModal.fromTemplateUrl('templates/refer.html', {
  scope: $scope,
  animation: 'slide-in-up',
  
}).then(function(modal) {
  console.log("Modal");
  $scope.modal = modal;
  $scope.modal.show();
});  

}


$scope.onPopOverClick= function(selItem)
{
//ng-href="{{items.ref}}"
$rootScope.setAppState($state.current);
$rootScope.AppUserInformation.SelProgName = selItem.text;

if(selItem.ref == "refer")
{

HandleRefer();
return;
}

$state.go(selItem.ref, {}, {
        reload: true
    });

}

});



