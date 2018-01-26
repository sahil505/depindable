
var app = angular.module('app', ['ngMaterial','ngRoute', 'ngAnimate','ngMessages']);


URL_PREFIX="http://localhost:8080/"
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('teal', {
   'default': '400', // by default use shade 400 from the pink palette for primary intentions
   'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
   'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
   'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
  })
  .accentPalette('orange');
});
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    controller: "MainCtrl",
    templateUrl: "templates/home.html"
  }).when("/pinlocation", {
    controller: "MapCtrl",
    templateUrl: "templates/pinlocation.html"
  }).otherwise({
    controller: "MainCtrl",
    templateUrl: "templates/error.html"
  });
}]);
app.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        // console.log(userInfo);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/");
        }
    });
}]);

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

app.controller('MapCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout) {


  var item = {
          coordinates: [40.6423926, -97.3981926]
      };

      var woa = {
          city: 'This is my marker. There are many like it but this one is mine.'
      };


      //set up map
      var mapOptions = {
          zoom:14,
          center:{lat:28.6139,lng:77.2090},
          mapTypeId: google.maps.MapTypeId.TERRAIN
      };

      // console.log(document.getElementById('map'));

      $scope.mymapdetail = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Listen for click on map
      google.maps.event.addListener($scope.mymapdetail, 'click', function(event){
        // Add marker
        addMarker({coords:event.latLng});
      });

      $scope.geocoder =  new google.maps.Geocoder;
      $scope.infowindow = new google.maps.InfoWindow;

      $scope.markedPins = [];
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:$scope.mymapdetail,
        });
        console.log(marker.getPosition().lat());
        console.log(marker.getPosition().lng());


        var temp = {}
        temp['lat'] = marker.getPosition().lat();
        temp['lng'] = marker.getPosition().lng();
        var latlng = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};

          $scope.geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              $scope.infowindow.setContent(results[0].formatted_address);
              $scope.infowindow.open(map, marker);

              temp['geo_address'] = results[0].formatted_address;
            } else {
            console.log("no results found");
            }
          } else {
          console.log('Geocoder failed due to: ' + status);
          }
        });

        $scope.markedPins.push(temp);
        console.log($scope.markedPins);

        marker.addListener('click', function() {
          console.log("bhai ne click kiya bc");
          $scope.showAdvanced();
        });



      }





      $scope.showAdvanced = function(ev) {
          $mdDialog.show({
            controller: DialogController,
            templateUrl: '../templates/locationform.html',
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

        function DialogController($scope, $mdDialog) {
          $scope.hide = function() {
            $mdDialog.hide();
          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };

          $scope.submitRating = function(user){
            console.log(user);


            $http({
              url:URL_PREFIX+"api/pinlocations/",
              method:"POST",
              headers:{
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization':'Bearer JToTmVVMQtYwVVRwBrJ5maCGiiKXEr'
              },
              data:{
                'location_name':user.placename,
                'lat':"23.5435434",
                'lng':"76.42334",
                'remarks':user.remarks,
                'rating':user.rating,
                'category':user.category
              }
            }).then(function sucessCallback(response) {

              console.log(response);
              $scope.hide();
            }, function errorCallback(error) {
                console.log(error);

            });
          }
        }

});

app.controller('submitLocationCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout) {


// $scope.submitRating = function(user){
//   console.log(user);
// }
});
