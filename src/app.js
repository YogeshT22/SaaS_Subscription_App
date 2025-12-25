// importing required modules
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// --- just a configuration and calling DB ---
dotenv.config();
connectDB();

// --- init ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
// DEVNOTE: This middleware MUST come BEFORE your routes are defined.
// It tells Express to parse any incoming request body that is JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// --- ROUTES ---
// Now that the middleware is set up, Express knows how to handle
// the JSON body that will be sent to these routes.
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));


// Simple root endpoint for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the SaaS Subscription App API!" });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
