const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../cases.txt');

const setupGetCase = (router) => {
  router.get('/get-case', async (req, res) => {
    console.log("'/get-case' endpoint was reached.");
    try {
      // Read the current number of cases from the file
      const data = await fs.promises.readFile(filePath, 'utf8');
      const casesLeft = parseInt(data, 10);

      if (isNaN(casesLeft)) {
        return res.status(500).json({ error: 'Invalid data in cases file' });
      }

      // Send the current number of cases in the response
      res.json({ casesLeft });
    } catch (error) {
      console.error('Error retrieving cases:', error);
      res.status(500).json({ error: 'Failed to retrieve cases' });
    }
  });
};

module.exports = setupGetCase;