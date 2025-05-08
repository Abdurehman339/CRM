const Holiday = require("../model/holiday.model");

exports.addHoliday = async ({ userId, holidayData }) => {
  if (
    !holidayData.ReasonForTimeoff ||
    !holidayData.TimeSheet ||
    !holidayData.Department ||
    !holidayData.Position ||
    !holidayData.LeaveType
  ) {
    return {
      status: 400,
      data: { message: "Missing required fields" },
    };
  }

  holidayData.AddedBy = userId;
  const holiday = new Holiday(holidayData);

  await holiday.save();

  return {
    status: 200,
    data: {
      holiday,
    },
  };
};

exports.getHoliday = async ({ holidayId }) => {
  if (!holidayId) {
    return {
      status: 400,
      data: { message: "Holiday ID is required" },
    };
  }

  const holiday = await Holiday.findById(holidayId).populate(
    "AddedBy",
    "FullName"
  );

  if (!holiday) {
    return {
      status: 404,
      data: { message: "Holiday not found" },
    };
  }

  return {
    status: 200,
    data: {
      holiday,
    },
  };
};

exports.getAllHolidays = async ({ leaveType }) => {
  const filter = {};

  if (leaveType) filter.LeaveType = leaveType;

  const holidays = await Holiday.find(filter).populate("AddedBy", "FullName");

  return {
    status: 200,
    data: {
      holidays,
    },
  };
};

exports.updateHoliday = async ({ holidayId, holidayData }) => {
  if (!holidayId) {
    return {
      status: 400,
      data: { message: "Holiday ID is required" },
    };
  }

  const holiday = await Holiday.findById(holidayId);
  if (!holiday) {
    return {
      status: 404,
      data: { message: "Holiday not found" },
    };
  }

  Object.assign(holiday, holidayData);
  await holiday.save();

  return {
    status: 200,
    data: {
      holiday,
    },
  };
};

exports.deleteHoliday = async ({ holidayId }) => {
  if (!holidayId) {
    return {
      status: 400,
      data: { message: "Holiday ID is required" },
    };
  }

  const holiday = await Holiday.findById(holidayId);
  if (!holiday) {
    return {
      status: 404,
      data: { message: "Holiday not found" },
    };
  }

  await Holiday.deleteOne({ _id: holidayId });

  return {
    status: 200,
    data: { message: "Holiday deleted successfully" },
  };
};
