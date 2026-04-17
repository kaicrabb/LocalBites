/*
    * This file defines the Mongoose schema and model for the "User" collection in the MongoDB database.
    * Each document in this collection represents a user of the application, who can leave reviews for restaurants.
    * The schema includes fields for the username, email, password, whether the user is an admin, and whether the user is banned.
    * The model is exported for use in other parts of the application, such as in the authentication routes and admin routes.
*/

const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    Username: { 
        type: String, 
        required: false, 
        unique: true // Ensure the username is unique
    },
    Email: { // requires users to create/have an email to login/signup
        type: String,
        required: true,
        unique: true, // Ensure the email is unique
        lowercase: true, // Store email in lowercase
        trim: true, // Remove whitespace from both ends of the email
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    Password: { // requires users to create/have a password to login/signup
        type: String, 
        required: true 
    },
    IsAdmin: { // boolean to determine if user is an admin or not
        type: Boolean,
        required: false,
        default: false
    },
    isBanned: { // boolean to determine if user is banned or not
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = mongoose.model('User', user_schema);
