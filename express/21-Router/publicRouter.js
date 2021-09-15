const express = require("express");

const publicRouter = express.Router();

// middleware
// const log = (req, res, next) => {
//   console.log("i am logging something");
//   next();
// };

// publicRouter.all("*", log);

// publicRouter.get("/", (req, res) => {
//   res.send("welcome to home page");
// });

// publicRouter.param((param, option) => (req, res, next, id) => {
//   if (id == option) {
//     req.user = id;
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// });

// publicRouter.param("user", 2);

// publicRouter.param("user", (req, res, next, id) => {
//   req.user = id === "1" ? "Admin" : "others";
//   next();
// });

// publicRouter.get("/:user", (req, res) => {
//   res.send(`hello ${req.user}`);
// });

// publicRouter.get("/contact", (req, res) => {
//   res.send("welcome to  contact");
// });

publicRouter
  .route("/service")
  .all((req, res, next) => {
    console.log("all services");
    next();
  })
  .get((req, res) => {
    res.send("GET");
  })
  .post((req, res) => {
    res.send("POST");
  })
  .put((req, res) => {
    res.send("PUT");
  })
  .delete((req, res) => {
    res.send("DELETE");
  });

module.exports = publicRouter;
