const axios = require('axios');
require('dotenv').config();
const httpSearchText = require('./http_search_places.js');

const API_KEY = process.env.API_KEY;
const endpoint = 'https://geocode.googleapis.com/v4/geocode/location/';

async function getLocation(req, res){
    try {
        const {lat, long} = req.query;
        const response = await axios.get(`${endpoint}${lat},${long}?types=locality&key=${API_KEY}`);
        if (response.data.results.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        httpSearchText(`restaurants in ${response.data.results[0].formattedAddress}`);
        res.json(response.data.results[0]);
    } 
    catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getLocation;