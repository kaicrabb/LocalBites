/*
    * This file defines the route handler for adding a review for a restaurant.
    * The route expects a POST request with the restaurant's placeId, the rating (a number between 1 and 5), and an optional comment in the request body.
    * The handler checks if the user is authenticated, validates the input data, creates a new review document in the database linking the review to the user and the restaurant, and returns the created review in the response.
    * Appropriate error responses are sent back to the client if the user is not authenticated, if required fields are missing or invalid, or if there is a server error during the review creation process.
    * This route is protected and should only be accessible to authenticated users.
*/

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