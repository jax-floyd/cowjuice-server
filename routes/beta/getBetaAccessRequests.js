const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');

const filePath = path.join(__dirname, '../../beta_access_requests.csv');

const setupGetBetaAccessRequests = (router) => {
  router.get('/get-beta-access-requests', async (req, res) => {
    console.log("'/get-beta-access-requests' endpoint was reached.");

    try {
      const { page = 1, limit = 25 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      const rawData = fs.readFileSync(filePath, 'utf8');
      const records = parse.parse(rawData, {
        skipEmptyLines: true,
      });

      const formatted = records.map(row => ({
        id: row[0],
        username: row[1],
        status: row[2],
        timestamp: row[3],
      }));

      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;
      const paginated = formatted.slice(start, end);

      res.json({
        requests: paginated,
        total: formatted.length,
        page: pageNum,
        limit: limitNum,
        hasNext: end < formatted.length,
      });
    } catch (error) {
      console.error('Error reading beta access requests:', error);
      res.status(500).json({ error: 'Failed to load beta access requests' });
    }
  });
};

module.exports = setupGetBetaAccessRequests;