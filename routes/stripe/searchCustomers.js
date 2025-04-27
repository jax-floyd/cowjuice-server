const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupSearchCustomers = (router) => {
  router.post('/search-customer', async (req, res) => {
    console.log("'/search-customer' endpoint was reached.");
    try {
      const {
        email: email,
        metadata: {
          cowjuice_id: cowjuiceId
        }
      } = req.body;
      
      const customer = await stripe.customers.search({
        query: `email: '${email}' AND metadata['cowjuice_id']: '${cowjuiceId}'`,
      });

      res.status(200).json({
        status: 'success',
        customerId: customer.id,
        customer,
      });

    } catch (error) {
      console.error('Error searching customers:', error);
      res.status(500).json({ error: 'Failed to search customers' });
    }
  });
};

module.exports = setupSearchCustomers;