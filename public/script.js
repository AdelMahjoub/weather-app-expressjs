$(document).ready(() => {
  // Get location coords
  $("#city").html("Loading ...");
  const getData = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(request);
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }

  // English and french days's names
  const days = {
    en: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    fr: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi"
    ]
  }

  //Format JSON response data into a more readable format
  const formatInfo = (string, key, lang) => {
    if(isNaN(string)) {
      return string;
    }
    switch(key) {
      case "temperature":
        return parseInt(string) + " °";
      case "precipIntensity":
        return parseInt(string) + " %";
      case "windSpeed":
        return parseInt(string) + " m/s";
      case "apparentTemperature":
        return "Ressenti " + parseInt(string) + " °";
      case "sunsetTime": {
        let date = (new Date(string * 1000));
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return hour + ":" + minute;
      }
      case "sunriseTime": {
        let date = (new Date(string * 1000));
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return hour + ":" + minute;
      }
      case "temperatureMax":
        return parseInt(string) + "°/";
      case "temperatureMin":
        return parseInt(string) + "°";
      case "time":
        let date = new Date(string * 1000);
        let day = date.getDay();
        if(lang) {
          if(lang !== "en" && lang !== "fr") {
            lang = "en";
          }
          return days[lang][day];
        }
        return;
    }
  }

  // Weather icon
  const renderIcon = (selector, icon) => {
    $(selector).addClass("wi wi-forecast-io-" + icon);
  }

  // Static icons / labels
  const renderStaticIcons = () => {
    let staticIcons = [
      "",
      "wi wi-umbrella",
      "wi wi-sunrise",
      "wi wi-sunset",
      "wi wi-strong-wind",
      "",
      "",
      ""
    ];
    $("i").each(function(i) {
      $(this).addClass(staticIcons[i])
    });
  }

  // Dynamically target DOM elements
  // DOM elements which shows weather info have ids formatted this way: prefix-key
  // Where prefix is a passed string and key is a property of the passed object
  // The function loop through all the passed object's properties, and
  // If an element id math "passed prefix-object's property", it's content is updated 
  const showWeatherInfo = (obj, idPrefix, lang) => {
    for(let key in obj) {
      if(obj.hasOwnProperty(key)) {
        if(idPrefix !== "") {
          if(key === "icon") {
            renderIcon(`#${idPrefix}-${key}`, obj[key]);
          } else {
            $(`#${idPrefix}-${key}`).html(formatInfo(obj[key], key, lang));
          }
        } else {
          $(`#${key}`).html(formatInfo(obj[key], key));
        }
      }
    }
  }

  // Get weather and city name
  const request = (location) => {
    let longitude = location.coords.longitude;
    let latitude = location.coords.latitude;
    let link = `/${longitude},${latitude}`;
    $.ajax({
      url: link,
    }).done((data) => {
      $("#loading").addClass("hidden");
      $("#app").removeClass("hidden");
      showWeatherInfo(data, "");
      showWeatherInfo(data.weather.currently, "current");
      showWeatherInfo(data.weather.daily.data[0], "0");
      showWeatherInfo(data.weather.daily, "daily");
      showWeatherInfo(data.weather.daily.data[1], "1", data.lang);
      showWeatherInfo(data.weather.daily.data[2], "2", data.lang);
      showWeatherInfo(data.weather.daily.data[3], "3", data.lang);
      renderStaticIcons();
    });
  }
  getData();
});