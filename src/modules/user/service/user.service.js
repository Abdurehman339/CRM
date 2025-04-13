const User = require("../model/user.model.js");

exports.getAllUsers = async ({ userId }) => {
  const users = await User.find({
    _id: { $ne: userId },
  }).select("-password");
  return users;
};
