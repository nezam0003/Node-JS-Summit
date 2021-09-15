const express = require("express");

const app = express();

// config middleware
const loggerWrapper = (options) => {
  return (req, res, next) => {
    if (options.log) {
      console.log(
        `${new Date(Date.now()).toTimeString()} - ${req.method} - ${
          req.protocol
        } - ${req.originalUrl} - ${req.ip}`
      );
      next();
    } else {
      throw new Error("sorry there was an error to log");
    }
  };
};

// custom middleware
const logger = (req, res, next) => {
  console.log(
    `${new Date(Date.now()).toTimeString()} - ${req.method} - ${
      req.protocol
    } - ${req.originalUrl} - ${req.ip}`
  );
  throw new Error("an error occurs");
};

// app.use(logger);

app.get("/home", (req, res) => {
  console.log(req.method);
  console.log(req.originalUrl);
  res.send("welcome to home page");
});

app.get("/contact", (req, res) => {
  res.send("welcome to home contact");
});

// sub app
const adminRouter = express.Router();
adminRouter.use(loggerWrapper({ log: false }));
app.use("/admin", adminRouter);

adminRouter.get("/dashboard", (req, res) => {
  res.send("welcome to dashboard");
  console.log(req.baseUrl);
  console.log(req.originalUrl);
});

// Error handling middleware
const errorHandlingMiddleWare = (err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("there was a server side error");
};

adminRouter.use(errorHandlingMiddleWare);

app.listen(4000, () => console.log("server running on port 4000"));
