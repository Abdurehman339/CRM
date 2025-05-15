const Task = require("../model/task.model.js");
const User = require("../../user/model/user.model.js");
const Reminder = require("../model/reminderModel.js");
const mongoose = require("mongoose");

exports.createReminder = async ({
  taskId,
  dateToNotify,
  userId,
  description,
  sendEmail,
  reminderCreator,
}) => {
  if (!taskId || !dateToNotify || !description) {
    return res
      .status(400)
      .json({ message: "Task ID, DateToNotify, and Description are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error(`Invalid task ID format: ${taskId}`);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`Invalid user ID format: ${userId}`);
  }

  const notifyDate = new Date(dateToNotify);

  if (isNaN(notifyDate.getTime()) || notifyDate <= new Date()) {
    return res
      .status(400)
      .json({ message: "dateToNotify must be a valid future date" });
  }

  const taskExists = await Task.findById(taskId);
  if (!taskExists) {
    return res.status(404).json({ message: "Task not found" });
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ message: "User to notify not found" });
  }

  const reminder = await Reminder.create({
    Task: taskId,
    DateToNotify: notifyDate,
    User: userId,
    Description: description,
    SendEmail: sendEmail ? sendEmail : false,
    CreatedBy: reminderCreator,
  });

  return {
    status: 200,
    data: reminder,
  };
};

exports.getReminder = async ({ taskId, page = 1, limit = 3 }) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const skip = (page - 1) * limit;

  const reminders = await Reminder.find({ Task: taskId })
    .populate("User", "FullName Email")
    .populate("CreatedBy", "FullName Email")
    .sort({ DateToNotify: 1 })
    .skip(skip)
    .limit(limit);

  return {
    status: 200,
    data: {
      reminders,
    },
  };
};

exports.updateReminder = async ({
  reminderId,
  reminderCreator,
  dateToNotify,
  description,
  user,
  sendEmail,
}) => {
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ message: "Invalid reminder ID" });
  }

  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }

  if (!reminder.CreatedBy.equals(reminderCreator)) {
    return res
      .status(403)
      .json({ message: "Unauthorized to update this reminder" });
  }

  if (dateToNotify && new Date(dateToNotify) <= new Date()) {
    return res
      .status(400)
      .json({ message: "Reminder date must be in the future" });
  }

  if (dateToNotify) reminder.DateToNotify = dateToNotify;
  if (description !== undefined) reminder.Description = description;
  if (user) reminder.User = user;
  if (sendEmail !== undefined) reminder.SendEmail = sendEmail;

  await reminder.save();

  return {
    status: 200,
    data: reminder,
  };
};

exports.deleteReminder = async ({ reminderId, reminderCreator }) => {
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ message: "Invalid reminder ID" });
  }

  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }

  if (!reminder.CreatedBy.equals(reminderCreator)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this reminder" });
  }

  await Reminder.findByIdAndDelete(reminderId);

  return {
    status: 200,
    data: {
      message: "Reminder Deleted Successfully",
    },
  };
};
