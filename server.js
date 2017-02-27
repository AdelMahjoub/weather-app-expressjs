"use strict";
const express = require("express");
const compression = require("compression");
const ForecastIo = require("forecastio");
const path = require("path");
const logger = require("morgan");
const fs = require("fs");
const GoogleMapsApi = require("googlemaps");
const KEYS = require("./apikeys");

//Express App
const app = express();

app.set("port", process.env.PORT || 3000);

// ForecastIo object
const API_KEY = KEYS.FORCAST_IO_KEY;
const weather = new ForecastIo(process.env.FORCAST_IO_KEY || KEYS.FORCAST_IO_KEY);

// GoogleMaps object
const publicConfig = {
  key: GOOGLE_MAPS_KEY || KEYS.GOOGLE_MAPS_KEY
}
let location = new GoogleMapsApi(publicConfig);

// Acess Log stream
let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags: "a"});

app.use(logger("combined", {stream: accessLogStream}));
app.use(compression());

// Static Files Middleware
app.use(express.static(path.join(__dirname, "public")));

// Set views
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

// Regex "/(+/-)longitude, (+/-)latitude"
let coords = /\/([-]{0,1}[+]{0,1}\d{1,3}[.]{0,1}\d{0,})[,]([-]{0,1}[+]{0,1}\d{1,2}[.]{0,1}\d{0,})/;

app.get(coords, (req, res, next) => {
  let longitude = req.params[0];
  let latitude = req.params[1];
  if(!longitude || !latitude) {
    next();
    return;
  }
  // console.log(req.headers)
  // User's langage
  let language = req.headers["accept-language"].split(",")[0].split("-")[0];
  //ForecastIo options
  let options = {
    exclude: "minutly, hourly, flags",
    units: "auto",
    lang: language
  }
  // Get weather data
  weather.forecast(latitude, longitude, options, (err, data) => {
    if(err) {
      next();
      return;
    }
    let reverseGeocodeParams = {
      latlng: `${latitude},${longitude}`,
      language: language,
      location_type: "APPROXIMATE",
      result_type: "locality"
    }
    // Get city name
    location.reverseGeocode(reverseGeocodeParams, (err, city) => {
       //Send weather data, city data and request language
       res.json({
         lang: language,
         weather: data,
         city: city.results[0].address_components[0].long_name,
       });
    });
  });
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(app.get("port"), () => {
  console.log("Server started on port: " + app.get("port"));
});
