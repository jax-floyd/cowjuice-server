const shopify = require('../../configs/shopify');

const setupFetchOrders = (router) => {
  router.get('/admin/fetch-orders', async (req, res) => {
    console.log("'/admin/fetch-orders' endpoint was reached.");

    try {
      const response = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders.json?status=any&limit=50`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Shopify fetchOrders error:', data);
        return res.status(400).json({ error: data });
      }

      res.json(data.orders);
    } catch (err) {
      console.error('Server error during fetchOrders:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupFetchOrders;