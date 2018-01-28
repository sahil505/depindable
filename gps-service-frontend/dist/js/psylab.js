
var app = angular.module('app', ['ngMaterial','ngRoute', 'ngAnimate','ngMessages','jkAngularRatingStars']);


var URL_PREFIX='http://10.194.25.141:8080/';
var CLIENT_ID = "bSRfOQprkYdBY1nniQaXmXyZERbgGDAUaXhlzA3i";
var
CLIENT_SECRET = "hsRtJ7L0QHDPgrJmyIYgjfxL24ym8rhJXk7PUfuhJm6hH3rmwgcGPrat25dITDr1u2BVbHAQ8ISV4YkIhPtgATezb806Hb1GBlQUnlDVFiLfOxQU0jzwprq7NfxyXEAp";
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
  }).when("/mypinlocation", {
    controller: "MypinmapCtrl",
    templateUrl: "templates/mypinsonmap.html"
  }).otherwise({
    controller: "MainCtrl",
    templateUrl: "templates/error.html"
  });
}]);
// app.run(["$rootScope", "$location", function ($rootScope, $location) {
//     $rootScope.$on("$routeChangeSuccess", function (userInfo) {
//         // console.log(userInfo);
//     });
//     $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
//         if (eventObj.authenticated === false) {
//             $location.path("/");
//         }
//     });
// }]);


app.factory("Auth", ["$http","$q","$window",function ($http, $q, $window) {
    var userFullDetails;
    function login(user) {
        var url="http://10.194.25.141:8080/login/";
        var deferred = $q.defer();
        $http({
             method: "POST",
            //  transformRequest: function(obj) {
            //     var str = [];
            //     for(var p in obj)
            //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //     return str.join("&");
            //  },
             data: {
                'email':user,
                'password':'batman25',
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'grant_type': 'client_credentials'


             },
             headers: {
                'Content-Type': 'application/json'
              },
             url: url,
           }).then(function successCallback(response) {
             isLoading = false;
            //  console.log(response);
             userFullDetails = {
                 token: response.data.access_token,
                 email: response.data.email,
                 id: response.data.user_id,
                 name:response.data.name,
             };
             $window.localStorage.userFullDetails = JSON.stringify(userFullDetails);
             deferred.resolve(response);
           }, function errorCallback(error) {
             deferred.reject(error);
         });
         return deferred.promise;
    };

    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL_PREFIX+"logout/",
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization':'Token '+userFullDetails.access_token
            }
        }).then(function successCallback(response) {
            // console.log(result);
            userFullDetails = null;
            $window.localStorage.userFullDetails = null;
            deferred.resolve(result);
        }, function errorCallback(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function getuserFullDetails() {
        return userFullDetails;
    }
    function init() {
        if ($window.localStorage.userFullDetails) {
            userFullDetails = JSON.parse($window.localStorage.userFullDetails);
        }
    }
    init();
    return {
        login: login,
        logout: logout,
        getuserFullDetails: getuserFullDetails
    };
}]);

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

app.controller('MapCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout) {


  if($window.localStorage.userFullDetails){
    $scope.userDetails = JSON.parse($window.localStorage.userFullDetails);
    console.log($scope.userDetails.token);
    var AUTHORIZATION = 'Bearer ' +  $scope.userDetails.token;
    var FB_ID = $scope.userDetails.id;
    var USER_NAME = $scope.userDetails.name;

    // $scope.islogin="true";
  }
  var item = {
          coordinates: [40.6423926, -97.3981926]
      };

      var woa = {
          city: 'This is my marker. There are many like it but this one is mine.'
      };

        $scope.currentlocation = {
          lat: 23.6,
          lng: 77.2
        };


      $scope.geocoder =  new google.maps.Geocoder;
      $scope.infowindow = new google.maps.InfoWindow;

      $scope.getCurr = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            var  mapcenterpos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };


              $window.localStorage.currentlocation = JSON.stringify(mapcenterpos);
              $scope.$apply(function() {
                  $scope.mycurrlocation=mapcenterpos;
                  $scope.infowindow.setPosition($scope.mycurrlocation);
                  $scope.infowindow.setContent('This is your current locations');
                  $scope.infowindow.open($scope.mymapdetail);
              });

              // console.log(pos);
            }, function() {
              handleLocationError(true, infoWindow, map.getCenter());
            });
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
          }
      }

      //set up map
      if($window.localStorage.currentlocation){
        $scope.mycurrlocation = JSON.parse($window.localStorage.currentlocation);
      }
      else{
        $scope.mycurrlocation = {lat:28.544976,lng:77.192628};
      }

      console.log($scope.currentlocation);
      var mapOptions = {
          zoom:14,
          center:$scope.mycurrlocation,
          mapTypeId: google.maps.MapTypeId.TERRAIN
      };



      // console.log(document.getElementById('map'));

      $scope.mymapdetail = new google.maps.Map(document.getElementById('map'), mapOptions);

      $scope.initmymap = function(){
        $scope.mymapdetail = new google.maps.Map(document.getElementById('map'), mapOptions);
        console.log("initing map ....");
      }

      // Listen for click on map
      google.maps.event.addListener($scope.mymapdetail, 'click', function(event){
        // Add marker
        addMarker({coords:event.latLng});
      });

      if($window.localStorage.currentlocation){
        $scope.mycurrlocation = JSON.parse($window.localStorage.currentlocation);
        $scope.infowindow.setPosition($scope.mycurrlocation);
        $scope.infowindow.setContent('This is your current locations');
        $scope.infowindow.open($scope.mymapdetail);
      }

      // console.log(mapcenterpos);



      $scope.markedPins = [];
      function addMarker(props) {
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
          $scope.showAdvanced($rootScope.user);
          $rootScope.latlngplacename = temp;

        });



      }




      $scope.showAdvanced = function(user, ev) {

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

          $scope.testname = $rootScope.latlngplacename.geo_address;
          $scope.hide = function() {
            $mdDialog.hide();
          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          // $scope.answer = function(answer) {
          //   $mdDialog.hide(answer);
          // };

          $scope.answer = function(user, placename){
            console.log(user);
            console.log(placename);
            console.log(AUTHORIZATION);
            $scope.testname = $rootScope.latlngplacename.geo_address;

            // $scope.user.placename = $rootScope.latlngplacename.geo_address,
            $http({
              url:URL_PREFIX+"api/pinlocations/",
              method:"POST",
              headers:{
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + JSON.parse($window.localStorage.userFullDetails).token
              },
              data:{
                'location_name':placename,
                'lat':$rootScope.latlngplacename.lat,
                'lng':$rootScope.latlngplacename.lng,
                'remarks':user.remarks,
                'rating':user.rating,
                'fb_id':FB_ID,
                'friend_name':JSON.parse($window.localStorage.profiledata).name,
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

  // $scope.getFriendPins = function(){
  //   $http({
  //     url:URL_PREFIX+"api/friendspins/",
  //     method:"GET",
  //     headers:{
  //       'Content-Type': 'application/json; charset=UTF-8',
  //       'Authorization': AUTHORIZATION
  //     }
  //   }).then(function sucessCallback(response) {
  //
  //     console.log(response);
  //   }, function errorCallback(error) {
  //     console.log(error);
  //
  //   });
  // }
});

app.controller('MypinmapCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout, Auth, $mdToast) {

  console.log(document.getElementById('map'));


    console.log($location.search());

    $scope.current_cat = $location.search().category;

    $scope.checkZomatoBtn = function(){
      if($scope.current_cat =='restaurant' || $scope.current_cat== 'bar' || $scope.current_cat =='bakery' || $scope.current_cat=='cafe'){
        return true;
      }
      else {
        return false;
      }
    }
    var infoWindow = new google.maps.InfoWindow;
    $scope.infoWindow = new google.maps.InfoWindow;
    $scope.geocoder =  new google.maps.Geocoder;
    var center = {}
    center['lat'] = parseFloat($location.search().lat);
    center['lng'] = parseFloat($location.search().lng);
    console.log(center);
    $scope.mypinpos = $location.search();
    var mapOptions = {
        zoom:16,
        center:{"lat":28.6101440496, "lng":77.1991252899},
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };


    console.log(mapOptions);
    $scope.newmap = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
      position:center,
      map:$scope.newmap,
    });

    // marker.setMap($scope.newmap);

    $scope.geocoder.geocode({'location': center}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0].formatted_address);

            infoWindow.setPosition(center);
            infoWindow.setContent(results[0].formatted_address);
            infoWindow.open($scope.newmap);
            $scope.newmap.setCenter(center);


          } else {
          console.log("no results found");
          }
        } else {
        console.log('Geocoder failed due to: ' + status);
        }
      });

      var service = new google.maps.places.PlacesService($scope.newmap);
      service.nearbySearch({
        location: center,
        radius: 500,
        type: [$scope.current_cat]
      }, callback);


    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    var infoWindow = new google.maps.InfoWindow;
    function createMarker(place) {
      var placeLoc = place.geometry.location;
      //change color by changing blue to gree, red, yellow
      var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      var marker = new google.maps.Marker({
        map: $scope.newmap,
        icon: image,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(place.name);
        infoWindow.open($scope.newmap, this);
      });
    }


    $scope.getZomatoData = function() {
      console.log($scope.loginfinished);
      $http({
        url:"https://developers.zomato.com/api/v2.1/geocode?lat="+center['lat']+"&lon="+center['lng'],
        method:"GET",
        headers:{
          'Content-Type': 'application/json; charset=UTF-8',
          'user-key': 'a2a13c8cc1e8e7f8dafd91e3f88eb4de'
        }
      }).then(function sucessCallback(response) {


        console.log(response.data);
        $scope.zomatoData = response.data;


      }, function errorCallback(error) {
          console.log(error);

      });
    }

});

app.controller('submitLocationCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout) {


// $scope.submitRating = function(user){
//   console.log(user);
// }
});
