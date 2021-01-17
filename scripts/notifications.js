
window.onload = function () {
  notifyMe();
};
function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  }
  else if (Notification.permission === "granted") {
  }
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
      }
    })
  }
}

function activeTimeNotify(func) {
  func();
}


function fajrNotify() {
  var notification = new Notification("SABAH NAMAZ", {
    body: "Vjernicima je propisano da u određeno vrijeme namaz obavljaju.",
    image: '/images/fajr.jpg'
  });
}
function sunriseNotify() {
  var notification = new Notification("IZLAZAK SUNCA", {
    body: "Vjernicima je propisano da u određeno vrijeme namaz obavljaju.",
    image: '/images/sunrise.jfif'
  });
}
function dhuhrNotify() {
  var notification = new Notification("PODNE NAMAZ", {
    body: "Vjernicima je propisano da u određeno vrijeme namaz obavljaju.",
    image: '/images/dhuhr.jpg'
  });
}
function asrNotify() {
  var notification = new Notification("IKINIDJA NAMAZ", {
    body: "Vjernicima je propisano da u određeno vrijeme namaz obavljaju.",
    image: '/images/asr.jpg'
  });
}
function maghribNotify() {
  var notification = new Notification("AKŠAM NAMAZ", {
    body: "Vjernicima je propisano da u određeno vrijeme namaz obavljaju.",
    image: '/images/maghrib.jfif'
  });
}
function ishaNotify() {
  var notification = new Notification("JACIJA NAMAZ", {
    body: "Vjernicima je propisano da u određeno vrijeme namaz obavljaju.",
    image: '/images/isha.jfif'
  });
}

$('.instructions').on('click', function () {
  fajrNotify();
  sunriseNotify();
  dhuhrNotify();
  asrNotify();
  maghribNotify();
  ishaNotify();
})