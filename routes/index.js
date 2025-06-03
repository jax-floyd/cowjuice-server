const express = require('express');

// The routes, themselves ...
const setupHomeRoute = require('./home.js');
const setupCreatePaymentIntentRoute = require('./stripe/createPaymentIntent.js');
const setupGetCase = require('./cases/getCase.js');
const setupDecrementCase = require('./cases/decrementCase.js');
const setupIncrementCase = require('./cases/incrementCase.js');
const setupWriteZip = require('./data/writeZip.js');
const setupGetReviews = require('./reviews/getReviews.js');
const setupSaveReview = require('./reviews/saveReview.js');
const setupListCharges = require('./stripe/listCharges.js');
const setupListCustomers = require('./stripe/listCustomers.js');
const setupCreateCustomer = require('./stripe/createCustomer.js');
const setupListProducts = require('./shopify/listProducts.js')
const setupListTransactions = require('./stripe/listTransactions.js');
const setupSearchCustomers = require('./stripe/searchCustomers.js');
const setupCreateShopifyOrder = require('./shopify/createShopifyOrder.js')
const setupSearchOrders = require('./shopify/searchOrders.js');
const setupFetchOrders = require('./shopify/fetchOrders.js'); 

const router = express.Router();

// Our initiation function ...
const setupRoutes = ( app ) => {
  setupHomeRoute(router);
  setupCreatePaymentIntentRoute(router);
  setupGetCase(router);
  setupDecrementCase(router);
  setupIncrementCase(router);
  setupWriteZip(router);
  setupGetReviews(router);
  setupSaveReview(router);
  setupListCharges(router);
  setupListCustomers(router);
  setupCreateCustomer(router);
  setupListProducts(router);
  setupListTransactions(router);
  setupSearchCustomers(router);
  setupCreateShopifyOrder(router);
  setupSearchOrders(router);
  setupFetchOrders(router);

  return router;
};

module.exports = setupRoutes;