# Local weather app
## Description :
1. Client side:
 * Get the user geoloc coordinates with navigator.geolocation
 * Make an ajax GET request to the server <hostname>/longitude,latitude
2. Server side:
 * use node module forcastio wrapper https://www.npmjs.com/package/forecast.io to get weather data
 * use googlemaps-api node module https://www.npmjs.com/package/google-maps-api to get the user city name.
 * respond with a json object that containins the weather data and the city name.
3. Dependencies : 
 * compression
 * ejs
 * express
 * forecastio
 * googlemaps
 * morgan
 * serve-favicon
 * jQuery
 * Twitter bootstrap
 * Erik Flowers weather icons
4. Api keys
 * Add a "apikeys.js" file at the root directory and store your apikeys
         Keys = {
           FORCAST_IO_KEY: "Your Dark Sky API Key",
           GOOGLE_MAPS_KEY: "Your Google Maps API keys"
         }