const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Protect routes with the auth middleware
router.post('/', authMiddleware, postController.createPost); // Create a post
router.get('/:topic', authMiddleware, postController.getPostsByTopic); // Browse posts by topic

module.exports = router;