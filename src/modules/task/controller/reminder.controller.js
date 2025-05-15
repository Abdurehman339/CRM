const reminderService = require("../service/reminder.service.js");

exports.createReminder = async (req, res, next) => {
  try {
    const { taskId } = req.query;
    const reminderCreator = req.user._id;
    const { dateToNotify, userId, description, sendEmail } = req.body;
    const { status, data } = await reminderService.createReminder({
      taskId,
      dateToNotify,
      userId,
      description,
      sendEmail,
      reminderCreator,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getReminder = async (req, res, next) => {
  try {
    const { taskId, page, limit } = req.query;
    const { status, data } = await reminderService.getReminder({
      taskId,
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

exports.updateReminder = async (req, res, next) => {
  try {
    const reminderCreator = req.user._id;
    const { reminderId } = req.query;
    const { dateToNotify, description, user, sendEmail } = req.body;
    const { status, data } = await reminderService.updateReminder({
      reminderId,
      reminderCreator,
      dateToNotify,
      description,
      user,
      sendEmail,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    const reminderCreator = req.user._id;
    const { reminderId } = req.query;
    const { status, data } = await reminderService.deleteReminder({
      reminderId,
      reminderCreator,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};
