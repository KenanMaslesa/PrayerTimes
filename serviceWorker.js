
const staticCacheName = "site-static"
const dynamicCacheName = "site-dynamic"
const assets = [
  "./",
  "./style/style.min.css",
  "./style/style.css",
  "./scripts/script.js",
  "./scripts/script.min.js",
  "./scripts/map.js",
  "./scripts/map.min.js",
  "./images/6.png",
  "./images/fajr.jpg",
  "./images/dhuhr2.jpg",
  "./images/asr.jpg",
  "./images/isha.jpg",
  "./images/logo.png",
  "./images/maghrib.jpg",
  "./images/sunrise.jpg",
  "./images/tablogo.png",
  "./images/loader.mp4",
  "./audio/athan1.mp3",
  "./audio/athan2.mp3",
  "./audio/athan3.mp3",
  "./audio/athan4.mp3",
  "./audio/athan5.mp3",
  "./audio/beep.mp3",
  "./ionicons/css/ionicons.css",
  "./ionicons/css/ionicons.min.css",
  "./ionicons/fonts/ionicons.eot",
  "./ionicons/fonts/ionicons.svg",
  "./ionicons/fonts/ionicons.ttf",
  "./ionicons/fonts/ionicons.woff",
  "https://api.mapbox.com/v4/mapbox.mapbox-traffic-v1/12/2259/1491.vector.pbf?sku=101nTCV0wjtvB&access_token=pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg",
  "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2.json?secure&access_token=pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg",
  "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11?access_token=pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg",
  "https://unpkg.com/@mapbox/mapbox-sdk@0.12.1/umd/mapbox-sdk.min.js",
  "https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg",
  "https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2?access_token=pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg",
  "https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css",
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.css",
  "https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js",
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js",
  "https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js",
  "https://i.stack.imgur.com/qq8AE.gif",
  "https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.core.min.js",
  "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
  "https://richtr.github.io/NoSleep.js/dist/NoSleep.min.js",
]
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticGlobalPrayerTimes).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(fetchRes => {
          return cashes.open(dynamicCacheName).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          })
        });
      })
  )
})