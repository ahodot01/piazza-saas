const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/:topic', authMiddleware, postController.getPostsByTopic);
router.post('/:postId/report', authMiddleware, postController.reportPost);
router.post('/:postId/views', authMiddleware, postController.incrementPostViews);
router.post('/:postId/like', authMiddleware, postController.likePost); // LIKE
router.post('/:postId/dislike', authMiddleware, postController.dislikePost); // DISLIKE
router.post('/:postId/comment', authMiddleware, postController.addComment);
router.get('/:topic/expired', authMiddleware, postController.getExpiredPosts);

module.exports = router;