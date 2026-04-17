/*
    * This file defines the Mongoose schema and model for the "Bans" collection in the MongoDB database.
    * Each document in this collection represents a ban on a user account.
    * The schema includes fields for the user ID (referencing the User model), reason for the ban, the date and time when the ban was issued, and when it expires.
    * The model is exported for use in other parts of the application, such as in the admin routes for banning and unbanning users.
*/

const mongoose = require('mongoose');

const bans_schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    },
    bannedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Bans', bans_schema);