const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = () => {
  const localEnvPath = path.resolve(__dirname, '../.env'); // Case for the local .env file
  const serverEnvPath = path.resolve('/home/ubuntu/cowjuice-env/.env'); // Case for the server's .env file

  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
  } else if (fs.existsSync(serverEnvPath)) {
    dotenv.config({ path: serverEnvPath });
  } else {
    console.warn('⚠️  No .env file found in either location.');
  }
};