/*
    * This file defines the route handler for supplying a Firebase custom token to authenticated users.
    * The route expects a GET request and requires the user to be authenticated via a valid JWT token.
    * The handler verifies the user's identity using the authenticated token, retrieves the user's information from the database, and generates a Firebase custom token that includes the user's ID and additional claims such as username and email.
    * The generated Firebase token is then sent back to the client in the response.
    * Appropriate error responses are sent back to the client if the user is not authenticated, if the user is not found in the database, or if there is an error during token generation.
    * This route is protected and should only be accessible to authenticated users.
*/

const admin = require('./firebase_admin');
const User = require('../../Models/user');

async function supplyFirebaseToken(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const firebaseToken = await admin.auth().createCustomToken(
            user._id.toString(),
            { username: user.Username, email: user.Email }
        );
        res.json({ firebaseToken });
    }
    catch (error) {
        console.error('Error generating Firebase token:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = supplyFirebaseToken;