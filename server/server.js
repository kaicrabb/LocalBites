// General server code, imports other sections of backend code

// Import required outside modules
const express = require('express');
const bodyParser = require("body-parser"); // Import body-parser for middleware
const cors = require('cors'); // Importing cors module

// Import backend modules
const connectDB = require('./Config/db');
//const createExampleUser = require('./Routes/example_user');
//const runDemoReview = require('./Routes/example_review');
// const callSearchText = require('./Routes/Google_Api/search_places.js');
// const httpSearchText = require('./Routes/Google_Api/http_search_places.js');
const getLocation = require('./Routes/Google_Api/get_location.js');
const getNearbyRestaurants = require('./Routes/Google_Api/nearby_restaurants');
const getRestaurantDetails = require('./Routes/Google_Api/restaurant_details');
const signup = require('./Routes/Authentication/signup');
const login = require('./Routes/Authentication/login');
const changePassword = require('./Routes/Authentication/change_password');
const authenticateToken = require('./Routes/Authentication/authtoken');
const deleteAccount = require('./Routes/Authentication/delete_account');
const userInfo = require('./Routes/user_info');
const supplyFirebaseToken = require('./Routes/Authentication/firebasetoken');
const addReview = require('./Routes/Reviews/add_review');
const getReview = require('./Routes/Reviews/get_reviews');
const deleteReview = require('./Routes/Reviews/delete_review');

// admin routes
const adminDeleteReview = require('./Routes/Admin/admin_delete_review');
const adminDeleteUserAccount = require('./Routes/Admin/admin_delete_user_account');
const adminRemoveRestaurant = require('./Routes/Admin/admin_remove_restaurant');
const adminBanUser = require('./Routes/Admin/admin_ban_user_account');
const adminUnbanUser = require('./Routes/Admin/admin_unban_user_account');
const adminGetAllUsers = require('./Routes/Admin/admin_get_all_users');
const adminGetAllRestaurants = require('./Routes/Admin/admin_get_all_restaurants');
const adminGetAllBans = require('./Routes/Admin/admin_get_all_bans.js');

async function startServer(){
    // Initialize Express app
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware
    app.use(bodyParser.json());
    app.use(cors());

    // Connect to the database
    await connectDB();

    // User post routes
    app.post("/Authentication/signup", signup)
    app.post("/Authentication/login", login)
    app.post("/Authentication/change_password", authenticateToken, changePassword)
    app.post("/Authentication/delete_account", authenticateToken, deleteAccount)
    app.post("/reviews", authenticateToken, addReview); 
    app.post("/reviews/delete", authenticateToken, deleteReview);

    // User get routes
    app.get("/user_info", authenticateToken, userInfo);
    app.get("/Authentication/firebase_token", authenticateToken, supplyFirebaseToken);
    app.get("/Google_Api/nearby_restaurants", getNearbyRestaurants);
    app.get("/Google_Api/restaurant_details", getRestaurantDetails);
    app.get("/Google_Api/get_location", getLocation);
    app.get("/reviews", getReview);
    
    // Admin post routes
    app.post("/Admin/delete_review", authenticateToken, adminDeleteReview);
    app.post("/Admin/delete_user_account", authenticateToken, adminDeleteUserAccount);
    app.post("/Admin/remove_restaurant", authenticateToken, adminRemoveRestaurant);
    app.post("/Admin/ban_user", authenticateToken, adminBanUser);
    app.post("/Admin/unban_user", authenticateToken, adminUnbanUser);

    // Admin get routes
    app.get("/Admin/get_all_users", authenticateToken, adminGetAllUsers);
    app.get("/Admin/get_all_restaurants", authenticateToken, adminGetAllRestaurants);
    app.get("/Admin/get_all_bans", authenticateToken, adminGetAllBans);

    app.listen(port, () => { 
        console.log("Server started on port " + port);
    });
}

//Start the server
startServer();

//Optional testing code, uncomment to run
//callSearchText("food", 40.3461, -94.8729, 100);
//httpSearchText(40.3461, -94.8729);
//getLocation(40.3461, -94.8729);
// createExampleUser();
// runDemoReview();