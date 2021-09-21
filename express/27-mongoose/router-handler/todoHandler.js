// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../../schemas/todoSchema");

const router = express.Router();

// create model
const Todo = new mongoose.model("Todosecond", todoSchema);

router.get("/", async (req, res) => {
  try {
    const todo = await Todo.find({ status: "inactive" });
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const postTodo = await new Todo(req.body);
    res.status(200).json({ message: "todo post successfull" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
