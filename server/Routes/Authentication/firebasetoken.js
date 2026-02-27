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