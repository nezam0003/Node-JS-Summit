const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// custom instance methods
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
};

// custom Static methods
todoSchema.statics = {
  findByInActive: function () {
    return this.find({ status: "inactive" });
  },
};

// custom Query helper methods
todoSchema.query = {
  byLanguage: function (language) {
    return this.find({ description: new RegExp(language, "i") });
  },
};

// export module
module.exports = todoSchema;
