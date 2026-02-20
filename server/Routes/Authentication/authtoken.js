const jwt = require('jsonwebtoken'); // Import jsonwebtoken for tokenization
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    console.log("AUTH HEADER:", req.headers.authorization);
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from the Authorization header
  
    if (!token) {
        console.log("NO TOKEN");
        return res.sendStatus(401);  // No token, unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("JWT ERROR:", err.message);
            return res.sendStatus(403).json({ message: "Forbidden" });
        }
        req.user = user;  // Store user info in the request object
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;