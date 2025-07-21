const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');


router.get('/dashboard', protect, (req, res) => {
    res.status(200).json({ message: 'Welcome to the protected dashboard!', user: req.user });
});

module.exports = router;