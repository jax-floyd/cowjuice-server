const shopify = require('../../configs/shopify');

const setupCreateShopifyOrder = (router) => {
  router.post('/create-shopify-order', async (req, res) => {
    console.log("'/create-shopify-order' endpoint was reached.");

    const { email, name, lineItems, shipping } = req.body;

    try {
      // Extract the variant_id (assumes only one product per order)
      const variantId = lineItems?.[0]?.variant_id;

      // Define your known 12-pack variant ID here (update this!)
      const TWELVE_PACK_VARIANT_ID = 51237919457569; // <-- replace with real ID

      // Decide shipping line based on product
      const freeShipping = variantId === TWELVE_PACK_VARIANT_ID;

      const shippingLines = freeShipping
        ? []
        : [
            {
              title: 'Flat Rate Shipping',
              price: '4.99',
              code: 'FlatRate',
              source: 'Custom',
            },
          ];

      const shopifyResponse = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders.json`,
        {
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
              shipping_address: {
                first_name: name?.first || 'First',
                last_name: name?.last || 'Last',
                address1: shipping.address1,
                address2: shipping.address2,
                city: shipping.city,
                province: shipping.state,
                zip: shipping.postalCode,
                country: shipping.country,
                phone: shipping.phone,
              },
              shipping_lines: shippingLines,
            },
          }),
        }
      );

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
