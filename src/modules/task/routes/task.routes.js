const express = require("express");
const protectRoute = require("../../../middlewares/auth.middleware.js");
const {
  createTask,
  updateTask,
  getTask,
  getAllTasks,
  deleteTask,
} = require("../controller/task.controller.js");
const router = express.Router();

router.post("/create-task", protectRoute(), createTask);
router.post("/update-task", protectRoute(), updateTask);
router.get("/get-task", protectRoute(), getTask);
router.get("/get-all-tasks", protectRoute(), getAllTasks);
router.delete("/delete-task", protectRoute(), deleteTask);

module.exports = router;
