// schema for user bans, used to store banned users and their ban details
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
