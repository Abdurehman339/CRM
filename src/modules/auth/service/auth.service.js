const bcrypt = require("bcryptjs");
const User = require("../../user/model/user.model");
const generateToken = require("../../../utils/generate.token");

exports.signup = async ({ fullName, email, password }, res) => {
  if (!fullName || !email || !password) {
    return { status: 400, data: { message: "All fields are required" } };
  }

  if (password.length < 6) {
    return {
      status: 400,
      data: { message: "Password must be at least 6 characters" },
    };
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { status: 400, data: { message: "Email already exists" } };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  generateToken(newUser._id, res);

  return {
    status: 201,
    data: {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    },
  };
};

exports.login = async ({ Email, Password }, res) => {
  const user = await User.findOne({ Email: Email });

  if (!user) {
    return { status: 400, data: { message: "Invalid credentials" } };
  }

  const isPasswordCorrect = await user.comparePassword(Password);
  if (!isPasswordCorrect) {
    return { status: 400, data: { message: "Invalid credentials" } };
  }

  generateToken(user._id, res); // set cookie or token in response

  return {
    status: 200,
    data: {
      _id: user._id,
      fullName: user.FullName,
      email: user.Email,
      profilePic: user.ProfileImage,
    },
  };
};

exports.logout = (res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  return {
    status: 200,
    data: { message: "Logged out successfully" },
  };
};

exports.checkAuth = (user) => {
  return {
    status: 200,
    data: user,
  };
};
