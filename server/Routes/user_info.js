const user = require('../Models/user');

async function getUserInfo(req, res) {
    try {
        const userId = req.user.id;
        res.status(200).json({ userId });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getUserInfo;