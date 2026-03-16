const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Login",
    required: true
  }
});

module.exports = mongoose.model("Todo", todoSchema);
