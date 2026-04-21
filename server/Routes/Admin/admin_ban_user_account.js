/*
    * This file defines the route handler for banning a user account by an admin.
    * The route expects a POST request with the user ID to ban, the reason for the ban, and the duration of the ban in hours.
    * The handler checks if the requester is an admin, verifies that the user to be banned exists, creates a new ban entry in the Bans collection, and updates the user's status to banned in the User collection.
    * Appropriate success and error responses are sent back to the client based on the outcome of the operation.
    * This route is protected and should only be accessible to users with admin privileges.
*/
const User = require('../../Models/user');
const Bans = require('../../Models/bans');

async function adminBanUserAccount(req, res) {
    const userIdToBan = req.body.userId; //get user id from the request body
    const banReason = req.body.reason; //get ban reason from the request body
    const banDuration = req.body.duration; //get ban duration from the request body
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to ban this user account:', userIdToBan, 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to ban this user account' });
    }
    try {
        // Check if the user exists
        const userToBan = await User.findById(userIdToBan);
        if (!userToBan) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new ban entry
        const newBan = new Bans({
            userId: userIdToBan,
            reason: banReason,
            bannedAt: new Date(),
            expiresAt: new Date(Date.now() + banDuration * 60 * 60 * 1000) // Convert hours to milliseconds
        });

        // Save the ban entry
        await newBan.save();
        await User.findByIdAndUpdate(userIdToBan, { isBanned: true }); // Update the user's status to banned

        res.status(200).json({ message: 'User banned successfully' });
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminBanUserAccount;