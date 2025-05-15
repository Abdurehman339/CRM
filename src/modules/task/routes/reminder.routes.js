const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  createReminder,
  getReminder,
  updateReminder,
  deleteReminder,
} = require("../controller/reminder.controller.js");
const router = express.Router();

router.post("/create-reminder", protectRoute(), createReminder);
router.get("/get-reminder", protectRoute(), getReminder);
router.put("/update-reminder", protectRoute(), updateReminder);
router.delete("/delete-reminder", protectRoute(), deleteReminder);

module.exports = router;
