// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../../schemas/todoSchema");

const router = express.Router();

// create model
const Todo = new mongoose.model("Todo", todoSchema);

// Get all todos
router.get("/", async (req, res) => {
  try {
    await Todo.find({ status: "inactive" })
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
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({ error: "there was a server side error" });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully" });
    }
  });
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
