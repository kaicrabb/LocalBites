const jwt = require('jsonwebtoken'); // Import jsonwebtoken for tokenization
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from the Authorization header
  
    if (!token) {
        return res.sendStatus(401);  // No token, unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;  // Store user info in the request object
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;