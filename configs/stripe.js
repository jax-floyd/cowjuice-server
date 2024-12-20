/*
    The Stripe API configuration is stored here.
*/

const dotenv = require('dotenv');

dotenv.config();

const stripe = require('stripe')(process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST);
// stripe.applePayDomains.create({
//     domain_name: 'chipt.xyz'
// });

module.exports = stripe;