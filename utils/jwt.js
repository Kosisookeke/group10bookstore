const jwt = require('jsonwebtoken');

exports.signToken = (userId) => {
if (!userId) {
    throw new Error('User ID is required');
}
return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});
};

exports.verifyToken = (token) => {
return jwt.verify(token, process.env.JWT_SECRET);
};