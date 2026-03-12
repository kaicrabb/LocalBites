const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const endpoint = 'https://places.googleapis.com/v1/places:searchText';

async function httpSearchText(query){
    const q = {
        textQuery: query
    };

    const response = await axios.post(endpoint, q, {
        headers: {
            'Content-Type' : 'application/json',
            'X-Goog-Api-Key' : API_KEY,
            'X-Goog-FieldMask': 'places.displayName',
        },
    });
    for (let i = 0; i < response.data.places.length; i++) {
    console.log(response.data.places[i].displayName.text);
    }
    return response.data;
}

module.exports = httpSearchText;