const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/user');
const admin = require('./firebase_admin');
const SECRET_KEY = process.env.SECRET_KEY;
const Bans = require('../../Models/bans');

async function login(req, res){
    try{
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne ({ Email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email'});
        }
        const valid = await bcrypt.compare(Password, user.Password);
        if (!valid){
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Check if the user is banned
        const banRecord = await Bans.findOne({ userId: user._id });
        if (banRecord) {
            const currentTime = new Date();
            if (banRecord.expiresAt > currentTime) {
                return res.status(403).json({ message: `Your account is banned until ${banRecord.expiresAt}. Reason: ${banRecord.reason}` });
            }
            // If the ban has expired, remove the ban record and allow login
            await Bans.findOneAndDelete({ userId: user._id });
        }
        

        const token = jwt.sign(
            { id: user._id, email: user.Email },
            SECRET_KEY,
            { expiresIn: '1y' }
        );

        const firebaseToken = await admin.auth().createCustomToken(
            user._id.toString(),
            { username: user.Username, email: user.Email }
        );
            
        const safeUser = { id: user._id, Username: user.Username, Email: user.Email };
        res.json({ token, firebaseToken, user: safeUser });

    } catch (error){
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = login;