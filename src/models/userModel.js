// src/models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // Basic user info
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        // Subscription details
        stripeCustomerId: {
            type: String,
            // unique: true, // A customer ID should be unique but might be null initially
        },
        subscriptionPlan: {
            type: String,
            default: 'free', // e.g., 'free', 'basic', 'premium'
        },
        subscriptionStatus: {
            type: String,
            default: 'inactive', // e.g., 'active', 'inactive', 'cancelled'
        },
    },
    {
        // Automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
