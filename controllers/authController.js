const User = require('../models/User');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');

// USER REGISTRATION
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // INPUT VALIDATION
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // EMAIL VALIDATION
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters.');
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send('User registered');
};

// LOGIN USER
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    // TOKEN GENERATION
    const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // TOKEN EXPIRES IN 1 HOUR
    );

    res.send({ token });
};