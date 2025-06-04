/*
    The Easypost API configuration is stored here.
*/

require('./loadEnv')(); // or dotenv.config()

const EasyPostClient = require('@easypost/api');

const easypost = new EasyPostClient(
  process.env.NODE_ENV === 'production'
    ? process.env.EASYPOST_API_KEY_LIVE
    : process.env.EASYPOST_API_KEY_TEST
);

module.exports = easypost;