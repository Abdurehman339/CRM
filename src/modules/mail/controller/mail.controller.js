const mailService = require("../service/mail.service");

exports.sendMail = async (req, res) => {
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
    console.log("Error sending mail:", error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.sentMail = async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const mails = await mailService.sentMail({ userId, page, limit });
    res.status(200).json(mails);
  } catch (error) {
    console.log("Error fetching sent mails:", error.message);
    res.status(500).json({ message: "Failed to fetch sent mails" });
  }
};

exports.inboxMail = async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const mails = await mailService.inboxMail({ userId, page, limit });
    res.status(200).json(mails);
  } catch (error) {
    console.log("Error fetching inbox mails:", error.message);
    res.status(500).json({ message: "Failed to fetch inbox mails" });
  }
};

exports.getMailbyId = async (req, res) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const mail = await mailService.getMailbyId({ userId, mailId });
    res.status(200).json(mail);
  } catch (error) {
    console.log("Error fetching mail by ID:", error.message);
    res.status(500).json({ message: "Failed to fetch mail" });
  }
};

exports.toggleStarred = async (req, res) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const updatedMail = await mailService.toggleStarred({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    console.log("Error toggling starred status:", error.message);
    res.status(500).json({ message: "Failed to toggle starred status" });
  }
};

exports.toggleImportant = async (req, res) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const updatedMail = await mailService.toggleImportant({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    console.log("Error toggling important status:", error.message);
    res.status(500).json({ message: "Failed to toggle important status" });
  }
};

exports.toggleTrash = async (req, res) => {
  const userId = req.user._id;
  const mailId = req.params.id;
  try {
    const updatedMail = await mailService.toggleTrash({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    console.log("Error toggling trash status:", error.message);
    res.status(500).json({ message: "Failed to toggle trash status" });
  }
};

exports.addToDraft = async (req, res) => {
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
    console.log("Error adding to draft:", error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.removeDraft = async (req, res) => {
  const userId = req.user._id;
  const mailId = req.params.id;

  try {
    const updatedMail = await mailService.removeDraft({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    console.log("Error removing draft:", error.message);
    res.status(500).json({ message: "Failed to remove draft" });
  }
};

exports.getDraft = async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const drafts = await mailService.getDrafts({ userId, page, limit });
    res.status(200).json(drafts);
  } catch (error) {
    console.log("Error fetching drafts:", error.message);
    res.status(500).json({ message: "Failed to fetch drafts" });
  }
};

exports.getImportant = async (req, res) => {
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
    console.log("Error fetching important mails:", error.message);
    res.status(500).json({ message: "Failed to fetch important mails" });
  }
};

exports.getStarred = async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const starredMails = await mailService.getStarred({ userId, page, limit });
    res.status(200).json(starredMails);
  } catch (error) {
    console.log("Error fetching starred mails:", error.message);
    res.status(500).json({ message: "Failed to fetch starred mails" });
  }
};

exports.getTrash = async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;

  try {
    const trashMails = await mailService.getTrash({ userId, page, limit });
    res.status(200).json(trashMails);
  } catch (error) {
    console.log("Error fetching trash mails:", error.message);
    res.status(500).json({ message: "Failed to fetch trash mails" });
  }
};

exports.removeTrash = async (req, res) => {
  const userId = req.user._id;
  const mailId = req.params.id;

  try {
    const updatedMail = await mailService.removeTrash({ userId, mailId });
    res.status(200).json(updatedMail);
  } catch (error) {
    console.log("Error removing from trash:", error.message);
    res.status(500).json({ message: "Failed to remove from trash" });
  }
};
