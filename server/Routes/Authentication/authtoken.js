/*
    * This file defines the middleware function for authenticating JSON Web Tokens (JWT) in incoming requests.
    * The function checks for the presence of a token in the Authorization header, verifies the token using a secret key, and attaches the decoded user information to the request object if the token is valid.
    * If the token is missing or invalid, appropriate error responses are sent back to the client.
    * This middleware can be used to protect routes that require authentication by ensuring that only requests with valid tokens can access those routes.
*/

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
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;  // Store user info in the request object
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;