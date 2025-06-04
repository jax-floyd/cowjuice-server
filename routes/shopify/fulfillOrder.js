const shopify = require('../../configs/shopify');

const setupFulfillOrder = (router) => {
  router.post('/admin/fulfill-order', async (req, res) => {
    console.log("'/admin/fulfill-order' endpoint was reached.");
    const { orderId, trackingNumber, trackingCompany } = req.body;

    try {
      // 1. Get fulfillment orders
      const fulfillmentOrderResp = await fetch(`https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders/${orderId}/fulfillment_orders.json`, {
        headers: {
          'X-Shopify-Access-Token': shopify.adminToken,
          'Content-Type': 'application/json',
        },
      });

      const { fulfillment_orders } = await fulfillmentOrderResp.json();
      if (!fulfillment_orders || fulfillment_orders.length === 0) {
        return res.status(404).json({ error: 'No fulfillment orders found for this order.' });
      }

      const fulfillmentOrderId = fulfillment_orders[0].id;

      // 2. Fulfill the order
      const fulfillmentCreateResp = await fetch(`https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/fulfillments.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': shopify.adminToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fulfillment: {
            line_items_by_fulfillment_order: [
              {
                fulfillment_order_id: fulfillmentOrderId,
              },
            ],
            tracking_info: {
              number: trackingNumber,
              company: trackingCompany,
            },
            notify_customer: true,
          },
        }),
      });

      if (!fulfillmentCreateResp.ok) {
        const text = await fulfillmentCreateResp.text(); // debug raw body
        console.error(`Error response from Shopify: ${fulfillmentCreateResp.status}`, text);
        return res.status(fulfillmentCreateResp.status).json({ error: 'Shopify fulfillment creation failed.' });
      }

      const fulfillment = await fulfillmentCreateResp.json();
      console.log('Fulfillment created:', fulfillment);
      res.json({ success: true, fulfillment });
    } catch (err) {
      console.error('Error fulfilling Shopify order:', err);
      res.status(500).json({ error: 'Failed to fulfill order.' });
    }
  });
};

module.exports = setupFulfillOrder;
