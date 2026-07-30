const jwt = require('jsonwebtoken');
const config = require('../config/env');

const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, config.jwt.secret);
            req.user = decoded;
        }
    } catch {
        req.user = null;
    }
    next();
};

module.exports = optionalAuth;
