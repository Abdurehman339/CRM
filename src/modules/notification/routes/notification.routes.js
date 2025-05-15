const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  getAllNotifications,
  getNotificaiton,
  markAsRead,
} = require("../controller/notification.controller.js");
const router = express.Router();

router.get("/get-all-notifications", protectRoute(), getAllNotifications);
router.get("/get-notification", protectRoute(), getNotificaiton);
router.put("/mark-as-read", protectRoute(), markAsRead);

module.exports = router;
