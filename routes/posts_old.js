const express = require('express');
const postController = require('piazza-saas/controllers/postController');
const authMiddleware = require('piazza-saas/middleware/auth');
const router = express.Router();

// Protect routes with the auth middleware
router.post('/', authMiddleware, postController.createPost); // Create a post
router.get('/:topic', authMiddleware, postController.getPostsByTopic); // Browse posts by topic

module.exports = router;