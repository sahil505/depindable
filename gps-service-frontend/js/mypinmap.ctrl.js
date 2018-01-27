app.controller('MypinmapCtrl', function($scope, $rootScope, $location, $mdDialog, $http, $window, $mdSidenav, $timeout, Auth, $mdToast) {

  console.log(document.getElementById('map'));


    console.log($location.search());

    var infoWindow = new google.maps.InfoWindow;
    $scope.infoWindow = new google.maps.InfoWindow;
    $scope.geocoder =  new google.maps.Geocoder;
    var center = {}
    center['lat'] = parseFloat($location.search().lat);
    center['lng'] = parseFloat($location.search().lng);
    console.log(center);
    $scope.mypinpos = $location.search();
    var mapOptions = {
        zoom:14,
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

});
