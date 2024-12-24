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
    const user = req.user.name;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (post.status === 'Expired' || new Date() > post.expiration) {
            return res.status(400).send('Post is expired. No further interactions allowed.');
        }

        if (post.owner === user) {
            return res.status(400).send('Post owner cannot like their own post');
        }

        if (post.likes.includes(user)) {
            return res.status(400).send('You have already liked this post');
        }

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

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (post.status === 'Expired' || new Date() > post.expiration) {
            return res.status(400).send('Post is expired. No further interactions allowed.');
        }

        // Increment the dislikes count
        post.dislikes += 1;
        await post.save();

        res.status(200).send('Post disliked successfully');
    } catch (error) {
        console.error('Error disliking post:', error.message);
        res.status(500).send('Server error');
    }
};

// ADD COMMENT
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (!comment) {
            return res.status(400).send('Comment message is required');
        }

        if (post.status === 'Expired' || new Date() > post.expiration) {
            return res.status(400).send('Post is expired. No further interactions allowed.');
        }

        // Add the comment to the post
        post.comments.push({
            user: req.user.name, // Assuming `authMiddleware` adds the `user` object
            message: comment,
            timestamp: new Date(),
        });

        await post.save();
        res.status(200).send('Comment added successfully');
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).send('Server error');
    }
};

// GET EXPIRED POSTS
exports.getExpiredPosts = async (req, res) => {
    const { topic } = req.params;

    try {
        const expiredPosts = await Post.find({ topic, status: 'Expired' });

        if (expiredPosts.length === 0) {
            return res.status(404).send('No expired posts found for this topic');
        }

        res.status(200).send(expiredPosts);
    } catch (error) {
        console.error('Error fetching expired posts:', error.message);
        res.status(500).send('Server error');
    }
};

// GET MOST ACTIVE POST
exports.getMostActivePost = async (req, res) => {
    const topic = req.params.topic;

    try {
        // Find the most active post by topic based on the sum of likes and dislikes
        const mostActivePost = await Post.find({ topic, status: 'Live' })
            .sort({ likes: -1, dislikes: -1 }) // Sort first by likes, then dislikes in descending order
            .limit(1); // Fetch the top post

        if (mostActivePost.length === 0) {
            return res.status(404).send('No active posts found for this topic');
        }

        res.status(200).send(mostActivePost[0]); // Return the most active post
    } catch (error) {
        console.error('Error fetching most active post:', error.message);
        res.status(500).send('Server error');
    }
};