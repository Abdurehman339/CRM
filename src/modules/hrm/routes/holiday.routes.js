const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  addHoliday,
  getAllHolidays,
  getHoliday,
  deleteHoliday,
  updateHoliday,
} = require("../controller/holiday.controller.js");

const router = express.Router();

router.get("/get-holiday", protectRoute(), getHoliday);
router.get("/get-all-holidays", protectRoute(), getAllHolidays);
router.post("/add-holiday", protectRoute(), addHoliday);
router.put("/update-holiday", protectRoute(), updateHoliday);
router.delete("/delete-holiday", protectRoute(), deleteHoliday);

module.exports = router;
