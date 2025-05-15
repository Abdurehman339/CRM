const taskService = require("../service/task.service.js");

exports.createTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const taskData = req.body;
    const { status, data } = await taskService.createTask(taskData, userId);
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.query;
    const taskData = req.body;
    const { status, data } = await taskService.updateTask(
      taskId,
      taskData,
      userId
    );
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const { taskId } = req.query;
    const { status, data } = await taskService.getTask({ taskId });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { isPublic, priority, assignedToMe, followedByMe, page, limit } =
      req.query;
    const { status, data } = await taskService.getAllTasks({
      userId,
      isPublic,
      priority,
      assignedToMe,
      followedByMe,
      status: req.query.status,
      page,
      limit,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.query;
    const { status, data } = await taskService.deleteTask({ taskId });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};
