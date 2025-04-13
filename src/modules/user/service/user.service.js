const User = require("../model/user.model.js");

exports.getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};
