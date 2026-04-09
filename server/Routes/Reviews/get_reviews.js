// ensure related models are registered with mongoose
require('../../Models/user');
require('../../Models/places');
const Review = require('../../Models/reviews');

async function getReviews(req, res) {
    try {
        console.log('Fetching reviews for query parameters:', req.query);
        const { placeId, userId } = req.query
        if (placeId) {
            const reviews = await Review.find({ Place: placeId }).populate('User', 'Username Email');
            console.log(`Found ${reviews.length} reviews for placeId ${placeId}`);
            return res.status(200).json({ reviews });
        }
        else if (userId){
            const reviews = await Review.find({ User: userId }).populate('Place');
            console.log(`Found ${reviews.length} reviews for userId ${userId}`);
            return res.status(200).json({ reviews });
        }
        else {
            return res.status(400).json({ message: 'placeId or UserId parameter is required' });
        }
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getReviews;