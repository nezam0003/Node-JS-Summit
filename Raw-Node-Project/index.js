/***
 * Title: Uptime monitoring application
 * Description: A RESTFULL API to monitor up and down time of user defined links
 * Author: Mohammad Nezam Khan
 * Date: 01-09-2021
 */

// Dependencies
const http = require("http");

const { handleReqRes } = require("./helpers/handleReqRes");

// app object - module scaffolding
const app = {};

// configuration
app.config = {
  port: 4040,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleRequestResponse);
  server.listen(app.config.port, () => {
    console.log(`listing to port ${app.config.port}`);
  });
};

// Handle server request and response

app.handleRequestResponse = handleReqRes;

// start server
app.createServer();
