const { model, Schema } = require("mongoose");

const taskSc = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  done: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  sharedWith: [String]
});

module.exports = model("Task", taskSc);