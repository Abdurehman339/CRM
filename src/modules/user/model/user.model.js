const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const SEX = require("../enum/sex.js");
const STATUS = require("../enum/status.js");
const JOB_POSITION = require("../enum/jobPosition.js");
const WORK_PLACE = require("../enum/workPlace.js");
const LANGUAGE = require("../enum/language.js");
const DIRECTION = require("../enum/direction.js");
const ROLE = require("../../../config/role.js");
const PERMISSION = require("../../../config/permission.js");
const MARITAL_STATUS = require("../enum/maritalStatus.js");

const userSchema = new mongoose.Schema(
  {
    HrCode: {
      type: Number,
      unique: true,
    },
    FullName: {
      type: String,
      required: true,
      trim: true,
    },
    Sex: {
      type: String,
      default: null,
      enum: Object.values(SEX),
    },
    BirthDay: {
      type: Date,
      default: null,
    },
    BirthPlace: {
      type: String,
      default: null,
    },
    HomeTown: {
      type: String,
      default: null,
    },
    MaritalStatus: {
      type: String,
      enum: Object.values(MARITAL_STATUS),
      default: null,
    },
    Nationality: {
      type: String,
      default: null,
    },
    Religion: {
      type: String,
      default: null,
    },
    Identification: {
      type: String,
      default: null,
    },
    DaysForIdentity: {
      type: Date,
      default: null,
    },
    PlaceOfIssue: {
      type: String,
      default: null,
    },
    Resident: {
      type: String,
      default: null,
    },
    CurrentHomeAddress: {
      type: String,
      default: null,
    },
    Literacy: {
      type: String,
      default: null,
    },
    Status: {
      type: String,
      enum: Object.values(STATUS),
      default: null,
    },
    JobPosition: {
      type: String,
      enum: Object.values(JOB_POSITION),
      default: null,
    },
    workPlace: {
      type: String,
      enum: Object.values(WORK_PLACE),
      default: null,
    },
    BankAccount: {
      type: String,
      default: null,
    },
    NameofAccount: {
      type: String,
      default: null,
    },
    BankofIssue: {
      type: String,
      default: null,
    },
    PersonalTaxCode: {
      type: String,
      default: null,
    },
    Amount: {
      type: Number,
      default: null,
      min: 0,
    },
    Facebook: {
      type: String,
      default: null,
    },
    LinkedIn: {
      type: String,
      default: null,
    },
    Skype: {
      type: String,
      default: null,
    },
    Email: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    DefaultLanguage: {
      type: String,
      enum: Object.values(LANGUAGE),
      default: null,
    },
    Direction: {
      type: String,
      enum: Object.values(DIRECTION),
      default: null,
    },
    EmailSignature: {
      type: String,
      default: null,
    },
    OtherDetails: {
      type: String,
      default: null,
    },
    Role: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
    },
    Permissions: {
      type: [String],
      enum: Object.values(PERMISSION),
      default: [],
    },
    Password: {
      type: String,
      required: true,
      minlength: 6,
    },
    LastLogin: {
      type: Date,
      default: null,
    },
    Location: {
      type: String,
      default: null,
    },
    ProfileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.plugin(AutoIncrement, { inc_field: "HrCode", start_seq: 100 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.Password);
};

userSchema.index({ Email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
