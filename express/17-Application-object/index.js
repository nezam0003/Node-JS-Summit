// Dependencies
const express = require("express");
const { handleReqRes } = require("./handleReqRes");
const app = express();
const appTwo = express();
const appThree = express();

// app.path()
app.use("/app-two", appTwo);
appTwo.use("/app-three", appThree);
console.log(app.path());
console.log(appTwo.path());
console.log(appThree.path());

// app.locals object
app.locals.title = "My Node APP";
app.enable("case sensitive routing");
app.get("/", handleReqRes);

// app.all()
app.all("/about", (req, res) => {
  res.send("app.all method here");
});

// app.set()
app.set("name", "Nezam khan");
const myName = app.get("name");
console.log(myName);

// app.param()
app.param("id", (req, res, next, id) => {
  const user = {
    userID: id,
    name: "fhameed khan nezam",
  };
  req.userDetails = user;
  next();
});

app.get("/user/:id", (req, res) => {
  console.log(req.userDetails);
  res.send("welcome to users page");
});

// template engine
app.set("view engine", "ejs");

// app.route()
app
  .route("/products/product")
  .get((req, res) => {
    res.render("pages/about");
  })
  .post((req, res) => {
    res.send("hello product from post");
  })
  .put((req, res) => {
    res.send("hello product from put");
  });

app.listen(4000, () => console.log("listing on port 4000"));
