/* 
  server.js is the entry point. It imports app.js, which itself imports routes/index.js, 
  which collates all the routes, passing into each the PlaidAPI client, the router, and the app instance.
*/

const dotenv = require('dotenv');
const { server } = require('./app.js');

dotenv.config();
const port = process.env.PORT || 2000;
const env = process.env.NODE_ENV;

server.listen(port, () => {
  console.log(`Backend server is running in ${env} mode at https://localhost:${port}`);
});