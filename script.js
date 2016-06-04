var map;
var markerArray= [];
var infowindow;
var pyrmont = {lat: 40.720029, lng: -74.006936};


function initMap() {


  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });
  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    markerBounds = new google.maps.LatLngBounds();
    geocodeAddress(geocoder, map);
  });

  var markerBounds = new google.maps.LatLngBounds();
  function geocodeAddress(geocoder) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      var newCenter= results[0].geometry.location;
      if (status === google.maps.GeocoderStatus.OK) {
        service.nearbySearch({
          location: newCenter,
          radius: 2500,
          //rankBy: google.maps.places.RankBy.DISTANCE,
          keyword: ['coffee shop']
        }, callback);

      }

      else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }
      markerArray = [];
      for (i = 0; i < results.length; i++) {
        createMarker(results[i]);
        console.log(results[i].place_id);



      }

    }

  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    markerArray.push(marker);

    markerBounds.extend(marker.position);
    map.fitBounds(markerBounds);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

}
//firebase

var database = firebase.database().ref('list');
