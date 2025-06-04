const stripe = require('../../configs/stripe.js');

const setupCreatePaymentIntentRoute = (router) => {
  router.post('/create-payment-intent', async (req, res) => {
    console.log("'/create-payment-intent' endpoint was reached.");

    try {
      const { amount, email, name, shipping } = req.body;

      if (!amount || !email || !shipping || !name) {
        return res.status(400).json({ error: 'Missing required payment information' });
      }

      // We're creating payment intents with all user data. In theory, this is for confirmation of Shopify information.
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // <-- comes in as 3599 and needs to be 3599 for successful payment intent creation
        currency: 'usd',
        receipt_email: email,
        metadata: {
          email,
          full_name: `${name.first} ${name.last}`,
          address_line_1: shipping.address1,
          address_line_2: shipping.address2 || '',
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.postalCode,
          country: shipping.country,
          phone: shipping.phone || '',
        },
        automatic_payment_methods: { enabled: true },
        shipping: {
          name: `${name.first} ${name.last}`,
          address: {
            line1: shipping.address1,
            line2: shipping.address2,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.postalCode,
            country: shipping.country,
          },
          phone: shipping.phone,
        }
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentIntentStatus: paymentIntent.status,
        paymentIntent: paymentIntent,
      });

    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });
};

module.exports = setupCreatePaymentIntentRoute;