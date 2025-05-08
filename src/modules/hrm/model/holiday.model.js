const mongoose = require("mongoose");
const LEAVE_TYPE = require("../enum/leaveType.js");
const TIME_SHEET = require("../enum/timeSheet.js");
const ROLE = require("../../../config/role.js");
const POSITION = require("../../user/enum/jobPosition.js");

const HolidaySchema = new mongoose.Schema(
  {
    ReasonForTimeoff: {
      type: String,
      required: true,
    },
    LeaveType: {
      type: String,
      enum: Object.values(LEAVE_TYPE),
      trim: true,
    },
    DaysOff: {
      type: Date,
      default: null,
    },
    TimeSheet: {
      type: String,
      enum: Object.values(TIME_SHEET),
      required: true,
    },
    Department: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
      default: "All",
    },
    Position: {
      type: String,
      enum: Object.values(POSITION),
      required: true,
      default: "All",
    },
    AddedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Holiday", HolidaySchema);
