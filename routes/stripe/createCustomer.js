const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupCreateCustomer = (router) => {
  router.post('/create-customer', async (req, res) => {
    console.log("'/create-customer' endpoint was reached.");
    try {
      const {
        email: email,
        name: {
            first: firstName,
            last: lastName,
        },
        metadata: {
          cowjuice_id: cowjuiceId
        }
      } = req.body;
      
      const customer = await stripe.customers.create({
        name: firstName + ' ' + lastName,
        email: email,
        metadata: {
          cowjuice_id: cowjuiceId,
        },
      });

      res.status(200).json({
        status: 'success',
        customerId: customer.id,
        customer,
      });

    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  });
};

module.exports = setupCreateCustomer;