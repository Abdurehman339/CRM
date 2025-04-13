const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  sendMail,
  sentMail,
  inboxMail,
  getMailbyId,
  toggleStarred,
  toggleImportant,
  toggleTrash,
  addToDraft,
  getDraft,
  getImportant,
  getStarred,
  getTrash,
  removeDraft,
} = require("../controller/mail.controller.js");

const router = express.Router();

router.post("/send", protectRoute, sendMail);
router.post("/add-to-draft", protectRoute, addToDraft);
router.put("/remove-draft/:id", protectRoute, removeDraft);
router.get("/get-draft", protectRoute, getDraft);
router.get("/get-important", protectRoute, getImportant);
router.get("/get-starred", protectRoute, getStarred);
router.get("/get-trash", protectRoute, getTrash);
router.get("/sent", protectRoute, sentMail);
router.get("/inbox", protectRoute, inboxMail);
router.put("/toggle-starred/:id", protectRoute, toggleStarred);
router.put("/toggle-important/:id", protectRoute, toggleImportant);
router.put("/toggle-trash/:id", protectRoute, toggleTrash);
router.get("/:id", protectRoute, getMailbyId);

module.exports = router;
