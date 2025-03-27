const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupListCustomers = (router) => {
  // Route to handle listing customers
  router.post('/list-customers', async (req, res) => {
    console.log("'/list-customers' endpoint was reached.");
    try {
      const { limit = 100 } = req.body;

      const customers = await stripe.customers.list({
        limit
      });

      res.status(200).json({
        customers: customers.data
      });

    } catch (error) {
      console.error('Error listing customers:', error);
      res.status(500).json({ error: 'Failed to get customers list' });
    }
  });
};

module.exports = setupListCustomers;
