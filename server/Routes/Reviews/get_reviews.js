// ensure related models are registered with mongoose
require('../../Models/user');
require('../../Models/places');
const Review = require('../../Models/reviews');

async function getReviews(req, res) {
    try {
        const { placeId } = req.query.placeId;
        const { userId } = req.query.userId;
        if (placeId) {
            const reviews = await Review.find({ Place: placeId }).populate('User', 'Username Email');
            res.status(200).json({ reviews });
        }
        else if (userId){
            const reviews = await Review.find({ Place: userId }).populate('Restaurant');
            res.status(200).json({ reviews });
        }
        else {
            return res.status(400).json({ message: 'placeId parameter is required' });
        }
        res.status(200).json({ reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getReviews;