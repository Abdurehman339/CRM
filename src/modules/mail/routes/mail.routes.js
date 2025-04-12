const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  sendMail,
  sentMail,
  inboxMail,
} = require("../controller/mail.controller.js");

const router = express.Router();

router.post("/send", protectRoute, sendMail);
router.get("/sent", protectRoute, sentMail);
router.get("/inbox", protectRoute, inboxMail);

module.exports = router;
