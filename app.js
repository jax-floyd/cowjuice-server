const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const setupRoutes = require('./routes/index.js');
const checkApiKey = require('./middleware/checkApiKey');

// We read the SSL certificate and private key from `keys` directory
const httpsOptions = {
    ca: fs.readFileSync("./keys/ssl/ca_bundle.crt"),
    key: fs.readFileSync("./keys/ssl/private.key"),
    cert: fs.readFileSync("./keys/ssl/certificate.crt")
};

const app = express();
app.use(express.json());

// We define a function to map over the list of allowed CORS origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://gotcowjuice.com', 'https://cow-juice-development.web.app', '', 'https://admin.gotcowjuice.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cow-juice-api-key'],
}));

app.use(checkApiKey); // <-- Enforces API key globally

// We create an HTTPS server instance, instead of our traditional HTTP server
const server = https.createServer(httpsOptions, app);

// Pass the app instance to the setupRoutes function
app.use('/', setupRoutes(app));

module.exports = {
    app: app,
    server: server
};