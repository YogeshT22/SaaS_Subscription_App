// src/controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user in the database
    const user = await User.create({
        email,
        password: hashedPassword,
    });

    // 5. If user was created, send back user data and a token
    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user (login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and if the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private (requires a token)
const getMe = asyncHandler(async (req, res) => {
    // The 'req.user' is available here because our 'protect' middleware ran first
    // and attached the user object to the request.
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
