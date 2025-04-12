const express = require("express");
const {
  checkAuth,
  login,
  logout,
  signup,
} = require("../controller/auth.controller.js");
const protectRoute = require("../../../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

module.exports = router;
