/*
    The Shippo API configuration is stored here.
*/

require('./loadEnv')(); // Load env from either local or persistent server path

const shippo = require('shippo')(
  process.env.NODE_ENV === 'production'
    ? process.env.SHIPPO_API_KEY_LIVE
    : process.env.SHIPPO_API_KEY_TEST
);

console.log('Shippo API Key:', shippo.apiKey); // Debugging line to check if the API key is loaded correctly

module.exports = shippo;
