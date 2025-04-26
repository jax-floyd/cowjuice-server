const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupListProducts = (router) => {
  // Route to handle listing customers
  router.post('/list-products', async (req, res) => {
    console.log("'/list-products' endpoint was reached.");
    try {
      const { limit = 100 } = req.body; /// <-- We want all of 'em.

      const products = await stripe.products.list({
        limit
      });

      res.status(200).json({
        products: products.data
      });

    } catch (error) {
      console.error('Error listing products:', error);
      res.status(500).json({ error: 'Failed to get products list' });
    }
  });
};

module.exports = setupListProducts;
