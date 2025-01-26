const express = require('express');

// The routes, themselves ...
const setupHomeRoute = require('./home.js');
const setupCreatePaymentIntentRoute = require('./stripe/createPaymentIntent.js');
const setupGetCase = require('./cases/getCase.js');
const setupDecrementCase = require('./cases/decrementCase.js');
const setupIncrementCase = require('./cases/incrementCase.js');
const setupWriteZip = require('./data/writeZip.js');

const router = express.Router();

// Our initiation function ...
const setupRoutes = (app) => {
  setupHomeRoute(router);
  setupCreatePaymentIntentRoute(router);
  setupGetCase(router);
  setupDecrementCase(router);
  setupIncrementCase(router);
  setupWriteZip(router);

  return router;
};

module.exports = setupRoutes;
