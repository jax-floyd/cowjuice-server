/*
    The Shopify Admin API configuration is stored here.
*/

const dotenv = require('dotenv');
dotenv.config();

const shopify = {
  storefrontToken: process.env.STOREFRONT_TOKEN,
  adminToken: process.env.ADMIN_TOKEN,
  storeDomain: process.env.STORE_DOMAIN, // e.g., your-store.myshopify.com
  apiVersion: '2023-10', // You can update this to the latest supported version
};

console.log(shopify)

module.exports = shopify;