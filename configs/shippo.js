require('./loadEnv')();
const axios = require('axios');

// RESTful API client for Shippo
const shippoClient = axios.create({
  baseURL: 'https://api.goshippo.com',
  headers: {
    Authorization: `ShippoToken ${
      process.env.NODE_ENV === 'production'
        ? process.env.SHIPPO_API_KEY_LIVE
        : process.env.SHIPPO_API_KEY_TEST
    }`,
    'Content-Type': 'application/json',
  },
});

module.exports = shippoClient;
