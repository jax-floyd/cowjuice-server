// routes/orders.js
const fetch = require('node-fetch'); // If you're on Node 18+, you can omit this line
const shopify = require('../../configs/shopify');

const setupCreateShopifyOrder = (router) => {
  router.post('/create-shopify-order', async (req, res) => {
    console.log("'/create-shopify-order' endpoint was reached.");
    const { email, name, lineItems, shipping } = req.body;

    const CREATE_ORDER = `
      mutation orderCreate($input: OrderInput!) {
        orderCreate(input: $input) {
          order {
            id
            shippingAddress {
              address1
              city
              province
              zip
              country
              validationResultSummary
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      // Build the GraphQL variables
      const variables = {
        input: {
          email,
          sendReceipt: true,
          sendFulfillmentReceipt: true,
          fulfillmentStatus: "UNFULFILLED",
          lineItems: lineItems.map(item => ({
            variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
            quantity: item.quantity
          })),
          shippingAddress: {
            firstName: name.first,
            lastName:  name.last,
            address1:   shipping.address1,
            address2:   shipping.address2,
            city:       shipping.city,
            province:   shipping.state,
            zip:        shipping.postalCode,
            country:    shipping.country,
            phone:      shipping.phone
          }
        }
      };

      // Call Shopify Admin GraphQL
      const response = await fetch(
        `https://${shopify.storeDomain}/admin/api/${shopify.apiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify.adminToken
          },
          body: JSON.stringify({
            query: CREATE_ORDER,
            variables
          })
        }
      );

      const result = await response.json();
      console.log(result);

      // Handle network or GraphQL-level errors
      if (!response.ok || result.errors) {
        console.error('GraphQL errors:', result.errors || result);
        return res.status(400).json({ error: result.errors || result });
      }

      const { userErrors, order } = result.data.orderCreate;

      // Handle validation or input errors
      if (userErrors.length) {
        console.error('UserErrors:', userErrors);
        return res.status(422).json({ error: userErrors[0].message });
      }

      // Check Shopify's own address-validation verdict
      const verdict = order.shippingAddress.validationResultSummary;
      if (verdict === 'ERROR' || verdict === 'WARNING') {
        return res
          .status(422)
          .json({ error: 'Unverifiable shipping address', verdict });
      }

      // All good—return the created order
      res.json({ order });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = setupCreateShopifyOrder;