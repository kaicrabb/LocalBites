const Review = require('../../Models/reviews');

async function addReview(req, res) {
    try {
        const userId = req.user?.id;
        const { placeId, rating, comment } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!placeId || typeof rating !== 'number') {
            return res.status(400).json({ message: 'placeId and numeric rating are required' });
        }

        const review = new Review({
            User: userId,
            Place: placeId,
            Rating: rating,
            Comment: comment || '',
        });

        await review.save();
        res.status(201).json({ review });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = addReview;