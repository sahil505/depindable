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
