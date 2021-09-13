// Dependencies
const express = require("express");

const app = express();

// app.use(express.json());
// app.use(express.raw());
app.use(express.text());

app.get("/", (req, res) => {
  res.send("this is home page with get method");
});
app.post("/", (req, res) => {
  console.log(req.body);
  res.send("this is home page with post method");
});

app.listen(4000, () => {
  console.log(`Listing on Port no 4000`);
});
