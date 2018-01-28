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
