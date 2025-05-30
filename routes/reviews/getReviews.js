const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../reviews.csv');

const setupGetReviews = (router) => {
  router.get('/get-reviews', async (req, res) => {
    console.log("'/get-reviews' endpoint was reached.");
    try {
        // Read CSV file
      const rawData = fs.readFileSync(filePath, 'utf8');

      // Split into lines and filter out any empty lines
      const lines = rawData.split('\n').filter(line => line.trim() !== '');

      // Filter out confidential reviews (fifth field === 'true')
      const filtered = lines.filter(line => {
        const parts = line.split(',');
        return parts[4]?.trim() !== 'true'; // exclude confidential
      });

      // Format the reviews into objects with text and timestamp
      const reviews = filtered.map(line => {
        const parts = line.split(',');
        return {
          text: parts[1]?.trim(),       // review text
          timestamp: parts[5]?.trim()   // ISO date
        };
      });
        
      // Send the reviews as a JSON response
      res.json({ reviews });
    } catch (error) {
      console.error('Error retrieving reviews:', error);
      res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
  });
};

module.exports = setupGetReviews;