const http = require('http');
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(
    `Server running at http://localhost:${port}/api in ${process.env.ENV} mode.`
  );
});
server.on('error', console.error);
