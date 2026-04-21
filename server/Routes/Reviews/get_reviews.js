/*
    * This file defines the route handler for fetching reviews for a restaurant or a user.
    * The route expects a GET request with either a placeId (to fetch reviews for a restaurant) or a userId (to fetch reviews made by a user) as query parameters.
    * The handler retrieves the relevant reviews from the database based on the provided query parameter and returns them in the response.
    * If a placeId is provided, the handler populates the User field in the reviews to include the reviewer's username and email. 
    * If a userId is provided, the handler populates the Place field to include basic information about the restaurant being reviewed.
    * Appropriate error responses are sent back to the client if there is an issue with fetching the reviews or if there is a server error during the retrieval process.
    * This route can be used by clients to display reviews for a specific restaurant or to show a user's review history.
*/

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