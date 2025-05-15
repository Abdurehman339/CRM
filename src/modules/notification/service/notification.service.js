const Notification = require("../model/notification.model.js");
const User = require("../../user/model/user.model.js");
const mongoose = require("mongoose");

exports.sendNotification = async ({ userId, title, body, type }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      status: 400,
      data: { message: "Invalid user ID format" },
    };
  }

  const user = await User.findById(userId);
  if (!user) {
    return {
      status: 404,
      data: { message: "User not found" },
    };
  }

  if (!type || !body || !title) {
    return {
      status: 400,
      data: { message: "Type, body and title are required" },
    };
  }

  const notification = await Notification.create({
    User: userId,
    Type: type,
    Body: body,
    Title: title,
  });

  return {
    status: 200,
    data: notification,
  };
};

exports.getAllNotifications = async ({
  userId,
  type,
  isRead,
  page = 1,
  limit = 20,
}) => {
  const filter = { User: userId };
  if (type) filter.Type = type;
  if (isRead) filter.IsRead = isRead;

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const skip = (page - 1) * limit;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    status: 200,
    data: {
      notifications,
    },
  };
};

exports.getNotificaiton = async ({ userId, notificationId }) => {
  if (!notificationId) {
    return { status: 400, data: { message: "Notification ID is required" } };
  }

  const notification = await Notification.findById(notificationId);

  if (!notification || !notification.User.equals(userId)) {
    return { status: 404, data: { message: "Notification not found" } };
  }

  return {
    status: 200,
    data: notification,
  };
};

exports.markAsRead = async ({ userId, notificationId }) => {
  if (!notificationId) {
    return { status: 400, data: { message: "Notification ID is required" } };
  }

  const notification = await Notification.findById(notificationId);

  if (!notification || !notification.User.equals(userId)) {
    return { status: 404, data: { message: "Notification not found" } };
  }

  notification.IsRead = true;
  await notification.save();

  return {
    status: 200,
    data: {
      message: "Notification has been marked as read",
    },
  };
};
