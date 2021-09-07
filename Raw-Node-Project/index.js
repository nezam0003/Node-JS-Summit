/***
 * Title: Uptime monitoring application
 * Description: A RESTFULL API to monitor up and down time of user defined links
 * Author: Mohammad Nezam Khan
 * Date: 01-09-2021
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

// app object - module scaffolding
const app = {};

// test writing file
data.delete("test", "newFile", (err) => {
  console.log(err);
});

// create server
app.createServer = () => {
  const server = http.createServer(app.handleRequestResponse);
  server.listen(environment.port, () => {
    console.log(`node environment is  ${process.env.NODE_ENV}`);
    console.log(`listing to port ${environment.port}`);
  });
};

// Handle server request and response

app.handleRequestResponse = handleReqRes;

// start server
app.createServer();
