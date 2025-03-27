const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupListCharges = (router) => {
  // Route to handle listing charges
  router.post('/list-charges', async (req, res) => {
    console.log("'/list-charges' endpoint was reached.");
    try {
      const { limit = 100 } = req.body;

      const charges = await stripe.charges.list({
        limit
      });

      res.status(200).json({
        charges: charges.data
      });

    } catch (error) {
      console.error('Error listing charges:', error);
      res.status(500).json({ error: 'Failed to get charges list' });
    }
  });
};

module.exports = setupListCharges;
