const shopify = require('../../configs/shopify');

const setupListProducts = (router) => {
  router.post('/list-products', async (req, res) => {
    console.log("'/list-products' endpoint was reached.");

    try {
      // Step 1: Fetch Products
      const productResponse = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/products.json`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken,
          },
        }
      );

      const productData = await productResponse.json();

      if (!productResponse.ok) {
        console.error('Shopify product fetch error:', productData);
        return res.status(400).json({ error: productData });
      }

      const products = productData.products;

      // Step 2: Extract inventory_item_ids from all variants
      const inventoryItemIds = products.flatMap((product) =>
        product.variants.map((variant) => variant.inventory_item_id)
      );

      // Step 3: Fetch inventory levels
      const inventoryResponse = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/inventory_levels.json?inventory_item_ids=${inventoryItemIds.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken,
          },
        }
      );

      const inventoryData = await inventoryResponse.json();

      if (!inventoryResponse.ok) {
        console.error('Shopify inventory fetch error:', inventoryData);
        return res.status(400).json({ error: inventoryData });
      }

      const inventoryMap = {};
      inventoryData.inventory_levels.forEach((level) => {
        inventoryMap[level.inventory_item_id] = level;
      });

      // Step 4: Add inventory data to each product's variants
      const enrichedProducts = products.map((product) => {
        return {
          ...product,
          variants: product.variants.map((variant) => {
            return {
              ...variant,
              inventory: inventoryMap[variant.inventory_item_id] || null,
            };
          }),
        };
      });

      console.log(enrichedProducts)

      res.json({ products: enrichedProducts });
    } catch (err) {
      console.error('Server error during product + inventory fetch:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupListProducts;