const userService = require("../service/user.service");

exports.getAllUsers = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  try {
    const users = await userService.getAllUsers({ userId });
    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
