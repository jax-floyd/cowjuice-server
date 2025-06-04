const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');
const stringify = require('csv-stringify/sync');

const testersPath = path.join(__dirname, '../../beta_testers.csv');

const setupDispositionBetaAccessRequest = (router) => {
  router.post('/disposition-beta-access-request', async (req, res) => {
    console.log("➡️ '/disposition-beta-access-request' endpoint hit");
    const { id, status } = req.body;

    console.log(`📩 Received ID: "${id}" | Status: "${status}"`);

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      console.log("❌ Invalid request parameters");
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }

    try {
      console.log("📂 Reading beta_access_requests.csv...");
      const rawRequests = fs.readFileSync(testersPath, 'utf8');
      const records = parse.parse(rawRequests, { skipEmptyLines: true });

      console.log(`📋 Parsed ${records.length} total records`);
      let targetRow;
      let found = false;

      const updatedRecords = records.map((row, i) => {
        if (row[1]?.trim().toLowerCase().replace(/^@/, '') === id.trim().toLowerCase().replace(/^@/, '')) { // <-- Row 1 is the @username
          console.log(`✅ Match found on row ${i}:`, row);
          row[2] = status;
          targetRow = row;
          found = true;
        }
        return row;
      });

      if (!found) {
        console.log("❌ No row matched the given ID");
        return res.status(404).json({ success: false, error: 'ID not found' });
      }

      console.log("💾 Writing updated beta_access_requests.csv...");
      fs.writeFileSync(testersPath, stringify.stringify(updatedRecords), 'utf8');
      console.log(`📝 Updated request status to "${status}"`);

      console.log("🎉 Disposition complete");
      return res.json({ success: true });
    } catch (error) {
      console.error("💥 ERROR:", error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

module.exports = setupDispositionBetaAccessRequest;