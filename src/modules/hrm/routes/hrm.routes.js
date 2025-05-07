const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  getDefaultRBAC,
  addStaffMember,
  getMember,
  deleteMember,
  getAllMembers,
  updateMember,
} = require("../controller/hrm.controller.js");

const router = express.Router();

router.get("/get-default-rbac", protectRoute(), getDefaultRBAC);
router.get("/get-member", protectRoute(), getMember);
router.get("/get-all-members", protectRoute(), getAllMembers);
router.post("/add-staff-member", protectRoute(), addStaffMember);
router.put("/update-member", protectRoute(), updateMember);
router.delete("/delete-member", protectRoute(), deleteMember);

module.exports = router;
