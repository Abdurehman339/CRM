const Task = require("../model/task.model.js");
const mongoose = require("mongoose");
const User = require("../../user/model/user.model.js");
const mailService = require("../../mail/service/mail.service.js");
const notificationService = require("../../notification/service/notification.service.js");
const TYPE = require("../../notification/enum/type.js");

exports.createTask = async (taskData, userId) => {
  if (!taskData.Subject || !taskData.StartDate) {
    return {
      status: 400,
      data: { message: "Subject and Start Date are required" },
    };
  }

  for (const followerId of taskData.Followers) {
    if (!mongoose.Types.ObjectId.isValid(followerId)) {
      throw new Error(`Invalid follower ID format: ${followerId}`);
    }

    const follower = await User.findById(followerId);
    if (!follower) {
      throw new Error(`Follower not found with ID: ${followerId}`);
    }
  }

  for (const assigneeId of taskData.Assignees) {
    if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
      throw new Error(`Invalid assignee ID format: ${assigneeId}`);
    }

    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      throw new Error(`Assignee not found with ID: ${assigneeId}`);
    }
  }

  const task = await Task.create(taskData);

  await mailService.sendMail({
    senderId: userId,
    receiverIds: taskData.Assignees,
    subject: "You have been assigned with a task",
    body: taskData.Description,
  });

  await mailService.sendMail({
    senderId: userId,
    receiverIds: taskData.Followers,
    subject: "You have to be the follower for this task",
    body: taskData.Description,
  });

  for (const Assignee of taskData.Assignees) {
    await notificationService.sendNotification({
      userId: Assignee,
      title: "You have been Assigned with a task",
      body: taskData.Description,
      type: TYPE.SYSTEM,
    });
  }

  for (const Follower of taskData.Followers) {
    await notificationService.sendNotification({
      userId: Follower,
      title: "You have to be the follower for this task",
      body: taskData.Description,
      type: TYPE.SYSTEM,
    });
  }

  return {
    status: 200,
    data: task,
  };
};

exports.updateTask = async (taskId, taskData, userId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return {
      status: 400,
      data: { message: "Invalid task ID format" },
    };
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return {
      status: 404,
      data: { message: "Task not found" },
    };
  }

  if (taskData.Assignees) {
    for (const assigneeId of taskData.Assignees) {
      if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
        throw new Error(`Invalid assignee ID format: ${assigneeId}`);
      }

      const assignee = await User.findById(assigneeId);
      if (!assignee) {
        throw new Error(`Assignee not found with ID: ${assigneeId}`);
      }
    }
  }

  if (taskData.Followers) {
    for (const followerId of taskData.Followers) {
      if (!mongoose.Types.ObjectId.isValid(followerId)) {
        throw new Error(`Invalid follower ID format: ${followerId}`);
      }

      const follower = await User.findById(followerId);
      if (!follower) {
        throw new Error(`Follower not found with ID: ${followerId}`);
      }
    }
  }

  Object.assign(task, taskData);
  await task.save();

  await mailService.sendMail({
    senderId: userId,
    receiverIds: task.Assignees,
    subject: "There is an update on a task",
    body: task.Description,
  });

  await mailService.sendMail({
    senderId: userId,
    receiverIds: task.Followers,
    subject: "There is an update on a task",
    body: task.Description,
  });

  for (const Assignee of task.Assignees) {
    await notificationService.sendNotification({
      userId: Assignee,
      title: "There is an update on a task",
      body: task.Description,
      type: TYPE.SYSTEM,
    });
  }

  for (const Follower of task.Followers) {
    await notificationService.sendNotification({
      userId: Follower,
      title: "There is an update on a task",
      body: task.Description,
      type: TYPE.SYSTEM,
    });
  }

  return {
    status: 200,
    data: task,
  };
};

exports.getTask = async ({ taskId }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return {
      status: 400,
      data: { message: "Invalid Task ID format" },
    };
  }

  const task = await Task.findById(taskId)
    .populate("Assignees", "FullName Email")
    .populate("Followers", "FullName Email");

  if (!task) {
    return {
      status: 404,
      data: { message: "Task not found" },
    };
  }

  return {
    status: 200,
    data: task,
  };
};

exports.getAllTasks = async ({
  userId,
  isPublic,
  priority,
  assignedToMe,
  followedByMe,
  status,
  page = 1,
  limit = 20,
}) => {
  const query = {};

  if (isPublic !== undefined) {
    query.IsPublic = isPublic === "true"; // convert from string to boolean
  }

  if (priority) {
    query.Priority = priority;
  }

  if (status) {
    query.Status = status;
  }

  if (assignedToMe === "true") {
    query.Assignees = userId;
  }

  if (followedByMe === "true") {
    query.Followers = userId;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(query)
    .populate("Assignees", "FullName Email")
    .populate("Followers", "FullName Email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  return {
    status: 200,
    data: {
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  };
};

exports.deleteTask = async ({ taskId }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return {
      status: 400,
      data: { message: "Invalid Task ID format" },
    };
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return {
      status: 404,
      data: { message: "Task not found" },
    };
  }

  // if (!task.CreatedBy?.equals(userId)) {
  //   return {
  //     status: 403,
  //     data: { message: "You are not authorized to delete this task" },
  //   };
  // }

  await Task.findByIdAndDelete(taskId);

  return {
    status: 200,
    data: { message: "Task deleted successfully" },
  };
};
