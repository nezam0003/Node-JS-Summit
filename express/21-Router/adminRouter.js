const express = require("express");

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("admin dashboard");
});
adminRouter.get("/login", (req, res) => {
  res.send("admin login");
});

module.exports = adminRouter;
