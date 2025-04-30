const shopify = require('../../configs/shopify');

const setupCreateShopifyOrder = (router) => {
    router.post('/create-shopify-order', async (req, res) => {
        console.log("'/create-shopify-order' endpoint was reached.")
        const { email, lineItems, shipping } = req.body;

        console.log("Request body:", req.body);
        console.log();
        console.log("Shopify config:", shopify);
      
        try {
          const shopifyResponse = await fetch(`https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': shopify.adminToken,
            },
            body: JSON.stringify({
              order: {
                email,
                send_receipt: true,
                send_fulfillment_receipt: true,
                fulfillment_status: 'unfulfilled',
                line_items: lineItems,
                shipping_address: shipping,
              },
            }),
          });
      
          const data = await shopifyResponse.json();
      
          if (!shopifyResponse.ok) {
            console.error('Shopify error:', data);
            return res.status(400).json({ error: data });
          }
      
          res.json({ order: data.order });
        } catch (err) {
          console.error('Server error:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
    });
};

module.exports = setupCreateShopifyOrder;