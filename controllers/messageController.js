const Message = require("../models/message");

const getChatHistory = async (req, res) => {
  console.log("heeki");
  const { otherUserId } = req.params;
  const userId = req.user.id;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
    // .populate("sender", "username")
    // .populate("receiver", "username");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const chatPartners = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      // {
      //   $group:
      // }
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChatHistory, chatPartners };
