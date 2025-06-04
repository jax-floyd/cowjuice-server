/*
    The Stripe API configuration is stored here.
*/

require('./loadEnv')(); // Load env from either local or persistent server path

const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY_TEST
);

console.log('Stripe API Key:', stripe._apiKey); // Debugging line to check if the API key is loaded correctly

module.exports = stripe;