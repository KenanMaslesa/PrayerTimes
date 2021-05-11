mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg';

function setupMap(center) {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 12

  });

  var inputs = document.querySelectorAll('.map-style input');

  function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }

  function nightMap() {
    map.setStyle('mapbox://styles/mapbox/traffic-night-v2');
    localStorage.setItem("isDay", false);
  }

  function dayMap() {
    map.setStyle('mapbox://styles/mapbox/streets-v11');
    localStorage.setItem("isDay", true);
  }

  document.querySelector("#dark_theme").onclick = nightMap;
  document.querySelector("#light_theme").onclick = dayMap;

  map.on('click', function (e) {
    latitude = e.lngLat.lat;
    longitude = e.lngLat.lng;
    marker.setLngLat([longitude, latitude]);
    showPosition(method);
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    $('.settings-wrapper').slideUp();
  });

  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    placeholder: 'Search for places',
  });
  map.addControl(geocoder);


  map.on('load', function () {
    geocoder.on('result', function (ev) {
      var coordinates = ev.result.center;
      longitude = coordinates[0];
      latitude = coordinates[1];
      marker.setLngLat([longitude, latitude]);
      showPosition(method);
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
    showPosition(method);
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
  }
  marker.on("dragend", onDragEnd);

}

function isMobileDevice() {
  return $(window).width() < 550 || $(window).height() < 550;
}

if (isMobileDevice()) {
  setTimeout(() => {
    $("#toggle-icon").trigger("click");
    $('#settings-icon').addClass('top-0');
  }, 500);
}