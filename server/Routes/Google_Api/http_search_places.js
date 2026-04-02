const axios = require('axios');
require('dotenv').config();

const Restaurant = require('../../Models/places');

const API_KEY = process.env.API_KEY;
const endpoint = 'https://places.googleapis.com/v1/places:searchText';

//chain restaurants list
const chains = ["McAlister's Deli", "Planet Sub", "Buffalo Wild Wings GO", "Applebee's Grill + Bar", "Chick-fil-A", "McDonalds", "Taco Bell", "Burger King", "Pizza Ranch", "Sonic Drive-In", "Jimmy John's", "McDonald's", "Starbucks Coffee Company", "Pizza Hut", "Dominos", "Hunt Brothers", "KFC", "Taco John's", "Scooter's Coffee", "Dairy Queen Grill & Chill", "Pizza Hut", "Starbucks Coffee Company", "Domino's Pizza"];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function httpSearchText(query){
    const q = {
        textQuery: query
    };
    const response = await axios.post(endpoint, q, {
        headers: {
            'Content-Type' : 'application/json',
            'X-Goog-Api-Key' : API_KEY,
            'pageSize' : 20,
            'X-Goog-FieldMask': 'nextPageToken,places.displayName.text,places.types,places.primaryType,places.formattedAddress,places.rating,places.priceLevel,places.location',
        },
    });
    logResults(response, response.data.nextPageToken, query);
}

async function logResults(response, pageToken, query){
    for (let i = 0; i < response.data.places.length; i++) {
        const exists = await Restaurant.findOne({displayName: response.data.places[i].displayName.text});
        const chain = chains.includes(response.data.places[i].displayName.text);
        if (!exists && !chain && response.data.places[i].types.includes("restaurant") && response.data.places[i].primaryType != "fast_food_restauraunt" && response.data.places[i].types.includes("fast_food_restaurant") == false){
            let rating;
            if (response.data.places[i].rating == "undefined"){rating == "-1"}
            else {rating = response.data.places[i].rating}
            const workingRestaurant = new Restaurant({
                displayName: response.data.places[i].displayName.text,
                primaryType: response.data.places[i].primaryType,
                types: response.data.places[i].types,
                formattedAddress: response.data.places[i].formattedAddress,
                location: {
                    type: "Point",
                    coordinates: [response.data.places[i].location.longitude, response.data.places[i].location.latitude]
                },
                rating: rating,
                priceLevel: response.data.places[i].priceLevel
            });
            await workingRestaurant.save();
            console.log("New Restaurant "+response.data.places[i].displayName.text+" saved!");
        }
        else if (exists){
            console.log("Restaurant "+response.data.places[i].displayName.text+" already exists!");
        }
        else if (chain){
            console.log("Restaurant "+response.data.places[i].displayName.text+" not saved--chain restaurant!");
        }
        else if (response.data.places[i].primaryType == "fast_food_restaurant" || response.data.places[i].types.includes("fast_food_restauraunt")){
            console.log("Restaurant "+response.data.places[i].displayName.text+" not saved--fast food restaurant!");
        }
        else if (response.data.places[i].types.includes("restaurant") == false){
            console.log(response.data.places[i].displayName.text+" not saved--not a restaurant!")
        }
    }
    if (pageToken){
        process.stdout.write("Waiting until pageToken is valid");
        process.stdout.write(".");
        await delay(1000);
        process.stdout.write(".");
        await delay(1000);
        process.stdout.write(".\n");
        await delay(1000);
        console.log("Parsing next page of results...");
        await delay(1000);
        nextPage(pageToken, query);
    }
    else {
        console.log("No more results...")
    }
}

async function nextPage(pageToken, query){
    const response = await axios.post(endpoint,
        {
            textQuery: query,
            pageToken: pageToken
        },
        { headers: {
            'pageSize' : 20,
            'X-Goog-Api-Key' : API_KEY,
            'X-Goog-FieldMask': 'nextPageToken,places.displayName.text,places.types,places.primaryType,places.formattedAddress,places.rating,places.priceLevel,places.location',
        }}
    );
    logResults(response, response.data.nextPageToken, query);
}
module.exports = httpSearchText;