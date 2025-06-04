/*
    The Shippo API configuration is stored here.
*/

const dotenv = require('dotenv');
dotenv.config();

const shippo = require('shippo')(
  process.env.NODE_ENV === 'production'
    ? process.env.SHIPPO_API_KEY_LIVE
    : process.env.SHIPPO_API_KEY_TEST
);

module.exports = shippo;
