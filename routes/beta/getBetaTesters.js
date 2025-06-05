const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');

const filePath = path.join(__dirname, '../../beta_testers.csv');

const setupGetBetaTesters = (router) => {
  router.get('/get-beta-testers', async (req, res) => {
    console.log("'/get-beta-testers' endpoint was reached.");

    try {
      const { page = 1, limit = 500, status, username } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      const rawData = fs.readFileSync(filePath, 'utf8');
      const records = parse.parse(rawData, { skipEmptyLines: true });
      console.log(`Loaded ${records.length} beta testers from file.`);

      const formatted = records.map(row => ({
        id: row[0],
        username: row[1],
        status: row[2],
        timestamp: row[3],
      }));

      // 🔍 If username query is present, return just that entry (case-insensitive match)
      if (username) {
        const target = formatted.find(entry =>
          entry.username?.toLowerCase() === username.toLowerCase().trim()
        );

        return res.json({
          requests: target ? [target] : [],
          total: target ? 1 : 0,
          page: 1,
          limit: 1,
          hasNext: false,
        });
      }

      // 📦 Otherwise filter and paginate
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