const express = require('express');
const postController = require('../controllers/postController');
const { verifyToken } = require('./routes/auth');
const router = express.Router();

// VARIOUS ROUTES FOR ACTIVITES TO BE PERFORMED BY USERS
router.post('/', authMiddleware, postController.createPost); // PERFORM POST
router.get('/:topic', authMiddleware, postController.getPostsByTopic); // FETCH POSTS BY TOPIC
router.post('/:postId/report', authMiddleware, postController.reportPost); // PERFORM REPORT
router.post('/:postId/views', authMiddleware, postController.incrementPostViews); // POSTS' VIEW COUNT
router.post('/:postId/like', authMiddleware, postController.likePost); // PERFORM LIKE
router.post('/:postId/dislike', authMiddleware, postController.dislikePost); // PERFORM DISLIKE
router.post('/:postId/comment', authMiddleware, postController.addComment); // PERFORM COMMENT
router.get('/:topic/expired', authMiddleware, postController.getExpiredPosts); // GET EXPIRED POST/S
router.get('/:topic/most-active', authMiddleware, postController.getMostActivePost); // MOST ACTIVE POST

module.exports = router;