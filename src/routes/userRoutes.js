// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller functions and the middleware
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
// When a GET request is made to '/me', the 'protect' middleware will run FIRST.
// If the token is valid, it will then call the 'getMe' controller function.
router.get('/me', protect, getMe);

module.exports = router;
