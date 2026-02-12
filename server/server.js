// General server code,imports other sections of backend code

// Import required outside modules
const express = require('express');
const bodyParser = require("body-parser"); // Import body-parser for middleware
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for tokenization
const bcrypt = require('bcryptjs'); // Import bcrypt for encryption
const cors = require('cors'); // Importing cors module

// Import backend modules
const connectDB = require('./Config/db');
const createExampleUser = require('./Routes/example_user');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// Connect to the database
connectDB();

// Run Routes code
//createExampleUser(); // creates an example user in the database

//google places integration
require('dotenv').config(); 
const {PlacesClient} = require('@googlemaps/places').v1;
const { GoogleAuth } = require('google-auth-library');
const API_KEY = process.env.API_KEY;
const authClient = new GoogleAuth().fromAPIKey(API_KEY);
const placesClient = new PlacesClient({authClient});

async function callSearchText(query) {
  const request = {
    textQuery: query,
  };

  // Run request
  const [response] = await placesClient.searchText(request, {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask': 'places.displayName.text',
      },
    },
  });
  for (let i = 0; i < 10; i++) {
    console.log(response.places[i].displayName.text); 
    }
}

callSearchText("Restaurants in Maryville, MO");

// listen on port
app.listen(port, () => { 
    console.log("Server started on port " + port);
});

