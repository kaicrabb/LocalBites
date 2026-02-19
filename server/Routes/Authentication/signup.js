const bcrypt = require('bcryptjs');
const User = require('../../Models/user');
const login = require('./login');
const SECRET_KEY = process.env.SECRET_KEY;

async function signup(req, res) {
    const { Username, Email, Password } = req.body;
    try {
        // Check if the email or username already exists in the database
        const existingEmail = await User.findOne({ Email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const existingUsername = await User.findOne({ Username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        // Regex for password and username validation
        const userpattern = /^[a-zA-Z0-9_]{3,20}$/
        const passpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        // Validate username and password against the regex patterns
        if (!userpattern.test(Username)) {
            return res.status(400).json({ message: 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores' });
        }
        if (!passpattern.test(Password)) {
            console.log(Password)
            return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new user instance
        const newUser = new User({
            Username,
            Email,
            Password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();
        // Automatically log in the user after successful signup
        return login(req, res);
        
        
    }
    catch(err){}
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

module.exports = signup;