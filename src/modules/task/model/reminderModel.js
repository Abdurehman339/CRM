const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    Task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task reference is required"],
    },
    DateToNotify: {
      type: Date,
      required: [true, "Date to notify is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Reminder date must be in the future",
      },
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reminder must be set to a user"],
    },
    Description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    SendEmail: {
      type: Boolean,
      default: false,
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
