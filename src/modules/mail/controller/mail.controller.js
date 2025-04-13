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

  try {
    const mails = await mailService.sentMail({ userId });
    res.status(200).json(mails);
  } catch (error) {
    console.log("Error fetching sent mails:", error.message);
    res.status(500).json({ message: "Failed to fetch sent mails" });
  }
};

exports.inboxMail = async (req, res) => {
  const userId = req.user._id;

  try {
    const mails = await mailService.inboxMail({ userId });
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
