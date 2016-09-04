var map;
var markerArray= [];
var infowindow;
var pyrmont = {lat: 40.720029, lng: -74.006936};
var database = firebase.database().ref('stores');

$( document ).ready(function() {
	if($(".splash").is(":visible"))
	{
		$(".wrapper").css({"opacity":"0"});
	}
	$(".splash-arrow").click(function()
	{
		$(".splash").slideUp("800", function() {
			  $(".wrapper").delay(100).animate({"opacity":"1.0"},800);
        initMap();
        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15
        });
		 });
	});

});



function initMap() {



  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    markerBounds = new google.maps.LatLngBounds();
    geocodeAddress(geocoder, map);
  });

  document.getElementById('address').onkeydown = function(e){
   if(e.keyCode == 13){
     markerBounds = new google.maps.LatLngBounds();
     geocodeAddress(geocoder, map);
   }
};

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

        //createMarker(results[i]);
        databasecheck(results[i]);



    }

  }

}

function createMarker(place) {
  //var placeLoc = place.geometry.location;

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  markerArray.push(marker);

  markerBounds.extend(marker.position);
  map.fitBounds(markerBounds);
  var location = place.place_id;
  google.maps.event.addListener(marker, 'click', function() {
    database.once("value")
    .then(function(snapshot) {
      var hasStore = snapshot.child(location).child('name').val();

      var hasWifi = snapshot.child(location).child('wifi').val();
      var hasOutlet = snapshot.child(location).child('outlet').val();
			var hasRestroom = snapshot.child(location).child('restroom').val();
			var wifiCheck = '';
			var outletCheck = '';
			var restroomCheck = '';
			if (hasWifi) {
				wifiCheck = 'checked';
			}
			if (hasOutlet) {
				outletCheck = 'checked';
			}
			if (hasRestroom) {
				restroomCheck = 'checked';
			}
			console.log(hasStore);

			console.log(hasWifi);
			console.log(hasOutlet);
			console.log(hasRestroom);
      var contentString = '<h3>'+hasStore + '</h3>' + '<p><input type="checkbox" class="wifi" id=' + location +' ' + wifiCheck +'><label>Free Wifi</label></p>'+ '<p><input type="checkbox" class="outlet" id=' + location +' ' + outletCheck +'><label>Outlet</label></p>' + '<p><input type="checkbox" class="restroom" id=' + location +' ' + restroomCheck +'><label>Restroom</label></p>';
			infowindow.setContent(contentString);

    });

    //infowindow.setContent(place.name);
    infowindow.open(map, this);

  });

}


 function databasecheck(shop) {

     var storeLocation = shop.place_id;
     var storename = shop.name;
     database.once("value")
     .then(function(snapshot) {
       var hasStore = snapshot.hasChild(storeLocation);
       if (hasStore){
          createMarker(shop);

       }
       else {
         database.child(storeLocation).set({name: storename, wifi: false, outlet: false, restroom: false});
         createMarker(shop);
       }

  });

}

}

$(document).on('change', '.wifi', function() {
    // your code
    console.log($(this).attr('id'));
    var key = $(this).attr('id');
    var itemRef = database.child(key);
    itemRef.update({
      wifi: $(this).prop('checked')
    });
});

$(document).on('change', '.outlet', function() {
    // your code
    console.log($(this).attr('id'));
    var key2 = $(this).attr('id');
    var itemRef2 = database.child(key2);
    itemRef2.update({
      outlet: $(this).prop('checked')
    });
});
$(document).on('change', '.restroom', function() {
    // your code
    console.log($(this).attr('id'));
    var key3 = $(this).attr('id');
    var itemRef3 = database.child(key3);
    itemRef3.update({
      restroom: $(this).prop('checked')
    });
});


//firebase
