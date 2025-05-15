const mongoose = require("mongoose");
const TYPE = require("../enum/type.js");

const notificationSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Type: {
      type: String,
      enum: Object.values(TYPE), // extendable
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Body: {
      type: String,
      required: true,
    },
    IsRead: {
      type: Boolean,
      default: false,
    },
    // Link: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
