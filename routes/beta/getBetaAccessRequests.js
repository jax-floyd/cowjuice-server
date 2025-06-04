const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');

const filePath = path.join(__dirname, '../../beta_testers.csv');

const setupGetBetaTesters = (router) => {
  router.get('/get-beta-testers', async (req, res) => {
    console.log("'/get-beta-testers' endpoint was reached.");

    try {
      const { page = 1, limit = 25, status } = req.query; // <-- Querying by status, getting either 'approved', 'rejected', or 'awaiting' users
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      const rawData = fs.readFileSync(filePath, 'utf8');
      const records = parse.parse(rawData, { skipEmptyLines: true });

      const formatted = records.map(row => ({
        id: row[0],
        username: row[1],
        status: row[2],
        timestamp: row[3],
      }));

      // Optional filter by status
      const filtered = status
        ? formatted.filter(entry => entry.status?.toLowerCase() === status.toLowerCase())
        : formatted;

      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;
      const paginated = filtered.slice(start, end);

      res.json({
        requests: paginated,
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        hasNext: end < filtered.length,
      });
    } catch (error) {
      console.error('Error reading beta testers file:', error);
      res.status(500).json({ error: 'Failed to load beta testers' });
    }
  });
};

module.exports = setupGetBetaTesters;