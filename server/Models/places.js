const mongoose = require('mongoose');

const places_schema = new mongoose.Schema({
    displayName: { 
        type: String, 
        required: true, 
        unique: true
    },
    types: {
        type: Array,
        required: true,
        unique: true,
    },
    formattedAddress: {
        type: String, 
        required: true 
    },
})

module.exports = mongoose.model('Restaurant', places_schema);
