const hrmService = require("../service/hrm.service.js");

exports.getDefaultRBAC = (req, res, next) => {
  try {
    const { role } = req.query;
    const { status, data } = hrmService.getDefaultRBAC(role);
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.error(error);
    }
    next(error);
  }
};

exports.addStaffMember = async (req, res, next) => {
  try {
    const userData = req.body;
    const { status, data } = await hrmService.addStaffMember({ userData });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error adding staff member:", error.message);
    }
    next(error);
  }
};

exports.getMember = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const { status, data } = await hrmService.getMember({ userId });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching member:", error.message);
    }
    next(error);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const { status, data } = await hrmService.deleteMember({ userId });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error deleting member:", error.message);
    }
    next(error);
  }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const { status, data } = await hrmService.getAllMembers({
      role,
      status: req.query.status,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching all members:", error.message);
    }
    next(error);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const userData = req.body;
    const { status, data } = await hrmService.updateMember({
      userId,
      userData,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error updating member:", error.message);
    }
    next(error);
  }
};
