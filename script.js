mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYW5tYXNsZXNhIiwiYSI6ImNranVrZmJ3YzIwdWgyeWwxdnc0N3c1eWEifQ.NU5jwn8auapNwbJVrjKTfg';
var positionFromStorage = localStorage.getItem("currentPosition");
let currentPosition;
let latitude = localStorage.getItem("latitude");
let longitude = localStorage.getItem("longitude");
let currentTime,urlGetPrayerTimes,urlGetCity;
let timeZone, fajr, sunrise, dhuhr, asr, maghrib, isha,currentDateTime,countDownTime, gregorianDate,
 hijriDate, country, county, flag;

if(latitude == null || longitude == null)
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation,{enableHighAccuracy: true});
else{
  setupMap([longitude, latitude]);
  showPosition();
}
document.querySelector(".autolocation").addEventListener('click', function(){
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation,{enableHighAccuracy: true});
});

function successLocation(position){
  currentPosition = position;
  latitude = position.coords.latitude,
  longitude = position.coords.longitude,
  localStorage.setItem("latitude", latitude);
  localStorage.setItem("longitude", longitude);
  setupMap([longitude, latitude]);
  showPosition();

}


function errorLocation(){
  latitude = 43.869308818408456, longitude = 18.417377317154944;
  setupMap([latitude,longitude]);
  showPosition();
}

function setupMap(center){
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 14

  });


  function nightMap() {
    map.setStyle('mapbox://styles/mapbox/traffic-night-v2');
    }

    function dayMap() {
      map.setStyle('mapbox://styles/mapbox/streets-v11');
      }
    
    document.querySelector(".maghrib").onclick = nightMap;
    document.querySelector(".sunrise").onclick = dayMap;
    
  map.on('click', function(e) {

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
    zoom: 14,
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

    //vaktija
    function getPoziv(funk, url) {

      var request = new XMLHttpRequest();
      request.onload = function () {
        if (request.status == 200) {
          funk(JSON.parse(request.responseText));
        }
        else {
          alert("Invalid coordinates. expecting latitude in (+/- 90) and longitude in (+/- 180) range values. You will be transferred to the city of Sarajevo");
          latitude = 43.869308818408456, longitude = 18.417377317154944;
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
          showPosition();
        }
      }
    
      request.onerror = function () {
        alert("Error");
        latitude = 43.869308818408456, longitude = 18.417377317154944;
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
          showPosition();
      };
    
      request.open("GET", url, true);
      request.send(null);
    }


function showPosition() {
  
  urlGetCity ='https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+latitude+'&longitude='+longitude;
  currentTime= new Date();
  urlGetPrayerTimes = 'https://api.aladhan.com/v1/timings/'+currentTime.getTime()/1000+'?latitude='+latitude+'&longitude='+longitude+'&method=2';
  getPoziv(GetCity, urlGetCity);
  getPoziv(GetPrayerTimes, urlGetPrayerTimes);

}

                                                     
function GetCity(obj)
{
  if(obj.countryName != '')
  country = obj.countryName;

  if (obj.city != '')
  {
    county = obj.city;
  }
  else if(obj.locality!=''){
    county = obj.locality.replace("Municipality", "");
    county = county.replace("municipality", "");
    county = county.replace("of", "");
    county = county.replace("City of", "");
    county = county.replace("Naselje", "");
    county = county.replace("Town of", "");
    county = county.replace("City", "");
    county = county.replace("County", "");
  }
  else if(obj.locality != '')
  {
    county = obj.locality.replace("Village", "");
  }

 
    document.querySelector(".country").textContent = country;
    document.querySelector(".city").textContent = county;
}

function GetPrayerTimes(obj)
{
  sati = obj.data.timings.Fajr.substring(0, obj.data.timings.Fajr.indexOf(":"));
  minute = obj.data.timings.Fajr.substring(obj.data.timings.Fajr.indexOf(":") + 1);
  hijriDate = obj.data.date.hijri.day + " " + obj.data.date.hijri.month.en +", "+ obj.data.date.hijri.year;
  gregorianDate = obj.data.date.gregorian.day + " " + obj.data.date.gregorian.month.en +", "+ obj.data.date.gregorian.year;
  
  timeZone = obj.data.meta.timezone;
  var zone = ['Europe/Sarajevo', 'Europe/Zagreb', 'Europe/Belgrade', 'Europe/Ljubljana', 'Europe/Podgorica', 'Europe/Skopje'];
   flag = zone.includes(timeZone);
   fajr = obj.data.timings.Fajr;
   sunrise = obj.data.timings.Sunrise;
   dhuhr = obj.data.timings.Dhuhr;
   asr = obj.data.timings.Asr;
   maghrib = obj.data.timings.Maghrib;
   isha = obj.data.timings.Isha;


   document.querySelector(".hijri-date").textContent = hijriDate;
   document.querySelector(".gregorian-date").textContent = gregorianDate;
   document.querySelector(".fajr-time").textContent=flag? fajr : formatAMPM(fajr);
   document.querySelector(".sunrise-time").textContent=flag? sunrise : formatAMPM(sunrise);
   document.querySelector(".dhuhr-time").textContent=flag? dhuhr : formatAMPM(dhuhr);
   document.querySelector(".asr-time").textContent=flag? asr : formatAMPM(asr);
   document.querySelector(".maghrib-time").textContent=flag? maghrib : formatAMPM(maghrib);
   document.querySelector(".isha-time").textContent=flag? isha : formatAMPM(isha);
   document.querySelector(".fajr-caption").textContent = (flag? "zora": "fajr");
   document.querySelector(".sunrise-caption").textContent = (flag? "izlazak sunca": "sunrise");
   document.querySelector(".dhuhr-caption").textContent = (flag? "podne": "dhuhr");
   document.querySelector(".asr-caption").textContent = (flag? "ikindija": "asr");
   document.querySelector(".maghrib-caption").textContent = (flag? "akšam": "maghrib");
   document.querySelector(".isha-caption").textContent = (flag? "jacija": "isha");

   hours = fajr.substring(0, fajr.indexOf(":"));
   minutes = fajr.substring(fajr.indexOf(":") + 1);

   if(!document.querySelector('.active'))
  document.querySelector(".isha").classList.add("active");

  let options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
  formater = new Intl.DateTimeFormat([], options);
  currentDateTime = new Date(formater.format(new Date()));

  countDownTime = new Date(currentDateTime);
  
  countDownTime.setHours(hours);
  countDownTime.setMinutes(minutes);
  countDownTime.setSeconds(0);

}
function formatTime(h) {
  return h < 10 ? "0" + h : h;
}
function setHours(h) {
  hours = h.substring(0, h.indexOf(":"));
  countDownTime.setHours(hours);
}
function setMinutes(m) {
  minutes = m.substring(m.indexOf(":") + 1);
  countDownTime.setMinutes(minutes);
}

function removeActiveClass(){
  document.querySelector(".fajr").classList.remove("active");
  document.querySelector(".sunrise").classList.remove("active");
  document.querySelector(".dhuhr").classList.remove("active");
  document.querySelector(".asr").classList.remove("active");
  document.querySelector(".maghrib").classList.remove("active");
  document.querySelector(".isha").classList.remove("active");

}

function setTimes() {

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(sunrise);
    setMinutes(sunrise);
    //document.querySelector(".isha").classList.remove("active");
    removeActiveClass();
    document.querySelector(".fajr").classList.add("active");
  }

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(dhuhr);
    setMinutes(dhuhr);
    removeActiveClass();
    document.querySelector(".sunrise").classList.add("active");
  }

  if (currentDateTime >= countDownTime.getTime()) {

    setHours(asr);
    setMinutes(asr);
    removeActiveClass();
    document.querySelector(".dhuhr").classList.add("active");

  }


  if (currentDateTime >= countDownTime.getTime()) {

    setHours(maghrib);
    setMinutes(maghrib);
    removeActiveClass();
    document.querySelector(".asr").classList.add("active");

  }

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(isha);
    setMinutes(isha);
    removeActiveClass();
    document.querySelector(".maghrib").classList.add("active");
  }
  
  if (currentDateTime >= countDownTime.getTime()) {
    removeActiveClass();
    document.querySelector(".isha").classList.add("active");
    countDownTime.setDate(countDownTime.getDate() + 1);
    setHours(fajr);
    setMinutes(fajr);

  }
}

var x = setInterval(function () {
  let options = {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
  formater = new Intl.DateTimeFormat([], options);
  currentDateTime = new Date(formater.format(new Date()));

  document.querySelector(".localTime").textContent =  flag? currentDateTime.toTimeString().split(" ")[0].replace(/(.*)\D\d+/, '$1'):formatAMPM(currentDateTime.getHours()+":"+ currentDateTime.getMinutes());
  document.querySelector(".localTimeCaption").textContent = (flag?"Trenutno vrijeme ":"Current time ");

  var currentDateTimeMiliSeconds = currentDateTime.getTime();
  var countDownTimeMiliSeconds = countDownTime.getTime();

  if (currentDateTimeMiliSeconds >= countDownTimeMiliSeconds)
  setTimes();

  var distance = countDownTimeMiliSeconds - currentDateTimeMiliSeconds;
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  if (hours == 0 && minutes <= 9) {
    document.querySelector(".countdown").classList.add("danger");
  }
  else{
    document.querySelector(".countdown").classList.remove("danger");

  }

  if (distance > 0) {
  document.querySelector(".countdown").innerHTML = formatTime(hours) + ":"
  + formatTime(minutes) + ":" + formatTime(seconds);
  
  }
}, 1000);

function GetLocation(selected) {
  var val = selected.value;
  localStorage.setItem("location", val);
  currentTime= new Date();
  urlGetPrayerTimes = 'https://api.aladhan.com/v1/timings/'+currentTime.getTime()/1000+'?latitude='+latitude+'&longitude='+longitude+'&method='+val;
 getPoziv(GetPrayerTimes, urlGetPrayerTimes);
}



//gsap
/*const timeline = gsap.timeline({defaults:{duration:1}})
timeline 
.from(".location-wrapper",{y:'-100%', ease:'bounce'})
.from(".date-wrapper",{y:'-10%', ease:'bounce'})
.from(".card",{opacity:0, stagger: .2})
.from(".card",{x:'-100vw', ease:'power.in'})
.from(".prayer-name",{opacity:0, stagger: .2})*/

function formatAMPM(time) {
  var hours, minutes;
  hours = parseInt(time.substring(0, time.indexOf(":")));
  minutes = parseInt(time.substring(time.indexOf(":") + 1));

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

