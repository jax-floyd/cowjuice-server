/*
    The Shopify Admin API configuration is stored here.
*/

const dotenv = require('dotenv');
dotenv.config();

const shopify = {
  storefrontToken: '8e181e1db8380f8d97cdbba961dafedc',
  adminToken: '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',
  storeDomain: 'cow-juice.myshopify.com', // e.g., your-store.myshopify.com
  apiVersion: '2023-10', // You can update this to the latest supported version
};

console.log(shopify)

module.exports = shopify;