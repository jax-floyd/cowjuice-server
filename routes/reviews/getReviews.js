const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync');

const filePath = path.join(__dirname, '../../reviews.csv');

const setupGetReviews = (router) => {
  router.get('/get-reviews', async (req, res) => {
    console.log("'/get-reviews' endpoint was reached.");
    try {
      const rawData = fs.readFileSync(filePath, 'utf8');

      // Parse CSV data
      const records = parse.parse(rawData, {
        skipEmptyLines: true,
      });

      // Filter + format
      const reviews = records
        .filter(row => row[4]?.trim() !== 'true') // confidential column
        .map(row => ({
          text: row[1]?.trim(),
          timestamp: row[5]?.trim()
        }));

      res.json({ reviews });
    } catch (error) {
      console.error('Error retrieving reviews:', error);
      res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
  });
};

module.exports = setupGetReviews;