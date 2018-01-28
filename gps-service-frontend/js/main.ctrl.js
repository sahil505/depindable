app.controller('MainCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout, Auth, $mdToast) {


  if($window.localStorage.userFullDetails){
    $scope.userDetails = JSON.parse($window.localStorage.userFullDetails);
    console.log($scope.userDetails.token);
    var AUTHORIZATION = 'Bearer ' +  $scope.userDetails.token;
    var FB_ID = $scope.userDetails.id;
    var USER_NAME = $scope.userDetails.name;

    // $scope.islogin="true";
  }

// var isLogin = false;
$scope.logInUser=function (user) {
  // console.log("trying login");
  // console.log(user);
  $scope.isLoadinglogin = true;
  Auth.login(user).then(function(response) {

  response = JSON.parse(JSON.stringify(response));
  // console.log(response);
  console.log(response.data.access_token);
  $scope.isLoadinglogin = false;
  $scope.loginfinished = true;
  $scope.getmyPins(response.data.access_token);
  $scope.getfriendsPins(response.data.access_token);

  // $location.path('/');
  // $mdToast.show(
  //   $mdToast.simple()
  //   .textContent(response.data.message)
  //   .position('bottom right')
  //   .hideDelay(3000)
  // );


}, function (error) {
  // console.log(error);
  error = JSON.parse(JSON.stringify(error));
  $scope.isLoadinglogin = false;

    // $mdToast.show(
    //   $mdToast.simple()
    //   .textContent(error.data.message)
    //   .position('bottom right')
    //   .hideDelay(5000)
    // );


});
};

var temp1 = {};
$scope.SignUp = function(){

  // console.log("SignUp....");
  // tempimg =
  // console.log($scope.friendsimg);

  for(var k=0; k<$scope.friendsdata.data.length; k++){

    // temp1[($scope.friendsdata.data[k].id).toString()]['name'] = $scope.friendsdata.data[k].name;

    temp2= {}

    temp2['name'] = $scope.friendsdata.data[k].name;
    temp2['img_url'] = $scope.friendsdata.data[k].img_url;

    temp1[($scope.friendsdata.data[k].id).toString()]= temp2;

    // console.log(temp1);
  }

  // console.log(temp1);


  $http({
    url:URL_PREFIX+'register/',
    method:"POST",
    headers:{
      'Content-Type': 'application/json; charset=UTF-8'
    },
    data:{
        'email':$scope.profiledata.email,
        'name':$scope.profiledata.name,
        'user_image_url':$scope.profiledata.picture.data.url,
        'friends':temp1,
        'password':"batman25",
        'user_id':$scope.profiledata.id

    }
  }).then(function sucessCallback(response) {
    // console.log(temp1);
    if (response.status===200){
      // $location.path("/login");
      // $mdToast.show(
      //   $mdToast.simple()
      //   .textContent('User created sucessfully!')
      //   .position('bottom right')
      //   .hideDelay(3000)
      // );
    }
  }, function errorCallback(error) {

    // console.log(temp1);
    if (error.status===302){
      // $mdToast.show(
      //   $mdToast.simple()
      //   .textContent('Something went wrong, Please try again!')
      //   .position('bottom right')
      //   .hideDelay(3000)
      // );
    }
  });
  }

$scope.getmyPins = function(token){
  console.log($scope.loginfinished);
  $http({
    url:URL_PREFIX+"api/mypins/",
    method:"GET",
    headers:{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer '+token
    }
  }).then(function sucessCallback(response) {

    $scope.mypinsdata = response.data;
  }, function errorCallback(error) {
      console.log(error);

  });
}

$scope.getfriendsPins = function(token){
  console.log($scope.loginfinished);
  $http({
    url:URL_PREFIX+"api/friendspins/",
    method:"GET",
    headers:{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer '+token
    }
  }).then(function sucessCallback(response) {

    $scope.friendspinsdata = response.data;
    // console.log($scope.friendspinsdata);


  }, function errorCallback(error) {
      console.log(error);

  });
}

$scope.islogin = false;

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '211179206119669',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });


  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function statusChangeCallback (response) {
    if (response.status === 'connected') {
      // console.log("Logged in and authenticated!");
      $scope.$apply(function() {
          $scope.islogin=true;
      });
      // console.log($scope.islogin);
      testAPI();


    } else {
      // console.log("Cannot log in. Not Authenticated!\nPlease login to facebook to continue.");

    }
  }






  function logout() {
    FB.logout(function(response) {

    })
  }

  $scope.logout1 = function(){
    $window.localStorage.clear();
    FB.logout(function(response) {
      if(response && !response.error){
        location.reload();
      }
    })
    // console.log("logout");
  }

  function testAPI() {
    FB.api('/me?fields=name,about,email,location,birthday,friendlists{name},picture', function (response) {
      if(response && !response.error) {

        $scope.$apply(function() {
            $scope.profiledata=response;
            $window.localStorage.profiledata = JSON.stringify(response);
        });

        // console.log($scope.profiledata);

      }

      FB.api('/me/friends?limit=500', function (response) {
        if(response && !response.error) {
          $scope.$apply(function() {
              $scope.friendsdata=response;
              $window.localStorage.friendsdata = JSON.stringify(response);
          });

          // console.log($scope.friendsdata);

        }

        if(response && !response.error) {
          $scope.friendsdata.data;
          $scope.friendsimg=[];
            for (let i in response.data){
              if (response.data[i].id){
                var id = response.data[i].id;
                FB.api('/'+id+'/picture', function(response){
                  if(response && !response.error) {
                    // console.log(response.data.url);
                    $scope.$apply(function() {

                        $scope.friendsimg.push(response.data.url);
                        // console.log($scope.friendsimg);
                        $window.localStorage.friendsimg = JSON.stringify($scope.friendsimg);

                    });

                  }
                })
              }
            }


          // console.log(response);

          $scope.SignUp();
          // console.log($scope.newfriends);
          $scope.logInUser($scope.profiledata.email);


        }
      })
    })
  }




  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };

  $rootScope.loadingComp=true;
    $timeout(function() {
  }, 0);



  $scope.getupdatedData = function(){
    console.log("updating ..data");


    if($window.localStorage.profiledata){
      $scope.profiledata = JSON.parse($window.localStorage.profiledata);
        // $scope.getmyPins();
      console.log($scope.userprofiledata);
      $scope.islogin = "true";
    }
    if($window.localStorage.friendsdata){
      $scope.friendsdata = JSON.parse($window.localStorage.friendsdata);
    }
    if($window.localStorage.friendsimg){
      $scope.friendsimg = JSON.parse($window.localStorage.friendsimg);
    }
  }



  $scope.mypinonMap = function(lat,lng, ev) {
    console.log(lat);
    console.log(lng);
    $rootScope.mypinpos = {"lat":lat, "lng":lng}
      $mdDialog.show({
        controller: mypinonMapController,
        templateUrl: '../templates/mypinsonmap.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };

    function mypinonMapController($scope, $mdDialog) {

      $rootScope.mypinpos = $rootScope.mypinpos;
      $scope.initdialog = function(data){
        console.log(data);
        // console.log(document.getElementById('map'));
        console.log("init.....");
      }
      // $scope.mypinpos = $rootScope.mypinpos;
      // var mapOptions = {
      //     zoom:14,
      //     center:$scope.mypinpos,
      //     mapTypeId: google.maps.MapTypeId.TERRAIN
      // };
      //
      //
      //
      // $scope.newmap = new google.maps.Map(document.getElementById('mypinmap'), mapOptions);
      //
      //   infoWindow.setPosition($scope.mypinpos);
      //   infoWindow.setContent('Location found.');
      //   infoWindow.open($scope.newmap);

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

    }

    $scope.updatepindata = function(){
      if($window.localStorage.userFullDetails){
        $scope.getmyPins(JSON.parse($window.localStorage.userFullDetails).token);
        $scope.getfriendsPins(JSON.parse($window.localStorage.userFullDetails).token);
      }
    }

    $scope.filterFriendsPins = function(data){
      // console.log(data);

      //
      // if(data == undefined){
      //   data  = datatemp;
      // }


      if(data==undefined){
        $mdToast.show(
          $mdToast.simple()
          .textContent("Please enter a filter type :)")
          .position('bottom right')
          .hideDelay(3000)
        );
      }
      else{
        datatemp = {}
        if(data.category){
          datatemp['category'] = data.category;
        }
        else{
          datatemp['category'] = " ";
        }

        if(data.placename){
          datatemp['place_name'] = data.placename;
        }
        else{
          datatemp['place_name'] = " ";
        }

        if(data.friend_name){
          datatemp['friend_name'] = data.friend_name;
        }
        else{
          datatemp['friend_name'] = " ";
        }





        $http({
          url:URL_PREFIX+"api/filterpins/",
          method:"POST",
          headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + JSON.parse($window.localStorage.userFullDetails).token
          },
          data:datatemp
        }).then(function sucessCallback(response) {

          $scope.friendspinsdata = response.data;
        }, function errorCallback(error) {
            console.log(error);

        });
      }


    }


    $scope.filterMyPins = function(data){
      // console.log(data);

      //
      // if(data == undefined){
      //   data  = datatemp;
      // }


      if(data==undefined){
        $mdToast.show(
          $mdToast.simple()
          .textContent("Please enter a filter type :)")
          .position('bottom right')
          .hideDelay(3000)
        );
      }
      else{
        datatemp = {}

        if(data.category){
          datatemp['category'] = data.category;

        }
        else{
          datatemp['category'] = " ";
        }

        if(data.placename){
          datatemp['place_name'] = data.placename;

        }
        else{
          datatemp['place_name'] = " ";
        }

          console.log(datatemp);

        $http({
          url:URL_PREFIX+"api/mypins/",
          method:"POST",
          headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + JSON.parse($window.localStorage.userFullDetails).token
          },
          data:datatemp
        }).then(function sucessCallback(response) {

          $scope.mypinsdata = response.data;
        }, function errorCallback(error) {
            console.log(error);

        });
      }


    }
});
