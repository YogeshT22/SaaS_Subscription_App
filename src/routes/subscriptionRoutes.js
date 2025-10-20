// src/routes/subscriptionRoutes.js

const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleStripeWebhook } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected. Only a logged-in user can create a checkout session.
router.post('/create-checkout-session', protect, createCheckoutSession);

// This route is public because it needs to be called by Stripe's servers.
// We'll add a different kind of security to it later (signature verification).
router.post('/webhook', handleStripeWebhook);

module.exports = router;
