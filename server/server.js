// General server code,imports other sections of backend code

// Import required outside modules
const express = require('express');
const bodyParser = require("body-parser"); // Import body-parser for middleware
const cors = require('cors'); // Importing cors module

// Import backend modules
const connectDB = require('./Config/db');
//const createExampleUser = require('./Routes/example_user');
// const callSearchText = require('./Routes/search_places.js');
const signup = require('./Routes/Authentication/signup');
const login = require('./Routes/Authentication/login');
const changePassword = require('./Routes/Authentication/change_password');
const authenticateToken = require('./Routes/Authentication/authtoken');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// Connect to the database
connectDB();

//google maps api search
//callSearchText("Restaurants in Maryville, MO");


// Create example user
// createExampleUser();
app.post("/Authentication/signup", signup)
app.post("/Authentication/login", login)
app.post("/Authentication/change_password", authenticateToken, changePassword)

// listen on port
app.listen(port, () => { 
    console.log("Server started on port " + port);
});

