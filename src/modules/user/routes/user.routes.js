const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const { getAllUsers } = require("../controller/user.controller");
const { ALL } = require("../../../config/permission.js");

const router = express.Router();

router.get("/get-all", protectRoute(), getAllUsers);

module.exports = router;
