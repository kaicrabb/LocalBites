// General server code,imports other sections of backend code

// Import required outside modules
const express = require('express');
const bodyParser = require("body-parser"); // Import body-parser for middleware
const cors = require('cors'); // Importing cors module

// Import backend modules
const connectDB = require('./Config/db');
//const createExampleUser = require('./Routes/example_user');
//const runDemoReview = require('./Routes/example_review');
const callSearchText = require('./Routes/Google_Api/search_places.js');
const signup = require('./Routes/Authentication/signup');
const login = require('./Routes/Authentication/login');
const changePassword = require('./Routes/Authentication/change_password');
const authenticateToken = require('./Routes/Authentication/authtoken');
const deleteAccount = require('./Routes/Authentication/delete_account');
const userInfo = require('./Routes/user_info');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// Connect to the database
connectDB();

//maryville api query
callSearchText("food", 40.3461, -94.8729, 100);

// Create example user
// createExampleUser();
//runDemoReview();
app.post("/Authentication/signup", signup)
app.post("/Authentication/login", login)
app.post("/Authentication/change_password", authenticateToken, changePassword)
app.post("/Authentication/delete_account", authenticateToken, deleteAccount)
app.get("/user_info", authenticateToken, userInfo);

// listen on port
app.listen(port, () => { 
    console.log("Server started on port " + port);
});

