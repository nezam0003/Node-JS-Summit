const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userSchema = require("../../schemas/userSchema");

const router = express.Router();

// create model User
const User = new mongoose.model("User", userSchema);

/***** sign-up Route *****/
router.post("/sign-up", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "sign-up was successfull" });
  } catch (error) {
    console.log(error);
  }
});

/***** Login Route *****/
router.post("/log-in", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1 day",
          }
        );

        res
          .status(200)
          .json({ access_token: token, messaage: "Login successfull" });
      } else {
        res.status(401).json({ error: "Authentication error" });
      }
    } else {
      res.status(401).json({ error: "Authentication error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/********* Get all Users *******/
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).populate("todos");
    res.status(200).json({ data: users, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was a server side error" });
  }
});

/********* Module export ******/
module.exports = router;
