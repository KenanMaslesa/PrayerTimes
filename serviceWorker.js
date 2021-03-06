
const staticCacheName = "site-static";
const dynamicCacheName = "site-dynamic";
const assets = [
  "./",
  "./images/6.png",
  "./images/fajr.jpg",
  "./images/dhuhr2.jpg",
  "./images/asr.jpg",
  "./images/isha.jpg",
  "./images/logo2.png",
  "./images/maghrib.jpg",
  "./images/sunrise.jpg",
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
]
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
      })
  )
})