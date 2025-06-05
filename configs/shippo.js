const { Shippo } = require('shippo');

require('./loadEnv')(); // or dotenv.config()

const shippo = new Shippo({
  apiKey: process.env.NODE_ENV === 'production'
    ? process.env.SHIPPO_API_KEY_LIVE
    : process.env.SHIPPO_API_KEY_TEST,
  shippoApiVersion: '2018-02-08',
});

console.log('Shippo initialized with API key:');

module.exports = shippo;