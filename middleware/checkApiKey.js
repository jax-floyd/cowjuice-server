require('../configs/loadEnv')(); // or dotenv.config()

const checkApiKey = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key || key !== process.env.COWJUICE_API_KEY) {
    return res.status(403).json({ error: 'Forbidden, like the applesauce: Invalid or missing API key' });
  }
  next();
};

module.exports = checkApiKey;