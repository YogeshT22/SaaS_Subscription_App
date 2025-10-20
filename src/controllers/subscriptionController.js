// src/controllers/subscriptionController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Initialize Stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe Checkout Session for a subscription
// @route   POST /api/subscriptions/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
    const { priceId } = req.body; // e.g., 'price_1P...' for a specific plan
    const user = req.user; // We get this from our 'protect' middleware

    // This is the URL Stripe will redirect to after a successful payment
    const successUrl = 'http://localhost:3000/payment-success';
    // This is the URL Stripe will redirect to if the user cancels
    const cancelUrl = 'http://localhost:3000/payment-cancelled';

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        // We can pass the user's ID to the session for later reference
        client_reference_id: user.id,
    });

    res.json({ url: session.url });
});

// @desc    Handle Stripe Webhook events
// @route   POST /api/subscriptions/webhook
// @access  Public (needs to be accessible by Stripe)
const handleStripeWebhook = asyncHandler(async (req, res) => {
    const event = req.body;

    // Handle the event based on its type
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Get the user ID we passed earlier
            const userId = session.client_reference_id;

            // Find the user in our database and update their subscription status
            await User.findByIdAndUpdate(userId, {
                stripeCustomerId: session.customer,
                subscriptionPlan: 'basic', // You can make this dynamic
                subscriptionStatus: 'active',
            });
            console.log(`Successfully updated subscription for user: ${userId}`);
            break;
        // ... you can add more event types here (e.g., 'invoice.payment_failed')
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});


module.exports = {
    createCheckoutSession,
    handleStripeWebhook,
};
