const mongoose = require("mongoose");
const PRIORITY = require("../enum/priority");
const REPEAt_EVERY = require("../enum/repeatEvery");
const STATUS = require("../enum/status");

const taskSchema = new mongoose.Schema(
  {
    IsPublic: {
      type: Boolean,
      default: false,
    },
    Attachments: [
      {
        url: { type: String, required: true },
      },
    ],
    Subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 100,
    },
    HourlyRate: {
      type: Number,
      min: 0,
    },
    StartDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    DueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: "Due date must be after start date",
      },
    },
    Priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: "Medium",
    },
    RepeatEvery: {
      type: String,
      enum: Object.values(REPEAt_EVERY),
      default: "None",
    },
    RelatedTo: {
      type: String,
      default: null,
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Project",
    },
    Assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Description: {
      type: String,
      maxlength: 2000,
    },
    Status: {
      type: String,
      enum: Object.values(STATUS),
      default: "In Progress",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
