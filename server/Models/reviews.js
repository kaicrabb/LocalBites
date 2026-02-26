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