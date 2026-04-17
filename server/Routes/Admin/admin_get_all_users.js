/*
    * This file defines the route handler for retrieving all users by an admin.
    * The route expects a GET request and does not require any parameters.
    * The handler checks if the requester is an admin and retrieves all user documents from the User collection in the database, excluding the password field for security reasons.
    * Appropriate success and error responses are sent back to the client based on the outcome of the operation.
    * This route is protected and should only be accessible to users with admin privileges.
*/

const user = require('../../Models/user');

async function adminGetAllUsers(req, res) {
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to get all users:', 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to get all users' });
    }
    try {
        const allUsers = await user.find().select('-Password');
        return res.status(200).json({ users: allUsers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminGetAllUsers;
