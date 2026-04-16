const user = require('../Models/user');

async function getUserInfo(req, res) {
    try {
        const userId = req.user.id;
        const userInfo = await user.findById(userId).select('-Password'); // Exclude password from the response
        if (!userInfo) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: userInfo });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getUserInfo;