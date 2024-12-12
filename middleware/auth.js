const jwt = require('jsonwebtoken');

// Middleware to verify JWT
module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from header

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};
