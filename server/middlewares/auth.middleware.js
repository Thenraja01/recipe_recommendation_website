const jwt = require('jsonwebtoken');

const getTokenFromRequest = (req) => {
    if (req.cookies?.token) {
        return req.cookies.token;
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    return null;
};

const authMiddleware = (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store Decoded User info in request object
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
