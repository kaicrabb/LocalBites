const Restaurant = require('../Models/places');
//google places integration
require('dotenv').config(); 
const {PlacesClient} = require('@googlemaps/places').v1;
const { GoogleAuth } = require('google-auth-library');
const API_KEY = process.env.API_KEY;
const authClient = new GoogleAuth().fromAPIKey(API_KEY);
const placesClient = new PlacesClient({authClient});

//chain restaurants list
const chains = ["McAlister's Deli", "Planet Sub", "Buffalo Wild Wings GO", "Applebee's Grill + Bar", "Chick-fil-A", "McDonalds", "Taco Bell", "Burger King", "Pizza Ranch", "Sonic Drive-In", "Jimmy John's"];

async function callSearchText(query, lat, long, radius) {
  const request = {
    textQuery: query,
    locationBias: {
        "circle": {
            "center": {
                "latitude": lat,
                "longitude": long
            },
            "radius": radius
        }
    },
  };

  // Run request
  const [response] = await placesClient.searchText(request, {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask': 'nextPageToken,places.displayName.text,places.types,places.primaryType,places.formattedAddress,places.rating,places.priceLevel',
      },
    },
  });
  for (let i = 0; i < response.places.length; i++) {
    const exists = await Restaurant.findOne({displayName: response.places[i].displayName.text});
    const chain = chains.includes(response.places[i].displayName.text);
    if (!exists && !chain && response.places[i].primaryType != "fast_food_restauraunt") {
        const workingRestaurant = new Restaurant({
            displayName: response.places[i].displayName.text,
            primaryType: response.places[i].primaryType,
            types: response.places[i].types,
            formattedAddress: response.places[i].formattedAddress,
            rating: response.places[i].rating,
            priceLevel: response.places[i].priceLevel
        });
        await workingRestaurant.save();
        console.log("New Restaurant "+response.places[i].displayName.text+" saved!");
    } 
    else if (exists){
        console.log("Restaurant "+response.places[i].displayName.text+" already exists!");
    }
    else if (chain){
        console.log("Restaurant "+response.places[i].displayName.text+" not saved--chain restaurant!");
    }
    else if (response.places[i].primaryType == "fast_food_restaurant"){
        console.log("Restaurant "+response.places[i].displayName.text+" not saved--fast food restaurant!");
    }
    }
    //console.log(response.nextPageToken)
}

module.exports = callSearchText;