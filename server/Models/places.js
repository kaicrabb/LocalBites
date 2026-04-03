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
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
        default: "-1",
    },
     priceLevel: {
        type: String, 
        required: false,
        unique: false,
        default: "PRICE_LEVEL_UNKNOWN",
    },
        servesLunch: {
        type: Boolean,
        required: false,
        unique: false,
        default: false,
    },
    servesBreakfast: {
        type: Boolean,
        required: false,
        unique: false,
        default: false,
    },
    servesDinner: {
        type: Boolean,
        required: false,
        unique: false,
        default: false,
    },
    delivery: {
        type: Boolean,
        required: false,
        unique: false,
        default: false,
    },
    dineIn: {
        type: Boolean,
        required: false,
        unique: false,
        default: false,
    },
    nationalPhoneNumber: {
        type: String,
        required: false,
        unique: false,
    },
    websiteUri: {
        type: String,
        required: false,
        unique: false,
    },
    regularOpeningHours: {
        type: Object,
        required: false,
        unique: false,
    },
    photos: {
        type: Array,
        required: false,
        unique: false,
    },
});

places_schema.index({ location: "2dsphere" })

module.exports = mongoose.model('Restaurant', places_schema);
