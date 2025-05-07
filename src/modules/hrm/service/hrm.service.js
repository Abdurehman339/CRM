const defaultRBAC = require("../../../config/defaultRBAC.js");
const User = require("../../user/model/user.model.js");

exports.getDefaultRBAC = (role) => {
  const defaultPermissions = defaultRBAC[role];
  return {
    status: 200,
    data: {
      defaultPermissions,
    },
  };
};

exports.addStaffMember = async ({ userData }) => {
  if (
    !userData.FullName ||
    !userData.Email ||
    !userData.Password ||
    !userData.Role
  ) {
    return { status: 400, data: { message: "All fields are required" } };
  }

  const existingUser = await User.findOne({ Email: userData.Email });
  if (existingUser) {
    return { status: 400, data: { message: "Email is already in use" } };
  }

  const newUser = new User(userData);
  await newUser.save();
  return {
    status: 201,
    data: {
      HrCode: newUser.HrCode,
      FullName: newUser.FullName,
      Email: newUser.Email,
      Role: newUser.Role,
    },
  };
};

exports.getMember = async ({ userId }) => {
  if (!userId) {
    return { status: 400, data: { message: "User ID is required" } };
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return { status: 404, data: { message: "User not found" } };
  }

  return {
    status: 200,
    data: user,
  };
};

exports.deleteMember = async ({ userId }) => {
  if (!userId) {
    return { status: 400, data: { message: "User ID is required" } };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, data: { message: "User not found" } };
  }

  await User.deleteOne({ _id: userId });
  return {
    status: 200,
    data: { message: "User deleted successfully" },
  };
};

exports.getAllMembers = async ({ role, status }) => {
  const filter = {};
  if (role) filter.Role = role;
  if (status) filter.Status = status;

  const users = await User.find(filter).sort({ createdAt: -1 });
  return {
    status: 200,
    data: { users },
  };
};

exports.updateMember = async ({ userId, userData }) => {
  if (!userId) {
    return { status: 400, data: { message: "User ID is required" } };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, data: { message: "User not found" } };
  }

  Object.assign(user, userData);
  await user.save();
  return {
    status: 200,
    data: user,
  };
};
