const User = require('../../Models/user');
const bcrypt = require('bcryptjs');

async function deleteAccount(req, res) {
    const userId = req.user.userId; // Get user ID from the authenticated token
    const Password = req.body.Password; // Get password from the request body
    try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for deletion:', userId);
            return res.status(404).json({message: 'User not found' });
        }
        // Delete the user from the database
        const passMatch = await bcrypt.compare(Password, user.Password);
        if (passMatch){
            await User.findByIdAndDelete(userId);
            console.log('User deleted successfully:', userId);
            return res.status(200).json({ message: 'Account deleted successfully' });
        } 
        else {
            console.log('Incorrect password for account deletion:', userId);
            return res.status(400).json({message: 'Password is incorrect' });
        }
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteAccount;