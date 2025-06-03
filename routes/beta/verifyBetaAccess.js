const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');

const filePath = path.join(__dirname, '../../cjprbtp.csv');

const setupVerifyBetaAccess = (router) => {
  router.post('/verify-beta-access', async (req, res) => {
    console.log("'/verify-beta-access' endpoint was reached.");
    try {
      const { username } = req.body;

      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid or missing username' });
      }

      // Normalize username: lowercase, remove leading '@' if present
      const normalized = username.trim().toLowerCase().replace(/^@/, '');

      const rawData = fs.readFileSync(filePath, 'utf8');

      const records = parse.parse(rawData, {
        skipEmptyLines: true,
      });

      // Check if normalized username is in CSV (column 0 assumed)
      const authorized = records.some(row =>
        row[0]?.trim().toLowerCase().replace(/^@/, '') === normalized
      );

      if (authorized) {
        res.json({ success: true });
      } else {
        res.status(403).json({ success: false, error: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Error confirming beta access:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

module.exports = setupVerifyBetaAccess;
