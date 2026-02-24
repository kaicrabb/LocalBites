const mongoose = require('mongoose');

const places_schema = new mongoose.Schema({
    displayName: { 
        type: String, 
        required: true, 
        unique: true
    },
    primaryType: {
        type: String,
        required: true,
        unique: false,
    },
    types: {
        type: Array,
        required: true,
        unique: false,
    },
    formattedAddress: {
        type: String, 
        required: true,
        unique: false, 
    },
     rating: {
        type: String, 
        required: true,
        unique: false,
    },
     priceLevel: {
        type: String, 
        required: true,
        unique: false,
    },
})

module.exports = mongoose.model('Restaurant', places_schema);
