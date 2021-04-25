var positionFromStorage = localStorage.getItem("currentPosition");
var currentPosition;
var latitude = localStorage.getItem("latitude");
var longitude = localStorage.getItem("longitude");
var method = localStorage.getItem("method");
var cityID = localStorage.getItem("cityID");
var isAthanAllowed = localStorage.getItem("isAthanAllowed");
var isNotificationAllowed = localStorage.getItem("isNotificationAllowed");
var isDayNightMode = localStorage.getItem("isDayNightMode");
var isDay = localStorage.getItem("isDay");
var notificationMinutes = localStorage.getItem('notificationMinutes');
var themeColor = localStorage.getItem('themeColor');
var bigDataCloud1 = 'd901232290c147beacf55aebb5bf7724';
var bigDataCloud2 = 'a711a9c049714f5a935fddd5ed0f2ae6';
var currentTime, urlGetPrayerTimes, urlGetCity, urlCalendar;
var timeZone, fajr, sunrise, dhuhr, asr, maghrib, isha, currentDateTime, countDownTime, gregorianDate,
  hijriDate, country, county, flag = true, month, year;
var tempMonth = new Date().getMonth() + 1, tempYear = new Date().getFullYear(), calendarFlag = false;

const monthNames = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthNamesBosnian = ["", "Januar", "Februar", "Mart", "April", "Maj", "Juni",
  "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"
];

window.onload = function () {
  if (method != 16) {
    if (latitude == null || longitude == null) {
      navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });
    }
    else {
      setupMap([longitude, latitude]);
      showPosition(method);
    }

    setTimeout(() => {
      setTimeout(() => {
        if (method != 16) {
          $("#toggle-icon").trigger("click");
        }
        setTimeout(() => {
          $("#toggle-icon").removeClass("animate");
        }, 5000);
      }, 2000);
      $("#toggle-icon").addClass("animate");
    }, 8000);

  }

  else {
    cityID = localStorage.getItem("cityID");
    if (cityID == 'null') {
      $('#locationsIZ').show();
      $('#locationsIZ').addClass('animate');
    }
    else {
      getRequest(prayerTimesIZ, 'https://api.vaktija.ba/vaktija/v1/' + cityID);
    }

    hideMap();

    setTimeout(() => {
      $(".loader").hide();
    }, 300);
  }

  $('html, body').animate({ scrollTop: 0 }, 1000);
  Settings();
}

document.querySelector(".autolocation").addEventListener('click', function () {
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });
});

function Settings() {
  if (notificationMinutes == null) {
    localStorage.setItem('notificationMinutes', 10);
    notificationMinutes = 10;
  }
  if (isAthanAllowed == null) {
    localStorage.setItem('isAthanAllowed', false);
    isAthanAllowed = false;
  }
  if (isNotificationAllowed == null) {
    localStorage.setItem('isNotificationAllowed', true);
    isNotificationAllowed = true;
  }
  if (isDayNightMode == null) {
    localStorage.setItem('isDayNightMode', true);
    isDayNightMode = true;
  }
  $('.athan .toggle-btn').addClass(isAthanAllowed == 'true' || isAthanAllowed == true ? 'active' : '');
  $('.notification .toggle-btn').addClass(isNotificationAllowed == 'true' || isNotificationAllowed == true ? 'active' : '');
  $('.day-night-mode .toggle-btn').addClass(isDayNightMode == 'true' || isDayNightMode == true ? 'active' : '');

  if (isNotificationAllowed == 'true' || isNotificationAllowed == true)
    $('.range-slider').slideDown();

  if (isDayNightMode == 'false')
    $('.theme-color-wrapper').slideDown();

  $('.range-slider output').html(notificationMinutes);
  $('.range-slider input[type=range]').val(notificationMinutes);
}

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
  getRequest(IPLocation, 'https://geolocation-db.com/json/');
}

function IPLocation(location) {
  latitude = location.latitude,
  longitude = location.longitude,
  localStorage.setItem("latitude", latitude);
  localStorage.setItem("longitude", longitude);
  setupMap([longitude, latitude]);
  showPosition(method);
}


function getRequest(funk, url) {
  var request = new XMLHttpRequest();
  request.onload = function () {
    if (request.status == 200) {
      funk(JSON.parse(request.responseText));
    }
    else {
      console.log(request.responseText)
    }
  }

  request.onerror = function () {
    getRequest(IPLocation, 'https://geolocation-db.com/json/');
  };

  request.open("GET", url, true);
  request.send(null);
}


function showPosition(method) {
  currentTime = new Date();
  if (method != null) {
    $('#locations option[value=' + method + ']').prop('selected', true);
    if (method == 16) {
      $('#locationsIZ').show();
      return;
    }
    else if (method == 17) {
      urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6`;
    }
    else {
      urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    }
  }
  else {
    //default method
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=2`;
  }

  urlGetCity = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&key=${bigDataCloud1}`;

  getRequest(GetCity, urlGetCity);
  getRequest(GetPrayerTimes, urlGetPrayerTimes);

  setTimeout(() => {
    $(".loader").hide();
  }, 1200);

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

  $(".country").html(country);
  $(".city").html(county);
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
  $(".gregorian-date").text(gregorianDate + " / ");
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
      if ((isDay == 'false' || isDay == false) && (isDayNightMode == 'true' || isDayNightMode == true))
        Night();
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

  if (method == null)//default calendar method
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2&month=${currentDateTime.getMonth() + 1}&year=${currentDateTime.getFullYear()}`;
  else if (method == 17) {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6&month=${currentDateTime.getMonth() + 1}&year=${currentDateTime.getFullYear()}`;
  }
  else {
    urlCalendar = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}&month=${currentDateTime.getMonth() + 1}&year=${currentDateTime.getFullYear()}`;
  }
  if (method != 16) {
    getRequest(getCalendar, urlCalendar);
  }
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

  if (method == 16) {
    var cityID = localStorage.getItem('cityID');
    var calendarIZurl = `https://api.vaktija.ba/vaktija/v1/${cityID}/${tempYear}/${tempMonth}`;
    getRequest(CalendarRowsIZ, calendarIZurl)
  }
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

  if (method == 16) {
    var cityID = localStorage.getItem('cityID');
    var calendarIZurl = `https://api.vaktija.ba/vaktija/v1/${cityID}/${tempYear}/${tempMonth}`;
    getRequest(CalendarRowsIZ, calendarIZurl)
  }
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

function setHours(h = null) {
  if (h != null) {
    hours = h.substring(0, h.indexOf(":"));
    countDownTime.setHours(hours);
  }
}

function setMinutes(m = null) {
  if (m != null) {
    minutes = m.substring(m.indexOf(":") + 1);
    countDownTime.setMinutes(minutes);
  }
}

function removeActiveClass() {
  $(".fajr").removeClass("active");
  $(".sunrise").removeClass("active");
  $(".dhuhr").removeClass("active");
  $(".asr").removeClass("active");
  $(".maghrib").removeClass("active");
  $(".isha").removeClass("active");
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
    if (isDayNightMode == 'true' || isDayNightMode == true)
      Night();
  }
  else {
    $("#light_theme").trigger('click');
    if (isDayNightMode == 'true' || isDayNightMode == true)
      Day();
  }
  themeColor = localStorage.getItem('themeColor');
  ThemeColor(themeColor);
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

function playAthan() {
  var number = Math.floor((Math.random() * 5) + 1);
  var athan = new Howl({
    src: [`./audio/athan${number}.mp3`]
  });
  athan.play();
}

function playBeep() {
  var beep = new Howl({
    src: ['./audio/beep2.mp3']
  });
  beep.play();
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

    if (isNotificationAllowed == true || isNotificationAllowed == 'true') {
      if (hours == 0 && minutes == notificationMinutes && seconds == 0) {
        playBeep();
      }
    }

    if (hours == 0 && minutes <= 9) {
      $('.countdown').addClass('danger');

      if ((isAthanAllowed == true || isAthanAllowed == 'true') && minutes == 0 && seconds == 0) {
        playAthan();
      }
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
    hideMap();
    $('#locationsIZ').show();
    localStorage.setItem('IZ', true);
    var cityID = localStorage.getItem('cityID');

    if (cityID == null) {
      $('.fajr-time').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.sunrise-time').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.dhuhr-time').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.asr-time').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.maghrib-time').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.isha-time').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.countdown').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.city').html('<img src="https://i.stack.imgur.com/qq8AE.gif" width="35" height="35">');
      $('.calendar').addClass('hide');
      $('.card').removeClass('active');
      $('.upcoming-prayer').html('');
      $('.country').html('');
      $('.countdown').hide();
      $('#locationsIZ').addClass('animate');
      $('.location-wrapper').removeClass('IZ');
    }
    else {
      location.reload();
      getRequest(prayerTimesIZ, 'https://api.vaktija.ba/vaktija/v1/' + cityID);
    }
  }
  else {
    $('#locationsIZ').hide();
    $('.location-wrapper').removeClass('IZ');
    var isIZ = localStorage.getItem('IZ');
    $('#locationsIZ option[value=-1]').prop('selected', true);
    if (isIZ == 'true') {
      showMap();
      setTimeout(() => {
        setupMap([longitude, latitude]);
        $('html, body').animate({ scrollTop: scrollTo }, 100);
      }, 500);
      localStorage.setItem('IZ', false);
    }
  }

  if (method == 17) {
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=99&methodSettings=14.6,null,14.6`;
  }
  else {
    urlGetPrayerTimes = `https://api.aladhan.com/v1/timings/${currentTime.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
  }
  showPosition(method);
  setupMap([longitude, latitude]);

});

// IZ
$('#locationsIZ').click(function () {
  $('#locationsIZ').removeClass('animate');
});

$('#locationsIZ').change(function () {
  cityID = $(this).val();
  localStorage.setItem("cityID", cityID);
  $('.countdown').show();

  getRequest(prayerTimesIZ, 'https://api.vaktija.ba/vaktija/v1/' + cityID);

});

function prayerTimesIZ(obj) {
  if (method != null) {
    $('#locations option[value=' + method + ']').prop('selected', true);
    $('#locationsIZ').show();
  }

  var cityID = localStorage.getItem("cityID");
  if (cityID != null) {
    $('#locationsIZ option[value=' + cityID + ']').prop('selected', true);
    $('.location-wrapper').addClass('IZ');
  }

  fajr = obj.vakat[0];
  sunrise = obj.vakat[1];
  dhuhr = obj.vakat[2];
  asr = obj.vakat[3];
  maghrib = obj.vakat[4];
  isha = obj.vakat[5];

  $(".hijri-date").text(hijriDate);
  $(".gregorian-date").text(gregorianDate + " / ");
  $(".fajr-time").text(fajr);
  $(".sunrise-time").text(sunrise);
  $(".dhuhr-time").text(dhuhr);
  $(".asr-time").text(asr);
  $(".maghrib-time").text(maghrib);
  $(".isha-time").text(isha);

  if (cityID == 107) {
    $(".country").text('Crna Gora');
  }
  else if (cityID == 108) {
    $(".country").text('Crna Gora');
  }
  else if (cityID == 109) {
    $(".country").text('Srbija');
  }
  else if (cityID == 110) {
    $(".country").text('Srbija');
  }
  else if (cityID == 111) {
    $(".country").text('Crna Gora');
  }
  else if (cityID == 112) {
    $(".country").text('Crna Gora');
  }
  else if (cityID == 113) {
    $(".country").text('Srbija');
  }
  else if (cityID == 114) {
    $(".country").text('Srbija');
  }
  else if (cityID == 115) {
    $(".country").text('Crna Gora');
  }
  else if (cityID == 116) {
    $(".country").text('Srbija');
  }
  else if (cityID == 117) {
    $(".country").text('Srbija');
  }
  else {
    $(".country").text('Bosna i Hercegovina');
  }

  $(".city").text(obj.lokacija);
  $(".gregorian-date").text(obj.datum[1] + ' / ');
  $(".hijri-date").text(obj.datum[0]);
  $('.upcoming-prayer').text("nadolazeći namaz");

  removeActiveClass();
  $('.isha').addClass("active");
  upcomingPrayer();
  $('.fajr').find('.upcoming-prayer').css({ visibility: 'visible' });

  setTimeout(() => {
    if ($('.isha').hasClass('active')) {
      $("#dark_theme").trigger('click');
      if (isDayNightMode == 'true' || isDayNightMode == true)
        Night();
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

  var cityID = localStorage.getItem('cityID');
  var calendarIZurl = `https://api.vaktija.ba/vaktija/v1/${cityID}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`;
  getRequest(CalendarRowsIZ, calendarIZurl)

}

function CalendarRowsIZ(obj) {
  document.querySelector("#table tbody").innerHTML = '';
  $('.calendar-caption').html(monthNamesBosnian[obj.mjesec] + ' ' + obj.godina + '.')
  $('.calendar').removeClass('hide');
  for (var i = 0; i < obj.dan.length; i++) {
    document.querySelector("#table tbody").innerHTML += `<tr>
    <td class="calendar-date" data-day="${(i < 9 ? '0' + (i + 1) : i + 1) + '' + tempMonth}">${(i < 9 ? '0' + (i + 1) : i + 1) + '. ' + obj.mjesec + '. ' + obj.godina}.</td>
    <td>${obj.dan[i].vakat[0]}</td>
    <td>${obj.dan[i].vakat[1]}</td>
    <td>${obj.dan[i].vakat[2]}</td>
    <td>${obj.dan[i].vakat[3]}</td>
    <td>${obj.dan[i].vakat[4]}</td>
    <td>${obj.dan[i].vakat[5]}</td>
    </tr>`;
  }
  $(`td[data-day="${dayofMonth(new Date) + (new Date().getMonth() + 1)}"]`).parent().addClass("active");
}
//IZ

function hideMap() {
  $('#map').slideUp();
  $('.instructions ').slideUp();
  $('.autolocation').slideUp();
  $('#toggle-icon').slideUp();
  $('.calendar').addClass('hide');
  $('.calculation-methods').addClass('toggle');
}

function showMap() {
  $('#map').slideDown();
  $('.instructions ').slideDown();
  $('.autolocation').slideDown();
  $('#toggle-icon').slideDown();
  $('.calendar').removeClass('hide');
  $('.calculation-methods').removeClass('toggle');
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
  if (!calendarFlag)
    $('.calendar-caption').text(flag ? getBosnianMonths(month) + ' ' + tempYear : month + ' ' + tempYear);
  else
    $('.calendar-caption').text(flag ? monthNamesBosnian[tempMonth] + ' ' + tempYear : monthNames[tempMonth] + ' ' + tempYear);

  $('.calendar').removeClass('hide');
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

$('#toggle-icon').click(function () {
  var isMobile = window.matchMedia("(max-width: 768px)");
  $('#map').slideToggle();
  $('.prayer-times-wrapper').css({ 'z-index': '9999' });
  $('.autolocation').toggle('slow');
  $('.local-time-wrapper').toggleClass('toggle');
  $('.calculation-methods').toggleClass('toggle');
  $('.instructions').toggle(500);

  if (isMobile.matches) {
    $('.local-time-wrapper.mobile').toggle(300);
    $(this).toggleClass('toggle');
    $('.dark-light-mode').toggleClass('toggle');
  }

  if (window.matchMedia("(max-width: 900px)").matches) {
    setTimeout(() => {
      $('.instructions').remove();
    }, 8000);
  }
})

//PRINT
$('.print').on('click', function () {
  window.print();
})

//CLOCK
const hourEl = document.querySelector('.hour')
const minuteEl = document.querySelector('.minute')
const secondEl = document.querySelector('.second')
const timeEl = document.querySelector('.time')
const dateEl = document.querySelector('.date')

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const bosnianDays = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function setTime(time = null) {
  if (time != null) {
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

    if (flag) {
      timeEl.innerHTML = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
      dateEl.innerHTML = `${bosnianDays[day]}, ${months[month]} <span class="circle">${date}</span>`
    }
    else {
      timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
      dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
    }
  }
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


//SETTINGS
$('#close-settings-icon').click(function () {
  $('.settings-wrapper').animate({ width: 'toggle' }, 350);

})

$('#settings-icon').click(function () {
  $('.settings-wrapper').animate({ width: 'toggle' }, 350);
})


$('.main-section').click(function () {
  $('.settings-wrapper').slideUp();
})



$('.cb-value').click(function () {
  var mainParent = $(this).parent('.toggle-btn');
  var isNotification = $(this).attr('data-notification');
  var isDayNightMode = $(this).attr('data-dayNightMode');

  if (!$(mainParent).hasClass('active')) {
    $(mainParent).addClass('active');

    if (isNotification) {
      $('.range-slider').slideDown();
      localStorage.setItem('isNotificationAllowed', true);
      isNotificationAllowed = true;
    }
    else if (isDayNightMode) {
      $('.theme-color-wrapper').slideUp();
      localStorage.setItem('isDayNightMode', true);
      isDayNightMode = true;
      localStorage.setItem('themeColor', null);
      $('.main-section').attr('style', '');
      $('.theme-color span').removeClass('active');
      $('.form-control').css('background', '');
      ThemeColor();
      isDayNightMode = true;
    }
    else {
      localStorage.setItem('isAthanAllowed', true);
      isAthanAllowed = true;
    }
  }
  else {
    $(mainParent).removeClass('active');
    if (isNotification) {
      $('.range-slider').slideUp();
      localStorage.setItem('isNotificationAllowed', false);
      isNotificationAllowed = false;
    }
    else if (isDayNightMode) {
      $('.theme-color-wrapper').slideDown();
      localStorage.setItem('isDayNightMode', false);
      isDayNightMode = false;
    }
    else {
      localStorage.setItem('isAthanAllowed', false);
      isAthanAllowed = false;
    }
  }

})

$(document).on('input', 'input[type="range"]', function (e) {
  var minutes = e.currentTarget.value;
  $('.range-slider output').html(minutes);
  notificationMinutes = minutes;
  localStorage.setItem('notificationMinutes', minutes);
});


//THEME COLOR
$('.theme-color span').click(function () {
  var color = $(this).attr('data-color');
  localStorage.setItem('themeColor', color);
  $('.theme-color span').removeClass('active');
  $(this).addClass('active');
  ThemeColor(color);
})

function ThemeColor(color = null) {
  isDay = localStorage.getItem('isDay');
  isDayNightMode = localStorage.getItem('isDayNightMode');

  if (color != null && (isDayNightMode == 'false' || isDayNightMode == false)) {
    $(`.theme-color span[data-color='${color}']`).addClass('active');
    $('.main-section').css('background-image', `-webkit-gradient(linear,left top,left bottom,from(${color})),url(../images/6.png)`);
    $("#table tr.active").removeClass('gray');

    if (color == '#42a76638') {
      $('.form-control').css('background', '#0e313fd4');
      $('#table').css('background', '#0e313fd4');
      $("meta[name='theme-color']").attr('content', '#104755');
    }
    else {
      $('.form-control').css('background', color);
      $('#table').css('background', convertHex(color, 0.1));
      $("meta[name='theme-color']").attr('content', color);
    }

    if (color == '#0606068c') {
      $("meta[name='theme-color']").attr('content', '#030c1d');
      $('.form-control').css('background', '#030c1d');
    }

    else if (color == '#10475570') {
      $("meta[name='theme-color']").attr('content', '#072b45');
      $('.form-control').css('background', '#072b45');
    }

    else if (color == '#42a76638') {
      $("meta[name='theme-color']").attr('content', '#0e3443');
      $('.form-control').css('background', '#0e3443');
    }

    else if (color == '#1e2227') {
      $("#table tr.active").addClass('gray');
      $('.form-control').css('background', '#1e2227');
    }

  }

  else {
    if (isDay != null) {
      if (isDay == 'true' || isDay == true) {
        $("#light_theme").trigger('click');
        if (isDayNightMode == 'true' || isDayNightMode == true)
          Day();
      }

      else {
        $("#dark_theme").trigger('click');
        if (isDayNightMode == 'true' || isDayNightMode == true)
          Night();
      }

    }
  }
}

function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);
  result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  return result;
}

function Night() {
  localStorage.setItem("isDay", false);
  $('.local-time-wrapper').removeClass('day');
  $("#table").css({ backgroundColor: '#040d1d' });
  $('.main-section').addClass("dark");
  $('.form-control').removeClass("light");
  $("meta[name='theme-color']").attr('content', '#030c1d');
  $("body").css({ 'background': '#030c1d' });
  $("#dark_theme").hide();
  $("#light_theme").show();
  $('#darkMode').addClass('active');
}

function Day() {
  localStorage.setItem("isDay", true);
  $('.local-time-wrapper').addClass('day');
  $("#table").css({ backgroundColor: '#0e313fd4' });
  $('.main-section').removeClass("dark");
  $('.form-control').addClass("light");
  $("meta[name='theme-color']").attr('content', '#0e3443');
  $("body").css({ 'background': '#0e3443' });
  $("#dark_theme").show();
  $("#light_theme").hide();
  $('#darkMode').removeClass('active');
}

document.onkeydown = function (e) { 
  if (event.keyCode == 123) { 
      return false; 
  } 
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { 
      return false; 
  } 
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { 
      return false; 
  } 
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { 
      return false; 
  } 
  if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { 
      return false; 
  } 
} 