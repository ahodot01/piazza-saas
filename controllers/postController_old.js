exports.createPost = async (req, res) => {
    const { title, topic, body, expiration } = req.body;

    // Input validation
    const validTopics = ['Politics', 'Health', 'Sport', 'Tech'];
    if (!title || !topic || !body || !expiration) {
        return res.status(400).send('All fields are required.');
    }

    if (!validTopics.includes(topic)) {
        return res.status(400).send('Invalid topic. Must be one of: Politics, Health, Sport, Tech.');
    }

    const post = new Post({
        title,
        topic,
        body,
        owner: req.user.name,
        expiration: new Date(Date.now() + expiration * 60000), // Expiration in minutes
    });

    await post.save();
    res.status(201).send(post);
};