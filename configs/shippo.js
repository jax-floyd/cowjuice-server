const { Shippo } = require('shippo');

require('./loadEnv')(); // or dotenv.config()

const shippo = new Shippo({
  apiKeyHeader:
    process.env.NODE_ENV === 'production'
      ? process.env.SHIPPO_API_KEY_LIVE
      : process.env.SHIPPO_API_KEY_TEST,
});

module.exports = shippo;