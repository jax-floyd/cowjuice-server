const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../zips.txt');

const setupWriteZip = (router) => {
    router.post('/write-zip', async (req, res) => {
        console.log("'/write-zip' endpoint was reached.");
        try {
            console.log(req.body)
            // Write the  back to the file
            await fs.promises.writeFile(filePath, req.body.zip.toString(), 'utf8');
            return res.json({ status: 'success' });
            
        } catch (error) {
            console.error('Error writing zip:', error);
            res.status(500).json({ error: 'Failed to write zip' });
        }
    });
};

module.exports = setupWriteZip;