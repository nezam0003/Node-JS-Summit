const express = require("express");
const app = express();
app.get("/home", (req, res) => {
  res.send("welcome to home page");
});
app.listen(4000, () => console.log("server running on port 4000"));
