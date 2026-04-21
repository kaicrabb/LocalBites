/*
    * This file defines the Mongoose schema and model for the "Reviews" collection in the MongoDB database.
    * Each document in this collection represents a review left by a user for a restaurant.
    * The schema includes fields for the user ID (referencing the User model), place ID (referencing the Restaurant model), an optional comment, and a required rating between 1 and 5.
    * The model is exported for use in other parts of the application, such as in the routes for creating and fetching reviews.
*/

const mongoose = require('mongoose');

const rating_schema = new mongoose.Schema({
    User: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    Place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    Comment:{
        type: String,
        trim: true
    },
    Rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
})

module.exports = mongoose.model('Review', rating_schema);