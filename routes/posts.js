const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/:topic', authMiddleware, postController.getPostsByTopic);

module.exports = router;