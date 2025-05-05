const shopify = require('../../configs/shopify');

const setupListProducts = (router) => {
  router.post('/list-products', async (req, res) => {
    console.log("'/list-products' endpoint was reached.");

    try {
      const shopifyResponse = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/products.json`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken,
          },
        }
      );

      const data = await shopifyResponse.json();
      console.log(data);

      if (!shopifyResponse.ok) {
        console.error('Shopify product list error:', data);
        return res.status(400).json({ error: data });
      }

      res.json({ products: data.products });
    } catch (err) {
      console.error('Server error during product fetch:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupListProducts;