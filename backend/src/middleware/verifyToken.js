import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Check if authorization header exists and starts with 'Bearer '
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ msg: "No token, authorization denied" }); // No token provided
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret', (err, decoded) => {
        if (err) {
            // Token is not valid (e.g., expired, malformed)
            return res.status(403).json({ msg: "Token is not valid" });
        }
        req.userID = decoded.userID; // Attach the user ID from the token to the request object
        req.email = decoded.email;   // Attach the email from the token to the request object
        next(); // Proceed to the next middleware/route handler
    });
};