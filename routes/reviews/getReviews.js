const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../reviews.txt');

const setupGetReviews = (router) => {
  router.get('/get-reviews', async (req, res) => {
    console.log("'/get-reviews' endpoint was reached.");
    try {
        // Read the current number of cases from the file
        const data = await fs.promises.readFile(filePath, 'utf8');

        // Split the data by new lines to get individual reviews
        const reviews = data.split('\n').filter(line => line.trim() !== '');

        // Split each review into the parts, extracting the date of the review and the text
        // The Best Milk on Planet Milk, hrg@stanford.edu, 6447231205665, true
        const formattedReviews = reviews.map(review => {
            const parts = review.split(', ');
            return {
                text: parts[0],
                timestamp: parts[-1],
            };
        });
        
        // Send the reviews as a JSON response
        res.json({ formattedReviews });
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
  });
};

module.exports = setupGetReviews;