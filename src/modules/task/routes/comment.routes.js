const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  addComment,
  getAllComments,
  deleteComment,
} = require("../controller/comment.controller.js");
const router = express.Router();

router.post("/add-comment", protectRoute(), addComment);
router.get("/get-all-comments", protectRoute(), getAllComments);
router.delete("/delete-comment", protectRoute(), deleteComment);

module.exports = router;
