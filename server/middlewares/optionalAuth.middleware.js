const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
    } catch {
        req.user = null;
    }
    next();
};

module.exports = optionalAuth;
