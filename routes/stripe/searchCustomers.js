const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupSearchCustomers = (router) => {
  router.post('/search-customers', async (req, res) => {
    console.log("'/search-customers' endpoint was reached.");
    try {
      const {
        email: email
      } = req.body;
      
      const customer = await stripe.customers.search({
        query: `email: '${email}'`,
      });

      console.log(customer);

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