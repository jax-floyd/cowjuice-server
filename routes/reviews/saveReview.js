const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filePath = path.join(__dirname, '../../reviews.txt');

const setupSaveReview = (router) => {
  router.post('/save-review', async (req, res) => {
    console.log("'/save-review' endpoint was reached.");
    try {
        // Write the ZIP to the file
        const reviewData = req.body.review;

        if (!reviewData) {
          return res.status(400).json({ error: 'Review data is required' });
        };

        // Save to csv
        const csvLine = `${uuid.v4()}, ${reviewData}, ${req.body.email}, ${req.body.orderNumber}, ${req.body.confidential}, ${new Date().toISOString()}`;
        const csvFilePath = path.join(__dirname, '../../reviews.csv');
        fs.appendFileSync(csvFilePath, csvLine, 'utf8');

        console.log(`A new review from ${req.body.email} was successfully saved.`);

        return res.json({ status: 'success' });
      
    } catch (error) {
        console.error('Error writing zip:', error);
        res.status(500).json({ error: 'Failed to save review' });
    }
  });
};

module.exports = setupSaveReview;
