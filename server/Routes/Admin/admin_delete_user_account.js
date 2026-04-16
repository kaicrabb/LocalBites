const user = require('../../Models/user');

async function adminDeleteUserAccount(req, res) {
    const userIdToDelete = req.body.userId; //get user id from the request body

    if (!req.user.IsAdmin) {// check that the user is an admin
        console.log('Unauthorized to delete this user account:', userIdToDelete, 'by user:', req.user.id);
        return res.status(403).json({ message: 'Not authorized to delete this user account' });
    }
    try {
        //checking if user exists
        const userToDelete = await user.findById(userIdToDelete);
        if (!userToDelete) {
            console.log('User not found:', userIdToDelete);
            return res.status(404).json({ message: 'User not found' });
        }
        //deleting the user
        await user.findByIdAndDelete(userIdToDelete);
        console.log('User account deleted successfully by admin:', userIdToDelete);
        return res.status(200).json({ message: 'User account deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminDeleteUserAccount;