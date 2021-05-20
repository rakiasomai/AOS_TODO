const { model, Schema } = require("mongoose");

const us = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  sharedTasks: [String]
});

module.exports = model("User", us);