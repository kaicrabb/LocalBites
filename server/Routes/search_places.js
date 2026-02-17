const Restaurant = require('../Models/places');
//google places integration
require('dotenv').config(); 
const {PlacesClient} = require('@googlemaps/places').v1;
const { GoogleAuth } = require('google-auth-library');
const API_KEY = process.env.API_KEY;
const authClient = new GoogleAuth().fromAPIKey(API_KEY);
const placesClient = new PlacesClient({authClient});

//chain restaurants list
const chains = ["McAlister's Deli", "Planet Sub", "Buffalo Wild Wings GO", "Applebee's Grill + Bar", "Chick-fil-A"];

async function callSearchText(query) {
  const request = {
    textQuery: query,
  };

  // Run request
  const [response] = await placesClient.searchText(request, {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask': 'places.displayName.text,places.types,places.formattedAddress',
      },
    },
  });
  for (let i = 0; i < response.places.length; i++) {
    const exists = await Restaurant.findOne({displayName: response.places[i].displayName.text});
    const chain = chains.includes(response.places[i].displayName.text);
    if (!exists && !chain) {
        const workingRestaurant = new Restaurant({
            displayName: response.places[i].displayName.text,
            types: response.places[i].types,
            formattedAddress: response.places[i].formattedAddress
        });
        await workingRestaurant.save();
        console.log("New Restaurant saved!");
    } 
    else if (exists){
        console.log("Restaurant "+response.places[i].displayName.text+" already exists!");
    }
    else if (chain){
        console.log("Restaurant "+response.places[i].displayName.text+" not saved--chain restaurant!");
    }
    }
    //console.log(response.places);
    //console.log(response.places[i].displayName.text); 
    //console.log(">"+response.places[i].types);
    //console.log(">"+response.places[i].formattedAddress+"\n");
}

module.exports = callSearchText;