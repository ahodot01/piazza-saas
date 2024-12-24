const Post = require('../models/Post');
const Report = require('../models/Report'); // IMPORT REPORT MODEL

// CREATE POST
exports.createPost = async (req, res) => {
    const { title, topic, body, expiration, tags } = req.body;

    // INPUT VALIDATION
    const validTopics = ['Politics', 'Health', 'Sport', 'Tech'];
    if (!title || !topic || !body || !expiration) {
        return res.status(400).send('All fields are required.');
    }

    if (!validTopics.includes(topic)) {
        return res.status(400).send('Invalid topic. Must be one of: Politics, Health, Sport, Tech.');
    }

    try {
        const post = new Post({
            title,
            topic,
            body,
            owner: req.user.name,
            expiration: new Date(Date.now() + expiration * 60000),
            tags: tags || [],
        });

        await post.save();
        res.status(201).send(post);
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).send('Server error');
    }
};

// BROWSE POST BY TOPIC
exports.getPostsByTopic = async (req, res) => {
    const topic = req.params.topic;

    try {
        const posts = await Post.find({ topic, status: 'Live' }); // ONLY LIVE ONES
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error fetching posts by topic:', error.message);
        res.status(500).send('Server error');
    }
};

// REPORT POST
exports.reportPost = async (req, res) => {
    const { postId } = req.params;
    const { reason } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // NEW POST
        const report = new Report({
            postId,
            reportedBy: req.user.name,
            reason,
        });

        await report.save();

        // REPORTS COUNTER
        post.reportedCount += 1;
        await post.save();

        res.status(201).send('Post reported successfully');
    } catch (error) {
        console.error('Error reporting post:', error.message);
        res.status(500).send('Server error');
    }
};

// VIEWS COUNTER
exports.incrementPostViews = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        post.views += 1; // VIEWS COUNTER
        await post.save();

        res.status(200).send(post);
    } catch (error) {
        console.error('Error incrementing post views:', error.message);
        res.status(500).send('Server error');
    }
};

// LIKE POST
exports.likePost = async (req, res) => {
    const { postId } = req.params;
    const user = req.user.name; // Assuming `authMiddleware` adds the `user` object

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Prevent liking the same post multiple times
        if (post.likes.includes(user)) {
            return res.status(400).send('You have already liked this post');
        }

        // Remove user from dislikes if they previously disliked it
        post.dislikes = post.dislikes.filter((dislikeUser) => dislikeUser !== user);

        post.likes.push(user); // Add user to likes
        await post.save();

        res.status(200).send('Post liked successfully');
    } catch (error) {
        console.error('Error liking post:', error.message);
        res.status(500).send('Server error');
    }
};

// DISLIKE POST
exports.dislikePost = async (req, res) => {
    const { postId } = req.params;
    const user = req.user.name; // Assuming `authMiddleware` adds the `user` object

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Prevent disliking the same post multiple times
        if (post.dislikes.includes(user)) {
            return res.status(400).send('You have already disliked this post');
        }

        // Remove user from likes if they previously liked it
        post.likes = post.likes.filter((likeUser) => likeUser !== user);

        post.dislikes.push(user); // Add user to dislikes
        await post.save();

        res.status(200).send('Post disliked successfully');
    } catch (error) {
        console.error('Error disliking post:', error.message);
        res.status(500).send('Server error');
    }
};
