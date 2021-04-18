var positionFromStorage = localStorage.getItem("currentPosition");
let currentPosition;
let latitude = localStorage.getItem("latitude");
let longitude = localStorage.getItem("longitude");
let method = localStorage.getItem("method");
let currentTime, urlGetPrayerTimes, urlGetCity, urlCalendar;
let timeZone, fajr, sunrise, dhuhr, asr, maghrib, isha, currentDateTime, countDownTime, gregorianDate,
  hijriDate, country, county, flag, month, year;
let tempMonth = new Date().getMonth() + 1, tempYear = new Date().getFullYear(), calendarFlag = false;

const monthNames = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthNamesBosnian = ["", "Januar", "Februar", "Mart", "April", "Maj", "Juni",
  "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"
];

if (latitude == null || longitude == null)
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });
else {
  setupMap([longitude, latitude]);
  showPosition(method);
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
  showPosition(method);
}

function errorLocation() {
  latitude = 43.869308818408456, longitude = 18.417377317154944;
  localStorage.setItem("latitude", latitude);
  localStorage.setItem("longitude", longitude);
  showPosition(method);
  window.location.reload();
}


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
      showPosition(method);
      window.location.reload();
    }
  }

  request.onerror = function () {
    latitude = 43.869308818408456, longitude = 18.417377317154944;
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    showPosition(method);
  };

  request.open("GET", url, true);
  request.send(null);
}


function showPosition(method) {

  currentTime = new Date();
  if (method != null) {
    $('#locations option[value=' + method + ']').prop('selected', true);
    if (method == 16) {
      urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=3&tune=0,-4,-5,1,0,5,0,-1,-3`;
    }
    else if (method == 17) {
      urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6`;
    }
    else {
      urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6`;
    }
  }
  else {
    //default method
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6`;
  }

  urlGetCity = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&key=2a1b056b085a47bfbe75c8452a37109c`;

  getRequest(GetCity, urlGetCity);
  getRequest(GetPrayerTimes, urlGetPrayerTimes);

}


function GetCity(obj) {
  if (obj.countryName != '')
    country = obj.countryName;
  else
    country = '';

  if (obj.city != '') {
    county = obj.city.replace("Metropolitan City of", "");
  }
  else if (obj.locality != '') {
    county = obj.locality.replace("Municipality", "");
    county = county.replace("municipality", "");
    county = county.replace("of", "");
    county = county.replace("City of", "");
    county = county.replace("Naselje", "");
    county = county.replace("Town of", "");
    county = county.replace("Town", "");
    county = county.replace("City", "");
    county = county.replace("Local community", "");
    county = county.replace("County", "");
    county = county.replace("Village", "");
    county = county.replace("Grad", "");
  }

  document.querySelector(".country").textContent = country;
  document.querySelector(".city").textContent = county;
}

function GetPrayerTimes(obj) {
  sati = obj.data.timings.Fajr.substring(0, obj.data.timings.Fajr.indexOf(":"));
  minute = obj.data.timings.Fajr.substring(obj.data.timings.Fajr.indexOf(":") + 1);
  hijriDate = obj.data.date.hijri.day + " " + obj.data.date.hijri.month.en + ", " + obj.data.date.hijri.year;
  gregorianDate = obj.data.date.gregorian.day + " " + obj.data.date.gregorian.month.en + ", " + obj.data.date.gregorian.year;
  month = obj.data.date.gregorian.month.en;
  timeZone = obj.data.meta.timezone;
  year = new Date().getFullYear();

  var zone = ['Europe/Sarajevo', 'Europe/Zagreb', 'Europe/Belgrade', 'Europe/Podgorica', 'Europe/Skopje'];
  var bosnianInstruction = 'Kliknite na bilo koje mjesto na karti za koje želite vidjeti vrijeme namaza';
  var englishInstruction = 'Click anywhere on the map where you want to see prayer times';

  flag = zone.includes(timeZone);
  fajr = obj.data.timings.Fajr;
  sunrise = obj.data.timings.Sunrise;
  dhuhr = obj.data.timings.Dhuhr;
  asr = obj.data.timings.Asr;
  maghrib = obj.data.timings.Maghrib;
  isha = obj.data.timings.Isha;

  $(".hijri-date").text(hijriDate);
  $(".gregorian-date").text(gregorianDate);
  $(".fajr-time").text(flag ? fajr : formatAMPM(fajr));
  $(".sunrise-time").text(flag ? sunrise : formatAMPM(sunrise));
  $(".dhuhr-time").text(flag ? dhuhr : formatAMPM(dhuhr));
  $(".asr-time").text(flag ? asr : formatAMPM(asr));
  $(".maghrib-time").text(flag ? maghrib : formatAMPM(maghrib));
  $(".isha-time").text(flag ? isha : formatAMPM(isha));

  $(".fajr-caption").text(flag ? "Zora" : "Fajr");
  $(".sunrise-caption").text(flag ? "Izlazak sunca" : "Sunrise");
  $(".dhuhr-caption").text(flag ? "Podne" : "Dhuhr");
  $(".asr-caption").text(flag ? "Ikindija" : "Asr");
  $(".maghrib-caption").text(flag ? "Akšam" : "Maghrib");
  $(".isha-caption").text(flag ? "Jacija" : "Isha");
  $(".instructions").text(flag ? bosnianInstruction : englishInstruction);
  $('.upcoming-prayer').text(flag ? "nadolazeći namaz" : "upcoming prayer");
  $('.mapboxgl-ctrl-geocoder--input').attr("placeholder", (flag ? "Pretraži mjesta" : "Search for places"));
  $('.autolocation').text(flag ? "Lociraj me" : "Locate me");

  removeActiveClass();
  $('.isha').addClass("active");
  upcomingPrayer();
  $('.fajr').find('.upcoming-prayer').css({ visibility: 'visible' });

  setTimeout(() => {
    if ($('.isha').hasClass('active')) {
      $("#dark_theme").trigger('click');
      $('.local-time-wrapper').removeClass('day');

    }
  }, 1000);

  hours = fajr.substring(0, fajr.indexOf(":"));
  minutes = fajr.substring(fajr.indexOf(":") + 1);
  currentDateTime = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));
  countDownTime = new Date(currentDateTime);
  countDownTime.setHours(hours);
  countDownTime.setMinutes(minutes);
  countDownTime.setSeconds(0);
  if (method == 16) {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=3&tune=0,-4,-5,1,0,5,0,-1,-3&month=${currentDateTime.getMonth() + 1}&year=${currentDateTime.getFullYear()}`;
  }
  else if (method == 17) {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6&month=${currentDateTime.getMonth() + 1}&year=${currentDateTime.getFullYear()}`;
  }
  else {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}&month=${currentDateTime.getMonth() + 1}&year=${currentDateTime.getFullYear()}`;
  }
  getRequest(getCalendar, urlCalendar);
}

$('#plus').on('click', function () {
  calendarFlag = true;
  if (tempMonth >= 12) {
    tempYear++;
    tempMonth = 1;
  }
  else {
    tempMonth++;
  }

  if (method == 16)
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=3&tune=0,-4,-5,1,0,5,0,-1,-3&month=${tempMonth}&year=${tempYear}`;
  else if (method == 17) {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6&month=${tempMonth}&year=${tempYear}`;
  }
  else
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}&month=${tempMonth}&year=${tempYear}`;

  getRequest(getCalendar, urlCalendar);
});
$('#minus').on('click', function () {
  calendarFlag = true;
  if (tempMonth <= 1) {
    tempYear--;
    tempMonth = 12;
  }
  else {
    tempMonth--;
  }

  if (method == 16)
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=3&tune=0,-4,-5,1,0,5,0,-1,-3&month=${tempMonth}&year=${tempYear}`;
  else if (method == 17) {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6&month=${tempMonth}&year=${tempYear}`;
  }
  else
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}&month=${tempMonth}&year=${tempYear}`;

  getRequest(getCalendar, urlCalendar);
});

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
    $('.fajr').addClass('active');
  }

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(dhuhr);
    setMinutes(dhuhr);
    removeActiveClass();
    $('.sunrise').addClass('active');
  }

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(asr);
    setMinutes(asr);
    removeActiveClass();
    $('.dhuhr').addClass('active');
  }

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(maghrib);
    setMinutes(maghrib);
    removeActiveClass();
    $('.asr').addClass('active');
  }

  if (currentDateTime >= countDownTime.getTime()) {
    setHours(isha);
    setMinutes(isha);
    removeActiveClass();
    $('.maghrib').addClass('active');
  }

  if (currentDateTime >= countDownTime.getTime()) {
    removeActiveClass();
    $('.isha').addClass('active');
    countDownTime.setDate(countDownTime.getDate() + 1);
    setHours(fajr);
    setMinutes(fajr);
  }

  upcomingPrayer();

  if ($('.maghrib').hasClass('active') || $('.isha').hasClass('active') || $('.fajr').hasClass('active')) {
    $("#dark_theme").trigger('click');
    $('.local-time-wrapper').removeClass('day');
  }
  else {
    $("#light_theme").trigger('click');
  }

}

function upcomingPrayer() {
  $activeTime = $('.active');
  removeUpcomingPrayer();

  if ($activeTime.hasClass('fajr')) {
    $('.sunrise').find('.upcoming-prayer').text(flag ? "slijedi" : "upcoming");
    $('.sunrise').find('.upcoming-prayer').css({ visibility: 'visible' });
    $('.local-time-wrapper').removeClass('day');
  }
  else if ($activeTime.hasClass('sunrise')) {
    $('.dhuhr').find('.upcoming-prayer').css({ visibility: 'visible' });
    $('.local-time-wrapper').addClass('day');
  }
  else if ($activeTime.hasClass('dhuhr')) {
    $('.asr').find('.upcoming-prayer').css({ visibility: 'visible' });
    $('.local-time-wrapper').addClass('day');
  }
  else if ($activeTime.hasClass('asr')) {
    $('.maghrib').find('.upcoming-prayer').css({ visibility: 'visible' });
    $('.local-time-wrapper').addClass('day');
  }
  else if ($activeTime.hasClass('maghrib')) {
    $('.isha').find('.upcoming-prayer').css({ visibility: 'visible' });
    $('.local-time-wrapper').removeClass('day');
  }
  else if ($activeTime.hasClass('isha')) {
    $('.fajr').find('.upcoming-prayer').css({ visibility: 'visible' });
  }

}

function removeUpcomingPrayer() {
  $('.fajr').find('.upcoming-prayer').css({ visibility: 'hidden' });
  $('.sunrise').find('.upcoming-prayer').css({ visibility: 'hidden' });
  $('.dhuhr').find('.upcoming-prayer').css({ visibility: 'hidden' });
  $('.asr').find('.upcoming-prayer').css({ visibility: 'hidden' });
  $('.maghrib').find('.upcoming-prayer').css({ visibility: 'hidden' });
  $('.isha').find('.upcoming-prayer').css({ visibility: 'hidden' });
}

var x = setInterval(function () {

  if (currentDateTimeMiliSeconds >= countDownTimeMiliSeconds)
    setTimes();

  currentDateTime = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));
  setTime(currentDateTime);

  if (countDownTime != null) {
    var currentDateTimeMiliSeconds = currentDateTime.getTime();
    var countDownTimeMiliSeconds = countDownTime.getTime();

    if (currentDateTimeMiliSeconds >= countDownTimeMiliSeconds)
      setTimes();

    var distance = countDownTimeMiliSeconds - currentDateTimeMiliSeconds;
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (hours == 0 && minutes <= 9) {
      $('.countdown').addClass('danger');
    }
    else {
      $('.countdown').removeClass('danger');
    }

    if (distance > 0) {
      $('.countdown').html(formatTime(hours) + ":"
        + formatTime(minutes) + ":" + formatTime(seconds));
    }
  }

}, 1000);


$('#locations').change(function () {
  method = $(this).val();
  localStorage.setItem("method", method);
  currentTime = new Date();
  if (method == 16) {
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=3&tune=0,-4,-5,1,0,5,0,-1,-3`;
  }
  else if (method == 17) {
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6`;
  }
  else {
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
  }
  getRequest(GetPrayerTimes, urlGetPrayerTimes);

});

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

setTimeout(() => {
  var isMobile = $('.instructions.mobile').css('display') == 'block';
  if (isMobile) {
    $('.instructions.mobile').fadeIn();
    setTimeout(() => {
      $('.instructions.mobile').fadeOut();
    }, 5000);
  }

}, 3000);


function dayofMonth(d) {
  return (d.getDate() < 10 ? '0' : '') + d.getDate();
}
function getCalendar(obj) {
  document.querySelector("#table tbody").innerHTML = "";
  for (var i = 0; i < obj.data.length; i++) {
    document.querySelector("#table tbody").innerHTML += Rows(obj.data[i]);
  }

  $('.date-caption').text(flag ? "Datum" : "Date");
  $(`td[data-day="${dayofMonth(new Date) + (new Date().getMonth() + 1)}"]`).parent().addClass("active");
  $('#table .calendar-date:contains("fri")').parent().addClass("friday");
  $('#table .calendar-date:contains("pet")').parent().addClass("friday");
  if (!calendarFlag)
    $('.calendar-caption').text(flag ? getBosnianMonths(month) + ' ' + tempYear : month + ' ' + tempYear);
  else
    $('.calendar-caption').text(flag ? monthNamesBosnian[tempMonth] + ' ' + tempYear : monthNames[tempMonth] + ' ' + tempYear);

  setTimeout(() => {
    $(".loader").hide();
  }, 700);
}

function Rows(obj) {
  return `<tr>
      <td class="calendar-date" data-day="${obj.date.gregorian.day + tempMonth}">${obj.date.gregorian.day}. ${flag ? getBosnianDays(obj.date.gregorian.weekday.en) : getEnglishDays(obj.date.gregorian.weekday.en)}</td>
      <td>${obj.timings.Fajr.substring(0, obj.timings.Fajr.indexOf(" "))}</td>
      <td>${obj.timings.Sunrise.substring(0, obj.timings.Sunrise.indexOf(" "))}</td>
      <td>${obj.timings.Dhuhr.substring(0, obj.timings.Dhuhr.indexOf(" "))}</td>
      <td>${obj.timings.Asr.substring(0, obj.timings.Asr.indexOf(" "))}</td>
      <td>${obj.timings.Maghrib.substring(0, obj.timings.Maghrib.indexOf(" "))}</td>
      <td>${obj.timings.Isha.substring(0, obj.timings.Isha.indexOf(" "))}</td>
  </tr>`;
}

function getBosnianDays(day) {
  if (day == "Monday")
    return "pon";
  else if (day == "Tuesday")
    return "uto";
  else if (day == "Wednesday")
    return "sri";
  else if (day == "Thursday")
    return "čet";
  else if (day == "Friday")
    return "pet";
  else if (day == "Saturday")
    return "sub";
  else if (day == "Sunday")
    return "ned";
}
function getEnglishDays(day) {
  if (day == "Monday")
    return "mon";
  else if (day == "Tuesday")
    return "tue";
  else if (day == "Wednesday")
    return "wed";
  else if (day == "Thursday")
    return "thu";
  else if (day == "Friday")
    return "fri";
  else if (day == "Saturday")
    return "sat";
  else if (day == "Sunday")
    return "sun";
}

function getBosnianMonths(month) {
  if (month == "January")
    return "Januar";
  else if (month == "February")
    return "Februar";
  else if (month == "March")
    return "Mart";
  else if (month == "April")
    return "April";
  else if (month == "May")
    return "Maj";
  else if (month == "June")
    return "Juni";
  else if (month == "July")
    return "Juli";
  else if (month == "August")
    return "August";
  else if (month == "September")
    return "Septembar";
  else if (month == "October")
    return "Oktobar";
  else if (month == "November")
    return "Novembar";
  else if (month == "December")
    return "Decembar";
}

window.onload = function () {
  $("#toggle-icon").trigger("click");
}


$('#toggle-icon').click(function () {
  var isMobile = window.matchMedia("(max-width: 700px)");
  $('#map').slideToggle();
  $('.prayer-times-wrapper').css({ 'z-index': '9999' });
  $('.autolocation').toggle('slow');
  $('.local-time-wrapper').toggleClass('toggle');
  $('.calculation-methods').toggleClass('toggle');

  if (isMobile.matches) {
    $('.local-time-wrapper.mobile').toggle(300);
    $(this).toggleClass('toggle');
    $('.dark-light-mode').toggleClass('toggle');
  }

})

//PRINT
$('.print').on('click', function () {
  window.print();
})

//clock
const hourEl = document.querySelector('.hour')
const minuteEl = document.querySelector('.minute')
const secondEl = document.querySelector('.second')
const timeEl = document.querySelector('.time')
const dateEl = document.querySelector('.date')

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function setTime(time) {
  const month = time.getMonth()
  const day = time.getDay()
  const date = time.getDate()
  const hours = time.getHours()
  const hoursForClock = hours >= 13 ? hours % 12 : hours;
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hoursForClock, 0, 11, 0, 360)}deg)`
  minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minutes, 0, 59, 0, 360)}deg)`
  secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(seconds, 0, 59, 0, 360)}deg)`

  if(flag){
    timeEl.innerHTML = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
  }
  else{
    timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`
  }
  dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

setTime()

setInterval(setTime, 1000)
