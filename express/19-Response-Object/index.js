const express = require("express");

const app = express();
app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  res.send("redirected location");
});

app.get("/contact", (req, res) => {
  // res.json({ name: "Nezam" });
  // res.format({
  //   "text/plain": () => {
  //     res.send("hi plain/text");
  //   },
  //   "text/html": () => {
  //     res.render("pages/about", { name: "bangladesh" });
  //   },
  //   "application/json": () => {
  //     res.json({ name: "hi application/json" });
  //   },
  //   default: () => {
  //     res.status(406).send("not acceptable");
  //   },
  // });

  // res.cookie("hicookie", "you r cookie");
  // res.end();

  // res.location("/test");
  res.redirect("/home");
  res.end();
});

app.listen(4040, () => console.log("Listing on port 4040"));
