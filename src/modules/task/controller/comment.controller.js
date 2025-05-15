const commentService = require("../service/comment.service.js");

exports.addComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.query;
    const commentData = req.body;
    const { status, data } = await commentService.addComment({
      taskId,
      userId,
      commentData,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { taskId, page, limit } = req.query;
    const { status, data } = await commentService.getAllComments({
      taskId,
      userId,
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

exports.deleteComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.query;
    const { status, data } = await commentService.deleteComment({
      commentId,
      userId,
    });
    res.status(status).json(data);
  } catch (error) {
    if (process.env.MODE === "dev") {
      console.log(error);
    }
    next(error);
  }
};
