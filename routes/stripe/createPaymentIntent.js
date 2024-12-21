const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupCreatePaymentIntentRoute = (router) => {
  // Route to handle creating a payment intent
  router.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount, email } = req.body;

      // Validate the required fields
      if (!amount || !email) {
        return res.status(400).json({ error: 'Amount and email are required' });
      }

      // Create payment intent using Stripe API
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert amount to cents
        currency: 'usd', // Specify your currency
        metadata: { email }, // Attach the email to the metadata
      });

      // Respond with the client secret from Stripe
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });
};

module.exports = setupCreatePaymentIntentRoute;
