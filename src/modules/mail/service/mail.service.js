const mongoose = require("mongoose");
const Mail = require("../model/mail.model.js");
const MailDetail = require("../model/mail.detail.model.js");
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
    .populate("receiver.receiverId", "fullName email")
    .populate("sender", "fullName email");

  const mailIds = sentMails.map((mail) => mail._id);

  const mailDetails = await MailDetail.find({
    user: userId,
    mail: { $in: mailIds },
  }).lean();

  const detailMap = {};
  mailDetails.forEach((detail) => {
    detailMap[detail.mail.toString()] = detail;
  });

  const combined = sentMails.map((mail) => {
    const mailObj = mail.toObject();
    const detail = detailMap[mail._id.toString()] || {};

    if (detail.trash) return;

    return {
      ...mailObj,
      detail: {
        starred: detail.starred || false,
        important: detail.important || false,
      },
    };
  });

  return combined;
};

exports.inboxMail = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const inboxMails = await Mail.find({ "receiver.receiverId": userId })
    .sort({ createdAt: -1 })
    .populate("sender", "fullName email")
    .populate("receiver.receiverId", "fullName email");

  const mailIds = inboxMails.map((mail) => mail._id);
  const mailDetails = await MailDetail.find({
    user: userId,
    mail: { $in: mailIds },
  }).lean();

  // Create a map for quick lookup
  const detailMap = {};
  mailDetails.forEach((detail) => {
    detailMap[detail.mail.toString()] = detail;
  });

  // Step 3: Combine mail and detail
  const combined = inboxMails.map((mail) => {
    const mailObj = mail.toObject();
    const detail = detailMap[mail._id.toString()] || {};

    if (detail.trash) return;

    return {
      ...mailObj,
      detail: {
        starred: detail.starred || false,
        important: detail.important || false,
      },
    };
  });

  return combined;
};

exports.getMailbyId = async ({ userId, mailId }) => {
  if (!userId || !mailId) {
    throw new Error("User ID and Mail ID are required");
  }

  const mail = await Mail.findById(mailId)
    .populate("sender", "fullName email")
    .populate("receiver.receiverId", "fullName email");

  if (!mail) {
    throw new Error("Mail not found");
  }

  const mailDetail =
    (await MailDetail.findOne({
      user: userId,
      mail: mailId,
    })) || {};

  if (mailDetail && mailDetail.trash) {
    throw new Error("Mail is in trash");
  }

  return {
    ...mail.toObject(),
    detail: {
      starred: mailDetail.starred || false,
      important: mailDetail.important || false,
    },
  };
};
