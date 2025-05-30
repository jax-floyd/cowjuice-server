const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../reviews.txt');

const setupSaveReview = (router) => {
  router.post('/save-review', async (req, res) => {
    console.log("'/save-review' endpoint was reached.");
    try {
        console.log(req.body); // Logs the body for debugging
        // Write the ZIP to the file
        const reviewData = req.body.review;
        if (!reviewData) {
          return res.status(400).json({ error: 'Review data is required' });
        }
        // Append the review data to the file
        fs.appendFileSync(filePath,
            `${new Date().toISOString()} - ${reviewData}\n`,
            'utf8'
        );
        console.log('Review saved successfully.');

        return res.json({ status: 'success' });
      
    } catch (error) {
        console.error('Error writing zip:', error);
        res.status(500).json({ error: 'Failed to save review' });
    }
  });
};

module.exports = setupSaveReview;
