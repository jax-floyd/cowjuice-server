const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cases.txt');

const setupDecrementCase = (router) => {
  router.post('/decrement-case', async (req, res) => {
    console.log("'/decrement-case' endpoint was reached.");
    try {
      // Read the current number of cases left
      const data = await fs.promises.readFile(filePath, 'utf8');
      let casesLeft = parseInt(data, 10);

      if (isNaN(casesLeft)) {
        return res.status(500).json({ error: 'Invalid data in cases file' });
      }

      if (casesLeft > 0) {
        casesLeft--;

        // Write the updated number of cases back to the file
        await fs.promises.writeFile(filePath, casesLeft.toString(), 'utf8');
        return res.json({ casesLeft });
      } else {
        return res.status(400).json({ error: 'No cases left' });
      }
    } catch (error) {
      console.error('Error decrementing case:', error);
      res.status(500).json({ error: 'Failed to decrement case' });
    }
  });
};

module.exports = setupDecrementCase;