const Post = require('../models/Post');

const checkPostExpiration = async (req, res, next) => {
    try {
        // Update all posts where the expiration time has passed
        await Post.updateMany(
            { expiration: { $lt: new Date() }, status: 'Live' },
            { $set: { status: 'Expired' } }
        );
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        console.error('Error checking post expiration:', error.message);
        res.status(500).send('Error checking post expiration');
    }
};

module.exports = checkPostExpiration;