const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');
const stringify = require('csv-stringify/sync');

const testersPath = path.join(__dirname, '../../beta_testers.csv');

const setupDispositionBetaAccessRequest = (router) => {
  router.post('/disposition-beta-access-request', async (req, res) => {
    console.log("➡️ '/disposition-beta-access-request' endpoint hit");
    const { id, status } = req.body;

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }

    try {
      const rawRequests = fs.readFileSync(testersPath, 'utf8');
      const records = parse.parse(rawRequests, { skipEmptyLines: true });

      let targetRow;
      let found = false;

      const updatedRecords = records.map((row, i) => {
        if (row[1]?.trim().toLowerCase().replace(/^@/, '') === id.trim().toLowerCase().replace(/^@/, '')) { // <-- Row 1 is the @username
          row[2] = status;
          targetRow = row;
          found = true;
        }
        return row;
      });

      if (!found) {
        console.warn(`ID not found: ${id}`);
        return res.status(404).json({ success: false, error: 'ID not found' });
      }

      fs.writeFileSync(testersPath, stringify.stringify(updatedRecords), 'utf8');
   
      return res.json({ success: true });
    } catch (error) {
      console.error("Error processing beta access request:", error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

module.exports = setupDispositionBetaAccessRequest;