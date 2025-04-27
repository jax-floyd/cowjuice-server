const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupUpdateCustomer = (router) => {
  router.post('/update-customer', async (req, res) => {
    console.log("'/update-customer' endpoint was reached.");

    try {
      const { customerId, shipping } = req.body; // Correct extraction

      if (!customerId || !shipping) {
        return res.status(400).json({ error: 'Missing customerId or shipping' });
      }

      const updatedCustomer = await stripe.customers.update(customerId, {
        shipping: {
          name: shipping.name, // optional if you want
          address: {
            line1: shipping.address.line1,
            line2: shipping.address.line2 || null,
            city: shipping.address.city,
            state: shipping.address.state,
            postal_code: shipping.address.postal_code,
            country: shipping.address.country || 'US', // fallback
          },
        },
      });

      res.status(200).json({
        status: 'success',
        updatedCustomer,
      });

    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Failed to update customer' });
    }
  });
};

module.exports = setupUpdateCustomer;