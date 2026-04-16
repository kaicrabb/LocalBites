const bans = require('../../Models/bans');
const user = require('../../Models/user');

async function adminUnbanUser(req, res) {
    const userIdToUnban = req.body.userId; //get user id from the request body

    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to unban this user account:', userIdToUnban, 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to unban this user account' });
    }
    try {
        //checking if user exists
        const userToUnban = await user.findById(userIdToUnban);
        if (!userToUnban) {
            console.log('User not found:', userIdToUnban);
            return res.status(404).json({ message: 'User not found' });
        }
        //unbanning the user
        await bans.findOneAndDelete({ userId: userIdToUnban });
        await user.findByIdAndUpdate(userIdToUnban, { isBanned: false }); // Update the user's status to unbanned
        console.log('User account unbanned successfully by admin:', userIdToUnban);
        return res.status(200).json({ message: 'User account unbanned successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminUnbanUser;