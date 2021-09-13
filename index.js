// Dependencies
const express = require("express");

const app = express();

// app.use(express.json());
// app.use(express.raw());
// app.use(express.text())
// app.use(express.urlencoded());
// app.use(
//   express.static(`${__dirname}/public/`, {
//     index: "home.html",
//   })
// );

const router = express.Router({
  caseSensitive: true,
});
app.use(router);

router.get("/contact", (req, res) => {
  res.send("this is contact page with get method");
});
router.post("/", (req, res) => {
  // console.log(req.body);
  res.send("this is home page with post method");
});

app.listen(4000, () => {
  console.log(`Listing on Port no 4000`);
});
