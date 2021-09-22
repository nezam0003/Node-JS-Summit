// dependencies
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const todoHandler = require("./route-handler/todoHandler");
const userHandler = require("./route-handler/userHandler");

const app = express();
dotenv.config();
app.use(express.json());

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successfull"))
  .catch((err) => console.log("can not connect with database"));

// Application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  } else {
    res.status(500).json({ error: err });
  }
};

app.use(errorHandler);

app.listen(5000, () => console.log("server runing on port 5000"));
