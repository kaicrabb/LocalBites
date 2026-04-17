/*
    * This file defines the route handler for fetching the authenticated user's information.
    * The route expects a GET request and requires the user to be authenticated (i.e., req.user should be populated by the authentication middleware).
    * The handler retrieves the user's information from the database using the user ID obtained from the authenticated token and returns the user details in the response, excluding sensitive information such as the password.
    * Appropriate error responses are sent back to the client if the user is not found or if there is a server error during the retrieval process.
    * This route can be used by clients to display the authenticated user's profile information or to fetch user details for other authenticated operations.
*/
const user = require('../Models/user');

async function getUserInfo(req, res) {
    try {
        const userId = req.user.id;
        const userInfo = await user.findById(userId).select('-Password'); // Exclude password from the response
        if (!userInfo) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: userInfo });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getUserInfo;