const holidayService = require("../service/holiday.service");

exports.addHoliday = async (req, res, next) => {
  try {
    const holidayData = req.body;
    const userId = req.user._id;
    const { status, data } = await holidayService.addHoliday({
      userId,
      holidayData,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getHoliday = async (req, res, next) => {
  try {
    const { holidayId } = req.query;
    const { status, data } = await holidayService.getHoliday({ holidayId });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getAllHolidays = async (req, res, next) => {
  try {
    const { leaveType } = req.query;
    const { status, data } = await holidayService.getAllHolidays({
      leaveType,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.updateHoliday = async (req, res, next) => {
  try {
    const { holidayId } = req.query;
    const holidayData = req.body;
    const { status, data } = await holidayService.updateHoliday({
      holidayId,
      holidayData,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.deleteHoliday = async (req, res, next) => {
  try {
    const { holidayId } = req.query;
    const { status, data } = await holidayService.deleteHoliday({
      holidayId,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};
