const setupCreateOrder = (router) => {
    router.post('/create-shopify-order', async (req, res) => {
        const { email, lineItems, shipping } = req.body;
      
        try {
          const shopifyResponse = await fetch(`https://${process.env.STORE_DOMAIN}/admin/api/2023-10/orders.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': process.env.ADMIN_TOKEN,
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

module.exports = setupCreateOrder;