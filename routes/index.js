const express = require('express');

// The routes, themselves ...
const setupHomeRoute = require('./home.js');
const setupCreatePaymentIntentRoute = require('./stripe/createPaymentIntent.js');
const setupGetCase = require('./cases/getCase.js');
const setupDecrementCase = require('./cases/decrementCase.js');

const router = express.Router();

// Our initiation function ...
const setupRoutes = (app) => {
  setupHomeRoute(router);
  setupCreatePaymentIntentRoute(router);
  setupGetCase(router);
  setupDecrementCase(router);

  return router;
};

module.exports = setupRoutes;
