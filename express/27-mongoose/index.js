const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./router-handler/todoHandler");

const app = express();
app.use(express.json());

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successfull"))
  .catch((err) => console.log("can not connect with database"));

app.use("/todo", todoHandler);

app.listen(5000, () => console.log("server running on port 5000"));
