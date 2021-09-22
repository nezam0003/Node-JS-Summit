// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../../schemas/todoSchema");
const userSchema = require("../../schemas/userSchema");
const checkLogin = require("../middleware/checkLogin");

const router = express.Router();

// create model
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// Get all todos
router.get("/", checkLogin, (req, res) => {
  try {
    Todo.find({})
      .populate("user", "name username ")
      .select({
        _id: 0,
        __v: 0,
      })
      .exec((err, data) => {
        if (err) {
          res.status(500).json({ error: "there was a server side error" });
        } else {
          res
            .status(200)
            .json({ result: data, message: "all Todos successfully" });
        }
      });
  } catch (error) {
    console.log(error);
  }
});

// get active todos
router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
});

// Static methods example
router.get("/js", async (req, res) => {
  try {
    const data = await Todo.findByInActive();
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
});

// Query helper methods - get todo by language
router.get("/language", async (req, res) => {
  try {
    const data = await Todo.find().byLanguage("react");
    res.status(200).json({ data });
  } catch (error) {}
});

// Get a todo by ID all todos
router.get("/:id", async (req, res) => {
  try {
    await Todo.find({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.status(500).json({ error: "there was a server side error" });
      } else {
        res.status(200).json({ result: data });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// post a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({ message: "Todo was inserted successfully" });
  } catch (error) {
    console.log(error);
  }
});

// Post multiple todos
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({ error: "there was a server side error" });
    } else {
      res.status(200).json({ message: "Todos were inserted successfully" });
    }
  });
});

// update/put todo
router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: "inactive",
        },
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          res.status(500).json({ error: "there was a server side error" });
        } else {
          res.status(200).json({ message: "Todo was updated successfully" });
        }
      }
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});
// Delete todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).json({ error: "there was a server side error" });
      } else {
        res.status(200).json({ message: "todo was removed successfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// export module
module.exports = router;
