const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupListTransactions = (router) => {
  // Route to handle listing customers
  router.post('/list-transactions', async (req, res) => {
    console.log("'/list-transactions' endpoint was reached.");
    try {
      const { limit = 100 } = req.body; /// <-- We want all of 'em.

      const transactions = await stripe.issuing.transactions.list({
        limit,
      });
    
      res.status(200).json({
        transactions: transactions.data
      });

    } catch (error) {
      console.error('Error listing transactions:', error);
      res.status(500).json({ error: 'Failed to get transactions list' });
    }
  });
};

module.exports = setupListTransactions;
