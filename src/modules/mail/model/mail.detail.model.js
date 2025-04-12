const mongoose = require("mongoose");

const mailDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mail",
      required: true,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    important: {
      type: Boolean,
      default: false,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MailDetail", mailDetailSchema);
