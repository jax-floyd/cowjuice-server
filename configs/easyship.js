require('dotenv').config();
const axios = require('axios');

const easyship = axios.create({
  baseURL: 'https://api.easyship.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${
      process.env.NODE_ENV === 'production'
        ? process.env.EASYSHIP_API_KEY_LIVE
        : process.env.EASYSHIP_API_KEY_TEST
    }`,
  },
});

module.exports = easyship;
