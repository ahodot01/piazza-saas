// AUTHENTICATION AND AUTHORIZATION
const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const router = express.Router();

// JSONWEBTOKEN VERIFICATION
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user details to the request
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

// AUTHENTICATION ROUTES
router.post('/register', authController.register); // REGISTER 
router.post('/login', authController.login);       // LOGIN

module.exports = {
    router,       // ROUTES HANDLING
    verifyToken,  // TOKEN VERIFICATION
};