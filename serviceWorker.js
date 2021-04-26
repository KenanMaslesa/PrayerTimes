
const staticGlobalPrayerTimes = "pwa"
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
        return response || fetch(event.request);
      })
  )
})