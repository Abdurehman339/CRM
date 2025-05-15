const notificationService = require("../service/notification.service.js");

exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, isRead, page, limit } = req.query;
    const { status, data } = await notificationService.getAllNotifications({
      userId,
      type,
      isRead,
      page,
      limit,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getNotificaiton = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notificationId = req.query.id;
    const { status, data } = await notificationService.getNotificaiton({
      userId,
      notificationId,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notificationId = req.query.id;
    const { status, data } = await notificationService.markAsRead({
      userId,
      notificationId,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log(error);
    }
    next(error);
  }
};
