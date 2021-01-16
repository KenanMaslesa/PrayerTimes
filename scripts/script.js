var positionFromStorage = localStorage.getItem("currentPosition");
let currentPosition;
let latitude = localStorage.getItem("latitude");
let longitude = localStorage.getItem("longitude");
let currentTime, urlGetPrayerTimes, urlGetCity;
let timeZone, fajr, sunrise, dhuhr, asr, maghrib, isha, currentDateTime, countDownTime, gregorianDate,
  hijriDate, country, county, flag;

if (latitude == null || longitude == null)
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });
else {
  setupMap([longitude, latitude]);
  showPosition();
}
document.querySelector(".autolocation").addEventListener('click', function () {
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });
});

function successLocation(position) {
  currentPosition = position;
  latitude = position.coords.latitude,
    longitude = position.coords.longitude,
    localStorage.setItem("latitude", latitude);
  localStorage.setItem("longitude", longitude);
  setupMap([longitude, latitude]);
  showPosition();

}

function errorLocation() {
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });
}


//vaktija
function getRequest(funk, url) {

  var request = new XMLHttpRequest();
  request.onload = function () {
    if (request.status == 200) {
      funk(JSON.parse(request.responseText));
    }
    else {
      alert("Invalid coordinates. expecting latitude in (+/- 90) and longitude in (+/- 180) range values. You will be transferred to the Sarajevo");
      latitude = 43.869308818408456, longitude = 18.417377317154944;
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
      showPosition();
      window.location.reload();
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

  urlGetCity = 'https://api.bigdatacloud.net/data/reverse-geocode?latitude=' + latitude + '&longitude=' + longitude + '&key=2a1b056b085a47bfbe75c8452a37109c';
  currentTime = new Date();
  urlGetPrayerTimes = 'https://api.aladhan.com/v1/timings/' + currentTime.getTime() / 1000 + '?latitude=' + latitude + '&longitude=' + longitude + '&method=2';
  getRequest(GetCity, urlGetCity);
  getRequest(GetPrayerTimes, urlGetPrayerTimes);

}


function GetCity(obj) {
  if (obj.countryName != '')
    country = obj.countryName;

  if (obj.city != '') {
    county = obj.city.replace("Metropolitan City of", "");;
  }
  else if (obj.locality != '') {
    county = obj.locality.replace("Municipality", "");
    county = county.replace("municipality", "");
    county = county.replace("of", "");
    county = county.replace("City of", "");
    county = county.replace("Naselje", "");
    county = county.replace("Town of", "");
    county = county.replace("City", "");
    county = county.replace("Local community", "");
    county = county.replace("County", "");
    county = county.replace("Village", "");
  }
  
  document.querySelector(".country").textContent = country;
  document.querySelector(".city").textContent = county;
}

function GetPrayerTimes(obj) {
  sati = obj.data.timings.Fajr.substring(0, obj.data.timings.Fajr.indexOf(":"));
  minute = obj.data.timings.Fajr.substring(obj.data.timings.Fajr.indexOf(":") + 1);
  hijriDate = obj.data.date.hijri.day + " " + obj.data.date.hijri.month.en + ", " + obj.data.date.hijri.year;
  gregorianDate = obj.data.date.gregorian.day + " " + obj.data.date.gregorian.month.en + ", " + obj.data.date.gregorian.year;

  timeZone = obj.data.meta.timezone;
  var zone = ['Europe/Sarajevo', 'Europe/Zagreb', 'Europe/Belgrade', 'Europe/Podgorica', 'Europe/Skopje'];
  flag = zone.includes(timeZone);
  fajr = obj.data.timings.Fajr;
  sunrise = obj.data.timings.Sunrise;
  dhuhr = obj.data.timings.Dhuhr;
  asr = obj.data.timings.Asr;
  maghrib = obj.data.timings.Maghrib;
  isha = obj.data.timings.Isha;
  var bosnianInstruction = 'Kliknite na bilo koje mjesto na karti za koje želite vidjeti vrijeme namaza';
  var englishInstruction = 'Click anywhere on the map where you want to see prayer times';
  document.querySelector(".hijri-date").textContent = hijriDate;
  document.querySelector(".gregorian-date").textContent = gregorianDate;
  document.querySelector(".fajr-time").textContent = flag ? fajr : formatAMPM(fajr);
  document.querySelector(".sunrise-time").textContent = flag ? sunrise : formatAMPM(sunrise);
  document.querySelector(".dhuhr-time").textContent = flag ? dhuhr : formatAMPM(dhuhr);
  document.querySelector(".asr-time").textContent = flag ? asr : formatAMPM(asr);
  document.querySelector(".maghrib-time").textContent = flag ? maghrib : formatAMPM(maghrib);
  document.querySelector(".isha-time").textContent = flag ? isha : formatAMPM(isha);
  document.querySelector(".fajr-caption").textContent = (flag ? "zora" : "fajr");
  document.querySelector(".sunrise-caption").textContent = (flag ? "izlazak sunca" : "sunrise");
  document.querySelector(".dhuhr-caption").textContent = (flag ? "podne" : "dhuhr");
  document.querySelector(".asr-caption").textContent = (flag ? "ikindija" : "asr");
  document.querySelector(".maghrib-caption").textContent = (flag ? "akšam" : "maghrib");
  document.querySelector(".isha-caption").textContent = (flag ? "jacija" : "isha");
  document.querySelector(".instructions").textContent = (flag ? bosnianInstruction : englishInstruction);
  $('.upcoming-prayer').text(flag ?"nadolazeći namaz":"upcoming prayer");
  hours = fajr.substring(0, fajr.indexOf(":"));
  minutes = fajr.substring(fajr.indexOf(":") + 1);

  if (!document.querySelector('.active')) {
    document.querySelector(".isha").classList.add("active");
    $("#dark_theme").trigger('click');
    $('.fajr').find('.upcoming-prayer').css({visibility:'visible'});
  }

  currentDateTime = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));

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

function removeActiveClass() {
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

  upcomingPrayer();

  if ($('.maghrib').hasClass('active') || $('.isha').hasClass('active')) {
    $("#dark_theme").trigger('click');

  }
  else {
    $("#light_theme").trigger('click');

  }

}

function upcomingPrayer(){
  $activeTime = $('.active');
  removeUpcomingPrayer();
  if($activeTime.hasClass('fajr'))
 {
   $('.sunrise').find('.upcoming-prayer').css({visibility:'visible'});
 }
 else if($activeTime.hasClass('sunrise'))
 {
   $('.dhuhr').find('.upcoming-prayer').css({visibility:'visible'});
 }
 else if($activeTime.hasClass('dhuhr'))
 {
   $('.asr').find('.upcoming-prayer').css({visibility:'visible'});
 }
 else if($activeTime.hasClass('asr'))
 {
   $('.maghrib').find('.upcoming-prayer').css({visibility:'visible'});
 }
 else if($activeTime.hasClass('maghrib'))
 {
   $('.isha').find('.upcoming-prayer').css({visibility:'visible'});
 }
 else if($activeTime.hasClass('isha'))
 {
   $('.fajr').find('.upcoming-prayer').css({visibility:'visible'});
 }

}

function removeUpcomingPrayer(){
  $('.fajr').find('.upcoming-prayer').css({visibility:'hidden'});
  $('.sunrise').find('.upcoming-prayer').css({visibility:'hidden'});
  $('.dhuhr').find('.upcoming-prayer').css({visibility:'hidden'});
  $('.asr').find('.upcoming-prayer').css({visibility:'hidden'});
  $('.maghrib').find('.upcoming-prayer').css({visibility:'hidden'});
  $('.isha').find('.upcoming-prayer').css({visibility:'hidden'});

}

var x = setInterval(function () {

  if (currentDateTimeMiliSeconds >= countDownTimeMiliSeconds)
    setTimes();

  currentDateTime = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));

  document.querySelector(".localTime").textContent = flag ? currentDateTime.toTimeString().split(" ")[0].replace(/(.*)\D\d+/, '$1') : formatAMPM(currentDateTime.getHours() + ":" + currentDateTime.getMinutes());
  document.querySelector(".localTimeCaption").textContent = (flag ? "Trenutno vrijeme " : "Current time ");

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
  else {
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
  currentTime = new Date();
  urlGetPrayerTimes = 'https://api.aladhan.com/v1/timings/' + currentTime.getTime() / 1000 + '?latitude=' + latitude + '&longitude=' + longitude + '&method=' + val;
  getRequest(GetPrayerTimes, urlGetPrayerTimes);
}

function formatAMPM(time) {
  var hours, minutes;
  hours = parseInt(time.substring(0, time.indexOf(":")));
  minutes = parseInt(time.substring(time.indexOf(":") + 1));

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}





