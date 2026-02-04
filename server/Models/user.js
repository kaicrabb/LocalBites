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
})

module.exports = mongoose.model('User', user_schema);
