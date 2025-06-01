const shopify = require('../../configs/shopify');

const setupListProducts = (router) => {
  router.post('/list-products', async (req, res) => {
    console.log("'/list-products' endpoint was reached.");

    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': shopify.adminToken,
    };

    try {
      // Step 1: Fetch products
      const productRes = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/products.json`,
        { method: 'GET', headers }
      );
      const productData = await productRes.json();

      if (!productRes.ok) {
        console.error('Shopify product fetch error:', productData);
        return res.status(400).json({ error: productData });
      }

      const products = productData.products;

      // Step 2: Extract inventory_item_ids
      const inventoryItemIds = products.flatMap((p) =>
        p.variants.map((v) => v.inventory_item_id)
      );

      // Step 3: Fetch inventory levels
      const inventoryRes = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/inventory_levels.json?inventory_item_ids=${inventoryItemIds.join(',')}`,
        { method: 'GET', headers }
      );
      const inventoryData = await inventoryRes.json();

      if (!inventoryRes.ok) {
        console.error('Shopify inventory fetch error:', inventoryData);
        return res.status(400).json({ error: inventoryData });
      }

      // Step 4: Map inventory levels by inventory_item_id
      const inventoryMap = {};
      inventoryData.inventory_levels.forEach((level) => {
        inventoryMap[level.inventory_item_id] = level;
      });

      // Step 5: Fetch shipping profiles
      const profilesRes = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/delivery_profiles.json`,
        { method: 'GET', headers }
      );
      const profilesData = await profilesRes.json();

      if (!profilesRes.ok) {
        console.error('Shopify shipping profiles fetch error:', profilesData);
        return res.status(400).json({ error: profilesData });
      }

      // Step 6: Map product_id → shipping profile name
      const profileMap = {};
      for (const profile of profilesData.profiles) {
        for (const productId of profile.product_ids) {
          profileMap[productId] = profile.name;
        }
      }

      // Step 7: Enrich products with inventory and shipping profile
      const enrichedProducts = products.map((product) => ({
        ...product,
        shippingProfile: profileMap[product.id] || 'Default',
        variants: product.variants.map((variant) => ({
          ...variant,
          inventory: inventoryMap[variant.inventory_item_id] || null,
        })),
      }));

      res.json({ products: enrichedProducts });
    } catch (err) {
      console.error('Server error during product + inventory fetch:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupListProducts;
