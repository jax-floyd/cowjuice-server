const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');
const stringify = require('csv-stringify/sync');

const requestsPath = path.join(__dirname, '../../beta_access_requests.csv');
const testersPath = path.join(__dirname, '../../private_beta_testers.csv');

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
      const rawRequests = fs.readFileSync(requestsPath, 'utf8');
      const records = parse.parse(rawRequests, { skipEmptyLines: true });

      console.log(`📋 Parsed ${records.length} total records`);
      let targetRow;
      let found = false;

      const updatedRecords = records.map((row, i) => {
        if (row[0] === id) {
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
      fs.writeFileSync(requestsPath, stringify.stringify(updatedRecords), 'utf8');
      console.log(`📝 Updated request status to "${status}"`);

      if (status === 'approved') {
        console.log("📦 Handling approval logic...");

        let testersData = [];

        if (fs.existsSync(testersPath)) {
          const rawTesters = fs.readFileSync(testersPath, 'utf8');
          testersData = parse.parse(rawTesters, { skipEmptyLines: true });
          console.log(`📋 Loaded ${testersData.length} existing beta testers`);
        } else {
          console.log("📁 private_beta_testers.csv does not exist yet – will create");
        }

        const alreadyExists = testersData.some(row => row[0] === id);

        if (alreadyExists) {
          console.log("⚠️ Tester already in private_beta_testers.csv – skipping append");
        } else {
          testersData.push(targetRow);
          console.log("📤 Appending approved tester row to private_beta_testers.csv:", targetRow);
          fs.writeFileSync(testersPath, stringify.stringify(testersData), 'utf8');
          console.log("✅ private_beta_testers.csv updated successfully");
        }
      }

      console.log("🎉 Disposition complete");
      return res.json({ success: true });
    } catch (error) {
      console.error("💥 ERROR:", error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

module.exports = setupDispositionBetaAccessRequest;