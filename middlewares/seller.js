const User = require('../models/userModel');

exports.seller = async (req, res, next) => {
    const role = req.user.role;
    if (role !== 'seller') {
        return res.status(403).json({ message: 'Access denied: Not a seller' });
    }
    next();
};
