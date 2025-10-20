// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from the header (e.g., "Bearer eyJhbGci...")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get the user from the database using the ID from the token
            // We attach the user to the request object, but without the password
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Call the next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            res.status(401); // 401 Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
