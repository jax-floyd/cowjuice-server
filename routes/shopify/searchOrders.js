const shopify = require('../../configs/shopify');

const setupSearchOrders = (router) => {
    router.post('/search-orders', async (req, res) => {
        console.log("'/search-orders' endpoint was reached.")
        const { email, confirmationNumber } = req.body;

        const searchTerms = [];
        if (email) searchTerms.push(`email:${email}`);
        if (confirmationNumber) searchTerms.push(`confirmation_number:${confirmationNumber}`); // Shopify uses 'name' for the formatted order number

        const query = searchTerms.join(' ');

        try {
            const shopifyResponse = await fetch(`https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/orders.json?search=true&query=${encodeURIComponent(query)}&status=any`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': shopify.adminToken,
                }
            });

            const data = await shopifyResponse.json();

            if (!shopifyResponse.ok) {
                console.error('Shopify order search error:', data);
                return res.status(400).json({ error: data });
            }

            res.json({ orders: data.orders });
        } catch (err) {
            console.error('Server error during order search:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

module.exports = setupSearchOrders;
