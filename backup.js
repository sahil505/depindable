<script>
function initMap(){
  // Map options
  var options = {
    zoom:8,
    center:{lat:28.6139,lng:77.2090}
  }
  // New map
  var map = new google.maps.Map(document.getElementById('map'), options);

  var marker = new google.maps.Marker({
    position: {
      lat: 28.6139,
      lng: 77.2090
    },
    map: map,
    draggable: true
  });

  google.maps.event.addListener(marker, 'dragend', function() {
    console.log(marker.getPosition().lat());
    console.log(marker.getPosition().lng());
  });
}
</script>



function geocodeLatLng(obj) {
  var latlng = {lat: obj.lat, lng: obj.lng};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
