const tiktok = require('../../configs/tiktok');

const setupForwardOrder = (router) => {
  router.post('/tiktok/forward-order', async (req, res) => {
    console.log("'/tiktok/forward-order' endpoint was reached.");
    const tiktokOrder = req.body;

    try {
        // STEP 1: Map TikTok fields to Shopify format
        const mappedOrder = {
        email: tiktokOrder.buyer_email,
        name: {
            first: tiktokOrder.receiver_firstname,
            last: tiktokOrder.receiver_lastname,
        },
        shipping: {
            address1: tiktokOrder.address_detail,
            address2: '',
            city: tiktokOrder.city,
            state: tiktokOrder.state,
            postalCode: tiktokOrder.zipcode,
            country: tiktokOrder.country || 'US',
            phone: tiktokOrder.phone,
        },
        lineItems: tiktokOrder.items.map((item) => ({
            variant_id: mapTiktokSkuToShopifyVariant(item.sku_id), // Define this mapper function
            quantity: item.quantity,
        })),
        };

        // STEP 2: Forward to existing logic
        const forwardRes = await fetch('http://localhost:3000/create-shopify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedOrder),
        });

        const data = await forwardRes.json();

        if (!forwardRes.ok) {
        return res.status(400).json({ error: data });
        }

        res.json({ order: data.order });
    } catch (err) {
        console.error('Failed to process TikTok order → Shopify:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

  });
};

module.exports = setupCreateShopifyOrder;
