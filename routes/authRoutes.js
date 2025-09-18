const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Đăng ký
router.post('/register', async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Đăng nhập
router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        req.session.userId = user._id;
        res.json({ message: 'Login successful!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đăng xuất
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logout successful!' });
    });
});

// Kiểm tra trạng thái login
router.get('/me', async(req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
});

module.exports = router;