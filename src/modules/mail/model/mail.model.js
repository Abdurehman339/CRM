const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: [
      {
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        seen: {
          type: Boolean,
          default: false,
        },
      },
    ],
    subject: {
      type: String,
      required: function () {
        return !this.isDraft;
      },
      trim: true,
    },
    body: {
      type: String,
      required: function () {
        return !this.isDraft;
      },
    },
    attachments: [
      {
        type: String,
      },
    ],
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mail", mailSchema);
