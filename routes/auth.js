// AUTHENTICATION AND AUTHORIZATION
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
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

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.NGROK_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            // Handle Google profile data
            console.log('Google Profile:', profile);
            // You can save the user profile to the database here, if needed
            return done(null, profile);
        }
    )
);

// Serialize and deserialize user (required for Passport)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// AUTHENTICATION ROUTES
router.post('/register', authController.register); // REGISTER 
router.post('/login', authController.login);       // LOGIN

// Google OAuth Routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }) // Google login route
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.send('Google OAuth Successful!');
    }
);

module.exports = {
    router,       // ROUTES HANDLING
    verifyToken,  // TOKEN VERIFICATION
};