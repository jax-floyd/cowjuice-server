const express = require('express');
const stripe = require('../configs/stripe.js');

// The routes, themselves ...
const setupHomeRoute = require('./home.js');

const router = express.Router();

// Our initiation function ...
const setupRoutes = ( app ) => {
    
    setupHomeRoute(router);

    return router;
};

module.exports = setupRoutes;