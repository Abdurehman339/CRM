const authService = require("../service/auth.service.js");

exports.signup = async (req, res) => {
  try {
    const { status, data } = await authService.signup(req.body, res);
    res.status(status).json(data);
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { status, data } = await authService.login(req.body, res);
    res.status(status).json(data);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  try {
    const { status, data } = authService.logout(res);
    res.status(status).json(data);
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkAuth = (req, res) => {
  try {
    const { status, data } = authService.checkAuth(req.user);
    res.status(status).json(data);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
