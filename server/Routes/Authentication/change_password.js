const bcrypt = require('bcryptjs');
const User = require('../../Models/user');

async function changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated token

    try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            console.log(userId);
            return res.status(404).json({message: 'User not found' });
        }
        // Check if the current password is correct
        const passMatch = await bcrypt.compare(currentPassword, user.Password);
        if (!passMatch) {
            console.log("Incorrect original password");
            return res.status(400).json({message: 'Current password is incorrect' });
        }

        const passpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passpattern.test(newPassword)) {
            console.log("New password does not meet complexity requirements");
            return res.status(400).json({message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // Update the user's password in the database
        user.Password = hashedNewPassword;
        await user.save();
        console.log("Password changed successfully");
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = changePassword;