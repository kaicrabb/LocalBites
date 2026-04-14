const user = require('../../Models/user');

async function adminGetAllUsers(req, res) {
    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to get all users:', 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to get all users' });
    }
    try {
        const allUsers = await user.find(--{ Password: 0 });
        return res.status(200).json({ users: allUsers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminGetAllUsers;
