const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Read token from cookie
        const token = req.cookies.token;

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
