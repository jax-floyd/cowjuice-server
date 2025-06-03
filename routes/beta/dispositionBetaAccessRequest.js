const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');
const stringify = require('csv-stringify/sync');

const filePath = path.join(__dirname, '../../beta_access_requests.csv');

const setupDispositionBetaAccessRequest = (router) => {
  router.post('/disposition-beta-access-request', async (req, res) => {
    console.log("'/disposition-beta-access-request' endpoint was reached.");

    const { id, status } = req.body;
    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }

    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const records = parse.parse(rawData, {
        skipEmptyLines: true,
      });

      let updated = false;

      const updatedRecords = records.map(row => {
        if (row[0] === id) {
          row[2] = status;
          updated = true;
        }
        return row;
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'ID not found' });
      }

      const csvOutput = stringify.stringify(updatedRecords);
      fs.writeFileSync(filePath, csvOutput, 'utf8');

      console.log(`Updated request ID ${id} to status "${status}"`);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating beta access request:', error);
      res.status(500).json({ success: false, error: 'Failed to update status' });
    }
  });
};

module.exports = setupDispositionBetaAccessRequest;
