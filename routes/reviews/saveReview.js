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

const setupSaveReview = (router) => {
  router.post('/save-review', async (req, res) => {
    console.log("'/save-review' endpoint was reached.");
    try {
      const reviewData = req.body.review;
      if (!reviewData) {
        return res.status(400).json({ error: 'Review data is required' });
      }

      const csvLine = [
        uuid.v4(),
        escapeCsvField(reviewData),
        escapeCsvField(req.body.email),
        escapeCsvField(req.body.orderNumber),
        escapeCsvField(req.body.confidential),
        new Date().toISOString()
      ].join(',') + '\n';

      const csvFilePath = path.join(__dirname, '../../reviews.csv');
      fs.appendFileSync(csvFilePath, csvLine, 'utf8');

      console.log(`A new review from ${req.body.email} was successfully saved.`);
      return res.json({ status: 'success' });

    } catch (error) {
      console.error('Error writing review:', error);
      res.status(500).json({ error: 'Failed to save review' });
    }
  });
};

module.exports = setupSaveReview;