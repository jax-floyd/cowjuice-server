const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupListCharges = (router) => {
  router.post('/list-charges', async (req, res) => {
    console.log("'/list-charges' endpoint was reached.");
    try {
      const { limit = 100, starting_after } = req.body;

      const charges = await stripe.charges.list({
        limit,
        ...(starting_after && { starting_after }) // only add if defined
      });

      res.status(200).json({
        charges: charges.data,
        has_more: charges.has_more, // include this for pagination logic on the client
      });

    } catch (error) {
      console.error('Error listing charges:', error);
      res.status(500).json({ error: 'Failed to get charges list' });
    }
  });
};

module.exports = setupListCharges;