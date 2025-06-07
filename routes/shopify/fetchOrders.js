const shopify = require('../../configs/shopify');

const setupFetchOrders = (router) => {
  router.get('/admin/fetch-orders', async (req, res) => {
    console.log("'/admin/fetch-orders' endpoint was reached.");

    const allOrders = [];
    let nextUrl = `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders.json?status=any&limit=50`;

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Shopify fetchOrders error:', data);
          return res.status(400).json({ error: data });
        }

        allOrders.push(...data.orders);

        // Parse the Link header to find the next page URL; i.e., pagination functionality
        const linkHeader = response.headers.get('link');
        if (linkHeader && linkHeader.includes('rel="next"')) {
          const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
          nextUrl = match ? match[1] : null;
        } else {
          nextUrl = null; // No more pages
        }
      }

      res.json(allOrders);
    } catch (err) {
      console.error('Server error during fetchOrders:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupFetchOrders;
