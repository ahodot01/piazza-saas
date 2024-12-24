const Post = require('../models/Post');

const checkPostExpiration = async (req, res, next) => {
    try {
        // UPDATE IF EXPIRATION TIME PASSED
        await Post.updateMany(
            { expiration: { $lt: new Date() }, status: 'Live' },
            { $set: { status: 'Expired' } }
        );
        next(); // NEXT MIDDLEWARE OR ROUTE HANDLER
    } catch (error) {
        console.error('Error checking post expiration:', error.message);
        res.status(500).send('Error checking post expiration');
    }
};

module.exports = checkPostExpiration;