mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg';

function setupMap(center) {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 13

  });

  function nightMap() {
    map.setStyle('mapbox://styles/mapbox/traffic-night-v2');
    $("#dark_theme").hide();
    $("#light_theme").show();
    $(".prayer-times-wrapper").css({ backgroundColor: 'black' });
    $(".calendar").css({ backgroundColor: 'black' });
    $('.local-time-wrapper').removeClass('day');
    $("#table").css({ backgroundColor: 'rgb(8, 8, 8)' });
  }

  function dayMap() {
    map.setStyle('mapbox://styles/mapbox/streets-v11');
    $("#dark_theme").show();
    $("#light_theme").hide();
    $(".prayer-times-wrapper").css({ backgroundColor: 'rgb(4, 4, 4)' });
    $(".calendar").css({ backgroundColor: 'rgb(27, 28, 32)' });
    $('.local-time-wrapper').addClass('day');
    $("#table").css({ backgroundColor: 'rgb(22, 22, 24)' });
  }

  document.querySelector("#dark_theme").onclick = nightMap;
  document.querySelector("#light_theme").onclick = dayMap;

  map.on('click', function (e) {
    latitude = e.lngLat.lat;
    longitude = e.lngLat.lng;
    marker.setLngLat([longitude, latitude]);
    showPosition();
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
  });

  // geocoder (input)

  var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    placeholder: 'Search for places', // Placeholder text for the search bar
  });

  // Add the geocoder to the map
  map.addControl(geocoder);

  map.on('load', function () {

    // Listen for the `result` event from the Geocoder
    // `result` event is triggered when a user makes a selection
    // Add a marker at the result's coordinates
    geocoder.on('result', function (ev) {
      var coordinates = ev.result.center;
      longitude = coordinates[0];
      latitude = coordinates[1];
      marker.setLngLat([longitude, latitude]);
      showPosition();
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
    });
  });

  //navigation-control
  map.addControl(new mapboxgl.NavigationControl());

  //full srceen map
  map.addControl(new mapboxgl.FullscreenControl());

  //drag marker
  var marker = new mapboxgl.Marker({
    draggable: true,
  }).setLngLat([longitude, latitude])
    .addTo(map);

  function onDragEnd() {
    var lngLat = marker.getLngLat();
    longitude = lngLat.lng;
    latitude = lngLat.lat;
    showPosition();
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
  }
  marker.on("dragend", onDragEnd);

}
