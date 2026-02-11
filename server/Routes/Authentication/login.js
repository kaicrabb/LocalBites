const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

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

        const token = jwt.sign(
            { id: user._id, email: user.Email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        const safeUser = { id: user._id, Username: user.Username, Email: user.Email };
        res.json({ token, user: safeUser });

    } catch (error){
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = login;