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
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
          var  mapcenterpos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };


            $window.localStorage.currentlocation = JSON.stringify(mapcenterpos);

            // console.log(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      //set up map
      if($window.localStorage.currentlocation){
        $scope.mycurrlocation = JSON.parse($window.localStorage.currentlocation);
      }
      else{
        $scope.mycurrlocation = {lat:22.6139,lng:77.2090};
      }

      console.log($scope.currentlocation);
      var mapOptions = {
          zoom:14,
          center:$scope.mycurrlocation,
          mapTypeId: google.maps.MapTypeId.TERRAIN
      };



      // console.log(document.getElementById('map'));

      $scope.mymapdetail = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Listen for click on map
      google.maps.event.addListener($scope.mymapdetail, 'click', function(event){
        // Add marker
        addMarker({coords:event.latLng});
      });

      if($window.localStorage.currentlocation){
        $scope.mycurrlocation = JSON.parse($window.localStorage.currentlocation);
        $scope.infowindow.setPosition(  $scope.mycurrlocation);
        $scope.infowindow.setContent('This is your current locations');
        $scope.infowindow.open($scope.mymapdetail);
      }

      // console.log(mapcenterpos);



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

          $scope.answer = function(user){

            console.log(AUTHORIZATION);
            $scope.testname = $rootScope.latlngplacename.geo_address;

            $scope.user.placename = $rootScope.latlngplacename.geo_address,
            $http({
              url:URL_PREFIX+"api/pinlocations/",
              method:"POST",
              headers:{
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': AUTHORIZATION
              },
              data:{
                'location_name':$rootScope.latlngplacename.geo_address,
                'lat':$rootScope.latlngplacename.lat,
                'lng':$rootScope.latlngplacename.lng,
                'remarks':user.remarks,
                'rating':user.rating,
                'fb_id':FB_ID,
                'friend_name':USER_NAME,
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

  $scope.getFriendPins = function(){
    $http({
      url:URL_PREFIX+"api/friendspins/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': AUTHORIZATION
      }
    }).then(function sucessCallback(response) {

      console.log(response);
    }, function errorCallback(error) {
      console.log(error);

    });
  }
});
