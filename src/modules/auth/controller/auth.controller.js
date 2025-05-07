const authService = require("../service/auth.service.js");

exports.signup = async (req, res, next) => {
  try {
    const { status, data } = await authService.signup(req.body, res);
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error in signup controller", error.message);
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { status, data } = await authService.login(req.body, res);
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error in login controller", error.message);
    }
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    const { status, data } = authService.logout(res);
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error in logout controller", error.message);
    }
    next(error);
  }
};

exports.checkAuth = (req, res, next) => {
  try {
    const { status, data } = authService.checkAuth(req.user);
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error in checkAuth controller", error.message);
    }
    next(error);
  }
};
