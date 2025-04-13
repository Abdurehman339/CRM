const userService = require("../service/user.service");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
