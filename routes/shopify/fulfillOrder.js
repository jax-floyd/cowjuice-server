const shopify = require('../../configs/shopify');

const setupFulfillOrder = (router) => {
  router.post('/admin/fulfill-order', async (req, res) => {
    console.log("'/admin/fulfill-order' endpoint was reached.");

    const { orderId, trackingNumber, trackingCompany, lineItems } = req.body;

    if (!orderId || !trackingNumber || !trackingCompany || !lineItems) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      const fulfillmentResponse = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders/${orderId}/fulfillments.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken,
          },
          body: JSON.stringify({
            fulfillment: {
              tracking_number: trackingNumber,
              tracking_company: trackingCompany,
              notify_customer: true,
              line_items: lineItems,
            },
          }),
        }
      );

      const data = await fulfillmentResponse.json();

      if (!fulfillmentResponse.ok) {
        console.error('Shopify fulfillment error:', data);
        return res.status(400).json({ error: data });
      }

      res.json({ fulfillment: data.fulfillment });
    } catch (err) {
      console.error('Error fulfilling Shopify order:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupFulfillOrder;
