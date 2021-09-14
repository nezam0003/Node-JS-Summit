const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const adminRoute = express.Router();
adminRoute.get("/dashboard", (req, res) => {
  console.log(`adminRoute.get baseURL - ${req.baseUrl}`);
  console.log(`adminRoute.get originalURL- ${req.originalUrl}`);
  console.log(`adminRoute.get url- ${req.url}`);
  console.log(`adminRoute.get path- ${req.path}`);
  res.send("we r in the adminRoute dashboard");
});

app.use("/admin", adminRoute);

app.get("/user/:id", (req, res) => {
  console.log(`app.get baseURL - ${req.baseUrl}`);
  console.log(`app.get original url - ${req.originalUrl}`);
  console.log(`app.get url - ${req.url}`);
  console.log(`app.get path - ${req.path}`);
  console.log(`app.get hostname - ${req.hostname}`);
  console.log(`app.get method - ${req.method}`);
  console.log(`app.get protocol - ${req.protocol}`);
  console.log(`app.get params - ${req.params.id}`);
  console.log(req.query);
  console.log(req.cookies);
  console.log(req.accepts("html"));
  console.log(req.get("content-type"));

  res.send("hello user");
});

app.post("/user/", (req, res) => {
  console.log(req.body);
  console.log(req.route);
  res.send("hello post");
});

app.listen(4000, () => console.log("app listing on port 4000"));
