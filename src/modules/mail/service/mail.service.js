const mongoose = require("mongoose");
const Mail = require("../model/mail.model.js");
const User = require("../../user/model/user.model.js");

exports.sendMail = async ({
  senderId,
  receiverIds,
  subject,
  body,
  attachments,
}) => {
  if (
    !senderId ||
    !receiverIds ||
    receiverIds.length === 0 ||
    !subject ||
    !body
  ) {
    throw new Error("Missing required fields");
  }

  for (const receiverId of receiverIds) {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      throw new Error(`Invalid receiver ID format: ${receiverId}`);
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      throw new Error(`Receiver not found with ID: ${receiverId}`);
    }
  }

  const receiverList = receiverIds.map((id) => ({
    receiverId: id,
    seen: false,
  }));

  const newMail = new Mail({
    sender: senderId,
    receiver: receiverList,
    subject,
    body,
    attachments: attachments || [],
    isDraft: false,
  });

  const savedMail = await newMail.save();
  return savedMail;
};

exports.sentMail = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const sentMails = await Mail.find({ sender: userId })
    .sort({ createdAt: -1 })
    .populate("receiver.receiverId", "fullName email") // populating receiver basic info
    .populate("sender", "fullName email"); // optionally populate sender info too

  return sentMails;
};

exports.inboxMail = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const inboxMails = await Mail.find({ "receiver.receiverId": userId })
    .sort({ createdAt: -1 })
    .populate("sender", "fullName email") // show sender's basic info
    .populate("receiver.receiverId", "fullName email"); // populate receiver info (optional)

  return inboxMails;
};
