const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const escapeCsvField = (value) => {
  if (value == null) return '';
  const str = String(value);
  const needsEscape = /[",\n\r]/.test(str);
  if (needsEscape) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const setupSaveBetaAcessRequest = (router) => {
  router.post('/save-beta-access-request', async (req, res) => {
    console.log("'/save-beta-access-request' endpoint was reached.");

    try {
      const { username } = req.body;

      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, error: 'Username is required' });
      }

      const normalized = username.trim().toLowerCase().replace(/^@/, '');

      const csvLine = [
        uuid.v4(),                            // Unique ID
        escapeCsvField(normalized),           // Normalized TikTok username
        'awaiting',                           // Status
        new Date().toISOString()              // Timestamp
      ].join(',') + '\n';

      const csvFilePath = path.join(__dirname, '../../beta_access_requests.csv');
      fs.appendFileSync(csvFilePath, csvLine, 'utf8');

      console.log(`Access request saved for @${normalized}`);
      return res.json({ success: true });

    } catch (error) {
      console.error('Error saving beta access request:', error);
      res.status(500).json({ success: false, error: 'Failed to save beta access request' });
    }
  });
};

module.exports = setupSaveBetaAcessRequest;
