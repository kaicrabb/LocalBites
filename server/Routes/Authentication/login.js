const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/user');
const admin = require('firebase-admin');
const SECRET_KEY = process.env.SECRET_KEY;

const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

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

        const firebaseToken = await admin.auth().createCustomToken(user._id.toString());

        const token = jwt.sign(
            { id: user._id, email: user.Email },
            SECRET_KEY,
            { expiresIn: '1y' }
        );

        const safeUser = { id: user._id, Username: user.Username, Email: user.Email };
        res.json({ token, firebaseToken, user: safeUser });

    } catch (error){
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = login;