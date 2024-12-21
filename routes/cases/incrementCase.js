const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../cases.txt');

// This endpoint is unnecessary for the client. It exists merely for an easy way to manually alter the count as required.
const setupIncrementCase = (router) => {
  router.post('/increment-case', async (req, res) => {
    console.log("'/increment-case' endpoint was reached.");
    try {
      // Read the current number of cases left
      const data = await fs.promises.readFile(filePath, 'utf8');
      let casesLeft = parseInt(data, 10);

      if (isNaN(casesLeft)) {
        return res.status(500).json({ error: 'Invalid data in cases file' });
      }

      if (casesLeft < 983) {
        casesLeft++;

        // Write the updated number of cases back to the file
        await fs.promises.writeFile(filePath, casesLeft.toString(), 'utf8');
        return res.json({ casesLeft });
      } else {
        return res.status(400).json({ error: 'Cannot exceed 983 cases' });
      }
    } catch (error) {
      console.error('Error incrementing case:', error);
      res.status(500).json({ error: 'Failed to increment case' });
    }
  });
};

module.exports = setupIncrementCase;