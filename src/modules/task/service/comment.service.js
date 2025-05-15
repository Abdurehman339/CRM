const taskService = require("../service/task.service.js");
const Comment = require("../model/comment.model.js");
const mongoose = require("mongoose");

exports.addComment = async ({ taskId, userId, commentData }) => {
  if (!commentData.body || commentData.body.trim() === "") {
    return { status: 400, data: { message: "Comment body is required" } };
  }
  const task = await taskService.getTask({ taskId });
  if (task.status >= 400) {
    return {
      status: task.status,
      data: task.data,
    };
  }

  const comment = await Comment.create({
    Task: taskId,
    Author: userId,
    Body: commentData.body,
    Attachments: commentData.attachments || [],
  });

  return {
    status: 200,
    data: comment,
  };
};

exports.getAllComments = async ({ taskId, userId, page = 1, limit = 5 }) => {
  const task = await taskService.getTask({ taskId });
  if (task.status >= 400) {
    return {
      status: task.status,
      data: task.data,
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const comments = await Comment.find({ Task: taskId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("Author", "FullName Email");

  return {
    status: 200,
    data: {
      comments,
    },
  };
};

exports.deleteComment = async ({ commentId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return { status: 400, data: { message: "Invalid Comment ID" } };
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return { status: 404, data: { message: "Comment not found" } };
  }

  if (!comment.Author.equals(userId)) {
    return {
      status: 403,
      data: { message: "You are not authorized to delete this comment" },
    };
  }

  await Comment.findByIdAndDelete(commentId);

  return {
    status: 200,
    data: { message: "Comment deleted successfully" },
  };
};
