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

  const senderMailDetail = new MailDetail({
    user: senderId,
    mail: newMail._id,
  });
  await senderMailDetail.save();

  receiverList.map((receiver) => {
    const receiverMailDetail = new MailDetail({
      user: receiver.receiverId,
      mail: newMail._id,
    });
    receiverMailDetail.save();
  });

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
    permanentlyDeleted: false,
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

  const filteredMails = combined.filter(Boolean);

  return filteredMails;
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
    permanentlyDeleted: false,
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

  return {
    ...mail.toObject(),
    detail: {
      starred: mailDetail.starred || false,
      important: mailDetail.important || false,
      trash: mailDetail.trash || false,
      permanentlyDeleted: mailDetail.permanentlyDeleted || false,
    },
  };
};

exports.toggleStarred = async ({ userId, mailId }) => {
  if (!userId || !mailId) {
    throw new Error("User ID and Mail ID are required");
  }
  const mailDetail = await MailDetail.findOne({
    user: userId,
    mail: mailId,
  });
  if (mailDetail) {
    mailDetail.starred = !mailDetail.starred;
    await mailDetail.save();
  } else {
    const newMailDetail = new MailDetail({
      user: userId,
      mail: mailId,
      starred: true,
    });
    await newMailDetail.save();
  }

  return {
    message: "Mail starred status toggled",
    starred: mailDetail ? mailDetail.starred : true,
  };
};

exports.toggleImportant = async ({ userId, mailId }) => {
  if (!userId || !mailId) {
    throw new Error("User ID and Mail ID are required");
  }
  const mailDetail = await MailDetail.findOne({
    user: userId,
    mail: mailId,
  });
  if (mailDetail) {
    mailDetail.important = !mailDetail.important;
    await mailDetail.save();
  } else {
    const newMailDetail = new MailDetail({
      user: userId,
      mail: mailId,
      important: true,
    });
    await newMailDetail.save();
  }

  return {
    message: "Mail important status toggled",
    important: mailDetail ? mailDetail.important : true,
  };
};

exports.toggleTrash = async ({ userId, mailId }) => {
  if (!userId || !mailId) {
    throw new Error("User ID and Mail ID are required");
  }

  const mailDetail = await MailDetail.findOne({
    user: userId,
    mail: mailId,
  });
  if (mailDetail) {
    mailDetail.trash = !mailDetail.trash;
    mailDetail.important = false;
    mailDetail.starred = false;
    await mailDetail.save();
  } else {
    const newMailDetail = new MailDetail({
      user: userId,
      mail: mailId,
      trash: true,
      important: false,
      starred: false,
    });
    await newMailDetail.save();
  }

  return {
    message: "Mail moved to trash",
    trash: mailDetail ? mailDetail.trash : true,
  };
};

exports.addToDraft = async ({
  sender,
  subject,
  body,
  attachments,
  receiverIds,
}) => {
  if (
    !sender &&
    !receiverIds &&
    receiverIds.length === 0 &&
    !subject &&
    !body
  ) {
    throw new Error("Missing required fields");
  }

  let receiverList;
  if (receiverIds || receiverIds.length !== 0) {
    for (const receiverId of receiverIds) {
      if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        throw new Error(`Invalid receiver ID format: ${receiverId}`);
      }

      const receiverExists = await User.findById(receiverId);
      if (!receiverExists) {
        throw new Error(`Receiver not found with ID: ${receiverId}`);
      }
    }
    receiverList = receiverIds.map((id) => ({
      receiverId: id,
      seen: false,
    }));
  }

  const newMail = new Mail({
    sender,
    receiver: receiverList,
    subject: subject || "",
    body: body || "",
    attachments: attachments || [],
    isDraft: true,
  });

  const savedMail = await newMail.save();
  return savedMail;
};

exports.removeDraft = async ({ userId, mailId }) => {
  if (!userId || !mailId) {
    throw new Error("User ID and Mail ID are required");
  }

  const mail = await Mail.findById(mailId);

  if (!mail) {
    throw new Error("Mail not found");
  }

  // Ensure the mail is a draft
  if (!mail.isDraft) {
    throw new Error("This is not a draft mail");
  }

  // Remove mail detail entry if exists
  await MailDetail.findOneAndDelete({
    user: userId,
    mail: mailId,
  });

  // Remove the actual draft mail
  await Mail.findByIdAndDelete(mailId);

  return {
    message: "Draft removed successfully",
    mailId,
  };
};

exports.getDrafts = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const drafts = await Mail.find({ sender: userId, isDraft: true })
    .sort({ createdAt: -1 })
    .populate("receiver.receiverId", "fullName email")
    .populate("sender", "fullName email");

  const filteredDrafts = await Promise.all(
    drafts.map(async (draft) => {
      const detail = await MailDetail.findOne({
        user: userId,
        mail: draft._id,
      }).lean();
      if (!detail?.trash || !detail?.permanentlyDeleted) {
        return draft;
      }
    })
  );
  return filteredDrafts;
};

exports.getImportant = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const importantMailDetails = await MailDetail.find({
    user: userId,
    important: true,
    trash: false,
    permanentlyDeleted: false,
  });

  const importantMails = await Promise.all(
    importantMailDetails.map(async (mail) => {
      const importantMail = await Mail.findById(mail.mail)
        .populate("sender", "fullName email")
        .populate("receiver.receiverId", "fullName email");
      if (!importantMail) {
        throw new Error("Mail not found");
      }
      return {
        ...importantMail.toObject(),
        detail: {
          starred: mail.starred || false,
          important: mail.important || false,
          trash: mail.trash || false,
          permanentlyDeleted: mail.permanentlyDeleted || false,
        },
      };
    })
  );
  return importantMails;
};

exports.getStarred = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const starredMailDetails = await MailDetail.find({
    user: userId,
    starred: true,
    trash: false,
    permanentlyDeleted: false,
  });

  const starredMails = await Promise.all(
    starredMailDetails.map(async (mail) => {
      const starredMail = await Mail.findById(mail.mail)
        .populate("sender", "fullName email")
        .populate("receiver.receiverId", "fullName email");
      if (!starredMail) {
        throw new Error("Mail not found");
      }
      return {
        ...starredMail.toObject(),
        detail: {
          starred: mail.starred || false,
          important: mail.important || false,
          trash: mail.trash || false,
          permanentlyDeleted: mail.permanentlyDeleted || false,
        },
      };
    })
  );
  return starredMails;
};

exports.getTrash = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const trashMailDetails = await MailDetail.find({
    user: userId,
    trash: true,
    permanentlyDeleted: false,
  });

  const trashMails = await Promise.all(
    trashMailDetails.map(async (mail) => {
      const trashMail = await Mail.findById(mail.mail)
        .populate("sender", "fullName email")
        .populate("receiver.receiverId", "fullName email");
      if (!trashMail) {
        throw new Error("Mail not found");
      }
      return {
        ...trashMail.toObject(),
        detail: {
          starred: mail.starred || false,
          important: mail.important || false,
          trash: mail.trash || false,
          permanentlyDeleted: mail.permanentlyDeleted || false,
        },
      };
    })
  );
  return trashMails;
};

exports.removeTrash = async ({ userId, mailId }) => {
  if (!userId || !mailId) {
    throw new Error("User ID and Mail ID are required");
  }

  console.log("User ID:", userId);

  const mailDetail = await MailDetail.findOneAndUpdate(
    {
      user: userId,
      mail: mailId,
      trash: true,
    },
    {
      permanentlyDeleted: true,
      trash: false,
    },
    { new: true }
  );

  if (!mailDetail) {
    throw new Error("Mail not found in trash");
  }

  const remainingDetails = await MailDetail.find({ mail: mailId });

  const allDeleted = remainingDetails.every(
    (detail) => detail.permanentlyDeleted
  );

  if (allDeleted) {
    await Mail.findByIdAndDelete(mailId);
    await MailDetail.deleteMany({ mail: mailId });
  }

  return {
    message: "Mail removed from trash",
    mailDetail,
  };
};
