/*
    The Easypost API configuration is stored here.
*/

require('./loadEnv')(); // Use your existing env loader

const Easypost = require('@easypost/api');

const easypost = new Easypost(
  process.env.NODE_ENV === 'production'
    ? process.env.EASYPOST_API_KEY_LIVE
    : process.env.EASYPOST_API_KEY_TEST
);

module.exports = easypost;