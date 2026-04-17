/*
    * This file defines the route handler for allowing an admin user to retrieve all reviews from the database.
    * The route expects a GET request and does not require any parameters.
    * The handler checks if the requester is an admin and retrieves all review documents from the Reviews collection in the database.
    * For each review, the handler also retrieves the associated user's username and email, as well as the restaurant's display name, to provide more context in the response.
    * Appropriate success and error responses are sent back to the client based on the outcome of the operation.
    * This route is protected and should only be accessible to users with admin privileges.
*/

const reviews = require('../../Models/reviews');
const User = require('../../Models/user');
const Restaurant = require('../../Models/places');

async function adminGetAllReviews(req, res) {
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to get all reviews:', 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to get all reviews' });
    }
    try {
        const allReviews = await reviews.find();
        const reviewsWithUserInfo = await Promise.all(allReviews.map(async (review) => {
            const user = await User.findById(review.userId).select('Username Email');
            const restaurant = await Restaurant.findOne({ placeId: review.placeId }).select('DisplayName');
            return {
                id: review._id,
                userId: review.userId,
                username: user ? user.Username : 'Unknown User',
                email: user ? user.Email : 'Unknown Email',
                placeId: review.placeId,
                restaurantName: restaurant ? restaurant.DisplayName : 'Unknown Restaurant',
                rating: review.rating,
                comment: review.comment,
            };
        }));
        return res.status(200).json({ reviews: reviewsWithUserInfo });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminGetAllReviews;