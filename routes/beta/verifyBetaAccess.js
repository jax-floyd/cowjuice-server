const fs = require('fs');
const parse = require('csv-parse/sync');
const path = require('path');

const filePath = path.join(__dirname, '../../beta_testers.csv'); // <-- Canonical SST

const setupVerifyBetaAccess = (router) => {
  router.post('/verify-beta-access', async (req, res) => {
    console.log("'/verify-beta-access' endpoint was reached.");
    try {
      const { username } = req.body;

      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid or missing username' });
      }

      const normalized = username.trim().toLowerCase().replace(/^@/, '');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const records = parse.parse(rawData, { skipEmptyLines: true });

      const authorized = records.some(
        row =>
          row[1]?.trim().toLowerCase().replace(/^@/, '') === normalized &&
          row[2]?.trim().toLowerCase() === 'approved' // <-- Pulling from canonical csv, we now just query based on approval status
      );
      

      res.json({ success: authorized });
    } catch (error) {
      console.error('Error confirming beta access:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

module.exports = setupVerifyBetaAccess;