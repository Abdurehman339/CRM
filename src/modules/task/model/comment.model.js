const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    Task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    Author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Body: {
      type: String,
      required: true,
      trim: true,
    },
    Attachments: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
