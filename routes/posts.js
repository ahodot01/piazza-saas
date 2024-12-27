const { verifyToken } = require('./auth');
const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

// VARIOUS ROUTES FOR ACTIVITES TO BE PERFORMED BY USERS
router.post('/', verifyToken, postController.createPost); // PERFORM POST
router.get('/:topic', verifyToken, postController.getPostsByTopic); // FETCH POSTS BY TOPIC
router.post('/:postId/report', verifyToken, postController.reportPost); // PERFORM REPORT
router.post('/:postId/views', verifyToken, postController.incrementPostViews); // POSTS' VIEW COUNT
router.post('/:postId/like', verifyToken, postController.likePost); // PERFORM LIKE
router.post('/:postId/dislike', verifyToken, postController.dislikePost); // PERFORM DISLIKE
router.post('/:postId/comment', verifyToken, postController.addComment); // PERFORM COMMENT
router.get('/:topic/expired', verifyToken, postController.getExpiredPosts); // GET EXPIRED POST/S
router.get('/:topic/most-active', verifyToken, postController.getMostActivePost); // MOST ACTIVE POST

module.exports = router;

// console.log(module.exports);