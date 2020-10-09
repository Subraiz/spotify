const https = require('https');
const fs = require('fs');
require('dotenv').config();
const app = require('./app');

const PORT = 4000;

// serve the API with signed certificate on 443 (SSL/HTTPS) port
const server = https.createServer(
  {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT),
  },
  app
);

server.listen(PORT, () => {
  console.log('HTTPS Server running on port ' + PORT);
});
server.on('error', console.error);
