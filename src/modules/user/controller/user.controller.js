const userService = require("../service/user.service");

exports.getAllUsers = async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  try {
    const users = await userService.getAllUsers({ userId });
    res.status(200).json(users);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching users:", error.message);
    }
    next(error);
  }
};
