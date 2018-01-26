app.controller('MainCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout) {


// var isLogin = false;

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
      console.log("Logged in and authenticated!");
      $scope.$apply(function() {
          $scope.islogin=true;
      });
      console.log($scope.islogin);
      testAPI();


    } else {
      console.log("Cannot log in. Not Authenticated!\nPlease login to facebook to continue.");

    }
  }






  function logout() {
    FB.logout(function(response) {

    })
  }

  $scope.logout1 = function(){
    FB.logout(function(response) {
      if(response && !response.error){
        location.reload();
      }
    })
    console.log("logout");
  }

  function testAPI() {
    FB.api('/me?fields=name,about,email,location,birthday,friendlists{name}', function (response) {
      if(response && !response.error) {

        $scope.$apply(function() {
            $scope.profiledata=response;
        });

        console.log($scope.profiledata);

      }

      FB.api('/me/friends?limit=500', function (response) {
        if(response && !response.error) {
          $scope.$apply(function() {
              $scope.friendsdata=response;
          });

          console.log($scope.friendsdata);

        }
      })
    })
  }




  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };

  $rootScope.loadingComp=true;
    $timeout(function() {
  }, 1000);



});
