const http = require("http");
const server = http.createServer((req, res) => {
  res.write("<h1> hello programmers </h1>");
  res.end();
});
server.listen(4000);
console.log("listing on port 3000");
