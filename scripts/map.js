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
  }

  function dayMap() {
    map.setStyle('mapbox://styles/mapbox/streets-v11');
    $("#dark_theme").show();
    $("#light_theme").hide();
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

  //input
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      zoom: 13,
      placeholder: 'Try: Sarajevo',
      mapboxgl: mapboxgl,
      autocomplete: true,
    })
  );

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