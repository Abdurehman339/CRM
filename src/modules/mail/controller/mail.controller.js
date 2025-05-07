const mailService = require("../service/mail.service");

exports.sendMail = async (req, res, next) => {
  const senderId = req.user._id;
  const { receiverIds, subject, body, attachments } = req.body;

  try {
    const mail = await mailService.sendMail({
      senderId,
      receiverIds,
      subject,
      body,
      attachments,
    });
    res.status(201).json(mail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error sending mail:", error.message);
    }
    next(error);
  }
};

exports.sentMail = async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const mails = await mailService.sentMail({ userId, page, limit });
    res.status(200).json(mails);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching sent mails:", error.message);
    }
    next(error);
  }
};

exports.inboxMail = async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const mails = await mailService.inboxMail({ userId, page, limit });
    res.status(200).json(mails);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching inbox mails:", error.message);
    }
    next(error);
  }
};

exports.getMailbyId = async (req, res, next) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const mail = await mailService.getMailbyId({ userId, mailId });
    res.status(200).json(mail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching mail by ID:", error.message);
    }
    next(error);
  }
};

exports.toggleStarred = async (req, res, next) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const updatedMail = await mailService.toggleStarred({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error toggling starred status:", error.message);
    }
    next(error);
  }
};

exports.toggleImportant = async (req, res, next) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const updatedMail = await mailService.toggleImportant({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error toggling important status:", error.message);
    }
    next(error);
  }
};

exports.toggleTrash = async (req, res, next) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const updatedMail = await mailService.toggleTrash({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error toggling trash status:", error.message);
    }
    next(error);
  }
};

exports.addToDraft = async (req, res, next) => {
  const sender = req.user._id;
  const { subject, body, attachments, receiverIds } = req.body;

  try {
    const draft = await mailService.addToDraft({
      sender,
      subject,
      body,
      attachments,
      receiverIds,
    });
    res.status(201).json(draft);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error adding to draft:", error.message);
    }
    next(error);
  }
};

exports.removeDraft = async (req, res, next) => {
  const userId = req.user._id;
  const mailId = req.params.id;

  try {
    const updatedMail = await mailService.removeDraft({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error removing draft:", error.message);
    }
    next(error);
  }
};

exports.getDraft = async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const drafts = await mailService.getDrafts({ userId, page, limit });
    res.status(200).json(drafts);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching drafts:", error.message);
    }
    next(error);
  }
};

exports.getImportant = async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const importantMails = await mailService.getImportant({
      userId,
      page,
      limit,
    });
    res.status(200).json(importantMails);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching important mails:", error.message);
    }
    next(error);
  }
};

exports.getStarred = async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const starredMails = await mailService.getStarred({ userId, page, limit });
    res.status(200).json(starredMails);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching starred mails:", error.message);
    }
    next(error);
  }
};

exports.getTrash = async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const trashMails = await mailService.getTrash({ userId, page, limit });
    res.status(200).json(trashMails);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error fetching trash mails:", error.message);
    }
    next(error);
  }
};

exports.removeTrash = async (req, res, next) => {
  const userId = req.user._id;
  const mailId = req.params.id;

  try {
    const updatedMail = await mailService.removeTrash({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    if (process.env.MODE == "dev") {
      console.log("Error removing from trash:", error.message);
    }
    next(error);
  }
};
