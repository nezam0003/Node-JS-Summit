const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write(
      `<html><head><title>form</title></head><body><form method="post" action="/process" ><input type= "text" name="text" /></form></body></html>`
    );
    res.end();
  } else if (req.url === "/process" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      console.log("streamed finished");
      const parseBody = Buffer.concat(body).toString();
      console.log(parseBody);
    });
    res.write("thank you for submitting");
    res.end();
  } else {
    res.write("page not found");
    res.end();
  }
});
server.listen(4040);

console.log("listing on port 4040");
