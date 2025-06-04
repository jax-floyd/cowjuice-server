const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');
const stringify = require('csv-stringify/sync');

const requestsPath = path.join(__dirname, '../../beta_access_requests.csv');
const testersPath = path.join(__dirname, '../../private_beta_testers.csv');

const setupDispositionBetaAccessRequest = (router) => {
  router.post('/disposition-beta-access-request', async (req, res) => {
    console.log("'/disposition-beta-access-request' endpoint was reached.");

    const { id, status } = req.body;
    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }

    try {
      const rawRequests = fs.readFileSync(requestsPath, 'utf8');
      const records = parse.parse(rawRequests, { skipEmptyLines: true });

      let targetRow;
      const updatedRecords = records.map(row => {
        if (row[0] === id) {
          row[2] = status;
          targetRow = row;
        }
        return row;
      });

      if (!targetRow) {
        return res.status(404).json({ success: false, error: 'ID not found' });
      }

      fs.writeFileSync(requestsPath, stringify.stringify(updatedRecords), 'utf8');
      console.log(`Updated request ID ${id} to status "${status}"`);

      if (status === 'approved') {
        const testersData = fs.existsSync(testersPath)
          ? parse.parse(fs.readFileSync(testersPath, 'utf8'), { skipEmptyLines: true })
          : [];

        // Prevent duplicates
        const exists = testersData.some(row => row[0] === id);
        if (!exists) {
          testersData.push(targetRow);
          fs.writeFileSync(testersPath, stringify.stringify(testersData), 'utf8');
          console.log(`Added approved tester to private_beta_testers.csv: ${targetRow[1]}`);
        }
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Error updating disposition:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

module.exports = setupDispositionBetaAccessRequest;