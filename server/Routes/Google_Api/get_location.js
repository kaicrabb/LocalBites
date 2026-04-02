const axios = require('axios');
require('dotenv').config();
const httpSearchText = require('./http_search_places.js');

const API_KEY = process.env.API_KEY;
const endpoint = 'https://geocode.googleapis.com/v4/geocode/location/';

async function getLocation(lat, long){
    const location = {
        latitude : lat,
        longitude : long,
    };
    const response = await axios.get(`${endpoint}${lat},${long}?types=locality&key=${API_KEY}`);

    httpSearchText(`restaurants in ${response.data.results[0].formattedAddress}`);

}
module.exports = getLocation;