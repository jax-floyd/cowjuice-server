const express = require('express');

// The routes, themselves ...
const setupHomeRoute = require('./home.js');
const setupTestRoute = require('./test.js');
const setupCreatePaymentIntentRoute = require('./stripe/createPaymentIntent.js'); // Add this import

const router = express.Router();

// Our initiation function ...
const setupRoutes = (app) => {
  setupHomeRoute(router); // Set up home route
  setupTestRoute(router); // Set up test route
  setupCreatePaymentIntentRoute(router); // Register the create payment intent route

  return router;
};

module.exports = setupRoutes;
